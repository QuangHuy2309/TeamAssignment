package com.nashtech.rookies.java05.AssetManagement.services.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.AssetDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Asset;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Category;
import com.nashtech.rookies.java05.AssetManagement.Repository.AssetRepository;
import com.nashtech.rookies.java05.AssetManagement.services.AssetService;
import com.nashtech.rookies.java05.AssetManagement.services.CategoryService;

@Service
public class AssetServiceImpl implements AssetService {
	@Autowired
	private AssetRepository assetRepo;

	@Autowired
	private CategoryService categoryService;

	@Autowired
	private ModelMapper mapper;

	@Override
	public List<Asset> findAllAsset() {
		return assetRepo.findAll(Sort.by(Sort.Direction.ASC, "id"));
	}

	@Override
	public List<Asset> findAllAssetByLocation(String location) {
		return assetRepo.findByLocationOrderByIdAsc(location).orElse(null);
	}

	@Override
	public AssetDTO convertToDto(Asset asset) {
		AssetDTO assetDTO = mapper.map(asset, AssetDTO.class);
		assetDTO.setCategoryId(asset.getCategory().getPrefix());
		assetDTO.setCategoryName(asset.getCategory().getName());
		return assetDTO;
	}

	@Override
	public Asset convertToEntity(AssetDTO assetDTO) {
		Asset asset = mapper.map(assetDTO, Asset.class);
		Category category = categoryService.findByPrefix(assetDTO.getCategoryId());
		if (category == null) {
			return null;
		}
		asset.setCategory(category);
		return asset;
	}

	@Override
	public List<Asset> searchAsset(String searchText, String location) {
		if (searchText == null || searchText.trim().length() == 0)
			return assetRepo.findByLocationOrderByIdAsc(location).orElse(null);
		return assetRepo.searchAsset(searchText.toUpperCase(), location);
	}

	@Override
	public List<Asset> searchAssetAvailable(String searchText, String location) {
		if (searchText == null || searchText.trim().length() == 0)
			return assetRepo.findByLocationOrderByIdAsc(location).orElse(null);
		return assetRepo.searchAssetAvailable(searchText.toUpperCase(), location);
	}

	@Override
	public Asset createAsset(Asset asset) {
		asset.setId(generateAssetId(asset.getCategory().getPrefix()));
		return assetRepo.save(asset);
	}

	@Override
	public String getLastestIdByPrefix(String categoryPrefix) {
		return assetRepo.getLastestIdByPrefix(categoryPrefix).orElse(null);
	}

	private String generateAssetId(String categoryPrefix) {
		String assetLastestId = getLastestIdByPrefix(categoryPrefix);
		if (assetLastestId == null) {
			return categoryPrefix + String.format("%06d", 1);
		}
		assetLastestId = assetLastestId.replaceAll("[^\\d.]", "");
		int newIdInt = Integer.parseInt(assetLastestId) + 1;
		return categoryPrefix + String.format("%06d", newIdInt);
	}

	@Override
	public Asset updateAsset(String assetId, AssetDTO assetDTO) {
		Asset assetNeedToUpdate = assetRepo.getById(assetId);
		assetNeedToUpdate.setName(assetDTO.getName());
		assetNeedToUpdate.setSpecification(assetDTO.getSpecification());
		assetNeedToUpdate.setState(assetDTO.getState());
		assetNeedToUpdate.setInstalledDate(assetDTO.getInstalledDate());
		return assetRepo.save(assetNeedToUpdate);
	}

	@Override
	public Asset updateAssetState(String assetId, int state) {
		Asset assetNeedToUpdate = assetRepo.getById(assetId);
		assetNeedToUpdate.setState(state);
		return assetRepo.save(assetNeedToUpdate);
	}

	@Override
	public Asset findAssetById(String assetId) {
		return assetRepo.findById(assetId).orElse(null);
	}

	@Override
	@Transactional
	public boolean deleteAssetById(String assetId) {
		return assetRepo.findById(assetId).map(asset -> {
			assetRepo.delete(asset);
			return true;
		}).orElse(false);
	}
}
