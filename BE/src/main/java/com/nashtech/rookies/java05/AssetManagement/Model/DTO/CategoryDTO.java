package com.nashtech.rookies.java05.AssetManagement.Model.DTO;

public class CategoryDTO {
	private String prefix;
	private String name;

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public CategoryDTO() {
		super();
	}

	public CategoryDTO(String prefix, String name) {
		super();
		this.prefix = prefix;
		this.name = name;
	}

}