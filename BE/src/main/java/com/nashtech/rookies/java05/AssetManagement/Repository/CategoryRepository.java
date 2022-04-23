package com.nashtech.rookies.java05.AssetManagement.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Category;

public interface CategoryRepository extends JpaRepository<Category, String> {
	boolean existsCategoryByName(String name);
	
	@Query(value = "Select * FROM final.category c WHERE c.prefix = :prefix", nativeQuery = true) 
	Optional<Category> findByPrefix(String prefix);
}
