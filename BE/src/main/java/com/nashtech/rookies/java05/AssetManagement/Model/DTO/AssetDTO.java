package com.nashtech.rookies.java05.AssetManagement.Model.DTO;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class AssetDTO {
	private String id;
	private String name;
	@JsonFormat(pattern = "yyyy-MM-dd")
	private Date installedDate;
	private int state;
	private String location;
	private String specification;
	private String categoryId;
	private String categoryName;
	
	
	public AssetDTO(String id, String name, Date installedDate, int state, String location, String specification,
			String categoryId, String categoryName) {
		super();
		this.id = id;
		this.name = name;
		this.installedDate = installedDate;
		this.state = state;
		this.location = location;
		this.specification = specification;
		this.categoryId = categoryId;
		this.categoryName = categoryName;
	}
	public AssetDTO() {
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Date getInstalledDate() {
		return installedDate;
	}
	public void setInstalledDate(Date installedDate) {
		this.installedDate = installedDate;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getSpecification() {
		return specification;
	}
	public void setSpecification(String specification) {
		this.specification = specification;
	}
	public String getCategoryId() {
		return categoryId;
	}
	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}
	public String getCategoryName() {
		return categoryName;
	}
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
	
	
}
