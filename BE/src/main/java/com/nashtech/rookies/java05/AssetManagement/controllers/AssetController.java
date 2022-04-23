package com.nashtech.rookies.java05.AssetManagement.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.AssetDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.DTO.AssignmentDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Asset;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Assignment;
import com.nashtech.rookies.java05.AssetManagement.exceptions.InvalidDataException;
import com.nashtech.rookies.java05.AssetManagement.exceptions.ObjectNotFoundException;
import com.nashtech.rookies.java05.AssetManagement.payload.MessageResponse;
import com.nashtech.rookies.java05.AssetManagement.services.AssetService;
import com.nashtech.rookies.java05.AssetManagement.services.AssignmentService;
import com.nashtech.rookies.java05.AssetManagement.services.CategoryService;
import com.nashtech.rookies.java05.AssetManagement.utils.ASSET_STATUS;
import com.nashtech.rookies.java05.AssetManagement.utils.ASSIGNMENT_STATUS;
import com.nashtech.rookies.java05.AssetManagement.utils.HelperFunction;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class AssetController {
	@Autowired
	private AssetService assetService;

	@Autowired
	private CategoryService categoryService;

	@Autowired
	private AssignmentService assignmentService;

	@Autowired
	private HelperFunction helperFunction;

	@GetMapping("/assets")
	public ResponseEntity<?> findAllAssetsByAdminLocation(HttpServletRequest request,
			@RequestParam(name = "state", required = false) List<Integer> state,
			@RequestParam(name = "categoryId", required = false) List<String> categoryId) {
		String location = helperFunction.getAdminLocationByJwt(request);

		List<Asset> assetsByLocation = assetService.findAllAssetByLocation(location);
		if (state != null && !state.isEmpty()) {
			List<Asset> assetsHolder = new ArrayList<Asset>();
			for (int s : state) {
				assetsHolder
						.addAll(assetsByLocation.stream().filter(a -> a.getState() == s).collect(Collectors.toList()));
			}
			assetsByLocation.clear();
			assetsByLocation.addAll(assetsHolder);
		}
		if (categoryId != null) {
			List<Asset> assetsHolder = new ArrayList<Asset>();
			for (String c : categoryId) {
				assetsHolder.addAll(assetsByLocation.stream()
						.filter(a -> a.getCategory() == categoryService.findByPrefix(c)).collect(Collectors.toList()));
			}
			assetsByLocation.clear();
			assetsByLocation.addAll(assetsHolder);
		}
		if (assetsByLocation == null) {
			throw new ObjectNotFoundException("Error: Cannot found any asset in " + location);
		}
		List<AssetDTO> assetsDto = assetsByLocation.stream().map(assetService::convertToDto)
				.collect(Collectors.toList());
		return new ResponseEntity<List<AssetDTO>>(assetsDto, HttpStatus.OK);
	}

	@GetMapping("/assets/search")
	public List<AssetDTO> searchAsset(@RequestParam(name = "criteria") String search,
			@RequestParam(name = "location") String location,
			@RequestParam(name = "state", required = false) String state) {
		if (state != null)
			return assetService.searchAsset(search, location).stream().map(assetService::convertToDto)
					.collect(Collectors.toList());
		return assetService.searchAssetAvailable(search, location).stream().map(assetService::convertToDto)
				.collect(Collectors.toList());
	}

	@PostMapping("/assets")
	public ResponseEntity<?> createAsset(HttpServletRequest request, @RequestBody AssetDTO assetDTO) {

		String location = helperFunction.getAdminLocationByJwt(request);

		if (assetDTO.getCategoryId() == null || assetDTO.getName() == null || assetDTO.getSpecification() == null
				|| assetDTO.getInstalledDate() == null || assetDTO.getState() == 0) {
			throw new InvalidDataException("Error: Missing some field.");
		}

		assetDTO.setCategoryId(assetDTO.getCategoryId().trim());
		assetDTO.setName(assetDTO.getName().trim().replaceAll(" +", " "));
		assetDTO.setSpecification(assetDTO.getSpecification().trim().replaceAll(" +", " "));

		if (assetDTO.getCategoryId() == "" || assetDTO.getName() == "" || assetDTO.getSpecification() == "") {
			throw new InvalidDataException("Error: Field must not empty");
		}

		boolean checkIfNameHasSpecialChar = helperFunction.checkIfStringContainSpecialChar(assetDTO.getName());
		if (checkIfNameHasSpecialChar) {
			throw new InvalidDataException("Error: Asset name must not have special character");
		}

		boolean checkIfCategoryExist = categoryService.existByPrefix(assetDTO.getCategoryId());
		if (!checkIfCategoryExist) {
			throw new ObjectNotFoundException(
					"Error: Category with prefix " + assetDTO.getCategoryId() + " not found!");
		}
		assetDTO.setLocation(location);

		Asset assetCreated = assetService.createAsset(assetService.convertToEntity(assetDTO));
		if (assetCreated == null) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Create Asset failed."));
		}
		return new ResponseEntity<AssetDTO>(assetService.convertToDto(assetCreated), HttpStatus.OK);
	}

	@PutMapping("/assets/{assetId}")
	public ResponseEntity<?> updateAsset(@RequestBody AssetDTO assetDTO, @PathVariable String assetId) {
		Asset assetNeedToUpdate = assetService.findAssetById(assetId);
		if (assetNeedToUpdate == null) {
			throw new ObjectNotFoundException("Error: Asset with id " + assetId + " not found!");
		}

		if (assetNeedToUpdate.getState() == ASSET_STATUS.ASSIGNED) {
			throw new InvalidDataException("Error: Cannot update assigned asset");
		}

		if (assetDTO.getName() == null || assetDTO.getSpecification() == null || assetDTO.getInstalledDate() == null
				|| assetDTO.getState() == 0) {
			throw new InvalidDataException("Error: Missing some field.");
		}

		assetDTO.setName(assetDTO.getName().trim().replaceAll(" +", " "));
		assetDTO.setSpecification(assetDTO.getSpecification().trim().replaceAll(" +", " "));

		if (assetDTO.getName() == "" || assetDTO.getSpecification() == "") {
			throw new InvalidDataException("Error: Field must not empty");
		}

		boolean checkIfNameHasSpecialChar = helperFunction.checkIfStringContainSpecialChar(assetDTO.getName());
		if (checkIfNameHasSpecialChar) {
			throw new InvalidDataException("Error: Asset name must not have special character");
		}

		Asset assetUpdated = assetService.updateAsset(assetId, assetDTO);
		if (assetUpdated == null) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Update Asset failed."));
		}

		return new ResponseEntity<AssetDTO>(assetService.convertToDto(assetUpdated), HttpStatus.OK);
	}

	@GetMapping("/assets/{assetId}")
	public ResponseEntity<?> findAssetById(@PathVariable String assetId) {
		Asset asset = assetService.findAssetById(assetId);
		if (asset == null) {
			throw new ObjectNotFoundException("Error: Asset " + assetId + " not found.");
		}
		return new ResponseEntity<AssetDTO>(assetService.convertToDto(asset), HttpStatus.OK);
	}

	@DeleteMapping("/assets/{assetId}")
	public ResponseEntity<?> deleteAssetById(@PathVariable String assetId) {
		Asset asset = assetService.findAssetById(assetId);
		if (asset == null) {
			throw new ObjectNotFoundException("Error: Asset " + assetId + " not found.");
		}

		boolean checkIfAssetHasAssignmentHistoryNotDeclined = assignmentService.existsByAssetAndStatusNot(asset,
				ASSIGNMENT_STATUS.REJECTED);
		if (checkIfAssetHasAssignmentHistoryNotDeclined) {
			return ResponseEntity.badRequest().body(new MessageResponse(
					"Error: Cannot delete the asset because it belongs to one or more historical assignments"));
		}

		boolean assetDeleted = assetService.deleteAssetById(assetId);
		return (assetDeleted) ? new ResponseEntity<Void>(HttpStatus.OK)
				: ResponseEntity.badRequest().body(new MessageResponse("Error: Delete asset failed"));
	}

	@GetMapping("/assets/{assetId}/assignments")
	public ResponseEntity<?> findAssignmentByAsset(@PathVariable String assetId,
			@RequestParam(name = "state", required = false) List<Integer> state,
			@RequestParam(name = "notState", required = false) List<Integer> notState) {
		Asset asset = assetService.findAssetById(assetId);
		if (asset == null) {
			throw new ObjectNotFoundException("Error: Asset " + assetId + " not found.");
		}
		List<Assignment> assignmentByAsset = asset.getAssignments();
		if (state != null && !state.isEmpty()) {
			List<Assignment> assignmentHolder = new ArrayList<Assignment>();
			for (int s : state) {
				assignmentHolder
						.addAll(assignmentByAsset.stream().filter(a -> a.getStatus() == s).collect(Collectors.toList()));
			}
			assignmentByAsset.clear();
			assignmentByAsset.addAll(assignmentHolder);
		}
		if (notState != null && !notState.isEmpty()) {
			List<Assignment> assignmentHolder = new ArrayList<Assignment>();
			for (int s : notState) {
				assignmentHolder
						.addAll(assignmentByAsset.stream().filter(a -> a.getStatus() != s).collect(Collectors.toList()));
			}
			assignmentByAsset.clear();
			assignmentByAsset.addAll(assignmentHolder);
		}
		List<AssignmentDTO> assignmentByAssetDto = assignmentByAsset.stream().map(assignmentService::convertToDTO)
				.collect(Collectors.toList());
		return new ResponseEntity<List<AssignmentDTO>>(assignmentByAssetDto, HttpStatus.OK);
	}
}
