package com.nashtech.rookies.java05.AssetManagement.services.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.CategoryDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Category;
import com.nashtech.rookies.java05.AssetManagement.Repository.CategoryRepository;
import com.nashtech.rookies.java05.AssetManagement.services.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService{
	@Autowired
	private CategoryRepository categoryRepo;
	
	@Autowired
	private ModelMapper modelMapper;
	
	@Override
	public List<Category> findAllCategory() {
		return categoryRepo.findAll(Sort.by(Sort.Direction.ASC, "prefix"));
	}

	@Override
	public boolean existByPrefix(String prefix) {
		return categoryRepo.existsById(prefix);
	}

	@Override
	public boolean existByName(String name) {
		return categoryRepo.existsCategoryByName(name);
	}

	@Override
	public Category createCategory(Category category) {
		return categoryRepo.save(category);
	}

	@Override
	public CategoryDTO convertToDto(Category category) {
		CategoryDTO categoryDTO = modelMapper.map(category, CategoryDTO.class);
		return categoryDTO;
	}

	@Override
	public Category convertToEntity(CategoryDTO categoryDto) {
		Category category = modelMapper.map(categoryDto, Category.class);
		return category;
	}

	@Override
	public Category findByPrefix(String prefix) {
		return categoryRepo.findById(prefix).orElse(null);
	}
}
