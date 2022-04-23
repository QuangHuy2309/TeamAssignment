package com.nashtech.rookies.java05.AssetManagement.Model.Entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "asset", schema = "public")
public class Asset {
	@Id
	@Column(name = "id")
	private String id;

	@Column(name = "name")
	private String name;

	@JsonFormat(pattern = "yyyy-MM-dd")
	@Column(name = "installed_date", columnDefinition = "DATE")
	private Date installedDate;

	@Column(name = "state")
	private int state;

	@Column(name = "location")
	private String location;

	@Column(name = "specification", columnDefinition = "TEXT")
	private String specification;

	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;
	
	@OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Assignment> assignments = new ArrayList<Assignment>();

	public Asset(String id, String name, Date installedDate, int state, String location, String specification,
			Category category, List<Assignment> assignments) {
		super();
		this.id = id;
		this.name = name;
		this.installedDate = installedDate;
		this.state = state;
		this.location = location;
		this.specification = specification;
		this.category = category;
		this.assignments = assignments;
	}

	public Asset() {
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

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public List<Assignment> getAssignments() {
		return assignments;
	}

	public void setAssignments(List<Assignment> assignments) {
		this.assignments = assignments;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, name, installedDate, state, location, specification, category, assignments);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Asset other = (Asset) obj;
		return Objects.equals(id, other.id) && Objects.equals(name, other.name) 
				&& Objects.equals(installedDate, other.installedDate) && Objects.equals(state, other.state) 
				&& Objects.equals(location, other.location) && Objects.equals(specification, other.specification) 
				&& Objects.equals(category, other.category) && Objects.equals(assignments, other.assignments);
	}
}

