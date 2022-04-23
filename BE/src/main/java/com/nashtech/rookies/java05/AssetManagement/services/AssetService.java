package com.nashtech.rookies.java05.AssetManagement.services;

import java.util.List;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.AssetDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Asset;

public interface AssetService {
	List<Asset> findAllAsset();
	List<Asset> findAllAssetByLocation(String location);
	Asset createAsset(Asset asset);
	AssetDTO convertToDto (Asset asset);
	Asset convertToEntity(AssetDTO assetDTO);
	List<Asset> searchAsset(String searchText, String location);
	List<Asset> searchAssetAvailable(String searchText, String location);
	String getLastestIdByPrefix(String categoryPrefix);
	Asset updateAsset(String assetId, AssetDTO assetDTO);
	Asset updateAssetState(String assetId, int state);
	Asset findAssetById(String assetId);
	boolean deleteAssetById(String assetId);
}
