package com.nashtech.rookies.java05.AssetManagement.Model.Entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "category", schema = "public")
public class Category {
	@Id
	@Column(name = "prefix")
	@NotBlank(message = "Prefix is not null")
	private String prefix;

	@Column(name = "name")
	@NotBlank(message = "Category name is not null")
	private String name;
	
	@OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Asset> assets = new ArrayList<Asset>();

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

	public List<Asset> getAssets() {
		return assets;
	}

	public void setAssets(List<Asset> assets) {
		this.assets = assets;
	}

	public Category(@NotBlank(message = "Prefix is not null") String prefix,
			@NotBlank(message = "Category name is not null") String name, List<Asset> assets) {
		super();
		this.prefix = prefix;
		this.name = name;
		this.assets = assets;
	}

	public Category() {
	}

	@Override
	public int hashCode() {
		return Objects.hash(prefix, name);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Category other = (Category) obj;
		return Objects.equals(prefix, other.prefix) && Objects.equals(name, other.name);
	}

}

