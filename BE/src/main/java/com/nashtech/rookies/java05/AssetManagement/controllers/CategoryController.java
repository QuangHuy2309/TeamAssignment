package com.nashtech.rookies.java05.AssetManagement.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.CategoryDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Category;
import com.nashtech.rookies.java05.AssetManagement.exceptions.InvalidDataException;
import com.nashtech.rookies.java05.AssetManagement.payload.MessageResponse;
import com.nashtech.rookies.java05.AssetManagement.services.CategoryService;
import com.nashtech.rookies.java05.AssetManagement.utils.HelperFunction;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class CategoryController {
	@Autowired
	private CategoryService categoryService;
	
	@Autowired
	private HelperFunction helperFunction;
	
	@GetMapping("/categories")
	public ResponseEntity<?> findAllCategory() {
		List<Category> categories = categoryService.findAllCategory();
		List<CategoryDTO> categoriesDto = categories.stream().map(categoryService::convertToDto)
				.collect(Collectors.toList());
		return new ResponseEntity<List<CategoryDTO>>(categoriesDto, HttpStatus.OK);
	}
	
	
	@PostMapping("/categories")
	public ResponseEntity<?> createCategory(@RequestBody CategoryDTO categoryDto) {
		if(categoryDto.getPrefix()==null||categoryDto.getName()==null) {
			throw new InvalidDataException("Error: Missing some field.");
		}
		

		categoryDto.setName(categoryDto.getName().trim().replaceAll(" +", " "));
		categoryDto.setPrefix(categoryDto.getPrefix().trim().toUpperCase());
		
		if(categoryDto.getPrefix()==""||categoryDto.getName()=="") {
			throw new InvalidDataException("Error: Field must not empty");
		}
		
		if(categoryDto.getPrefix().contains(" ")) {
			throw new InvalidDataException("Error: Category prefix must not contains white space");
		}

		boolean checkIfNameHasSpecialChar = helperFunction.checkIfStringContainSpecialChar(categoryDto.getName());
		if(checkIfNameHasSpecialChar) {
			throw new InvalidDataException("Error: Category name must not have special character");
		}
		
		boolean checkIfPrefixHasSpecialChar = helperFunction.checkIfStringContainSpecialChar(categoryDto.getPrefix());
		if(checkIfPrefixHasSpecialChar) {
			throw new InvalidDataException("Error: Category prefix must not have special character");
		}
		
		boolean checkIfPrefixHasDigit = helperFunction.checkIfStringContainDigit(categoryDto.getPrefix());
		if(checkIfPrefixHasDigit) {
			throw new InvalidDataException("Error: Category prefix must not have digit");
		}
		
		
		if (categoryService.existByName(categoryDto.getName())) {
			throw new InvalidDataException("Error: Category is already existed. Please enter a different category");
		}
		if (categoryService.existByPrefix(categoryDto.getPrefix())) {
			throw new InvalidDataException("Error: Prefix is already existed. Please enter a different prefix");
		}

		Category categoryCreated = categoryService.createCategory(categoryService.convertToEntity(categoryDto));
		if (categoryCreated == null) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Create Category failed."));
		}
		return new ResponseEntity<CategoryDTO>(categoryService.convertToDto(categoryCreated), HttpStatus.OK);
	}
}
