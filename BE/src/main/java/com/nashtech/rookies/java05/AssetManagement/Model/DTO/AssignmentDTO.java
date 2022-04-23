package com.nashtech.rookies.java05.AssetManagement.Model.DTO;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class AssignmentDTO {
    private Long id;
    private String assetId;
    private String assetName;
    private String assignedtoEmployee;
    private String assignedbyEmployee;
    private String assignedToUsername;
    private String assignedByUsername;
    private String categoryName;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date createddate;
    private String specification;
    private String note;
    private int status;
    private boolean createRequest;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public String getAssignedtoEmployee() {
        return assignedtoEmployee;
    }

    public void setAssignedtoEmployee(String assignedtoEmployee) {
        this.assignedtoEmployee = assignedtoEmployee;
    }

    public String getAssignedbyEmployee() {
        return assignedbyEmployee;
    }

    public void setAssignedbyEmployee(String assignedbyEmployee) {
        this.assignedbyEmployee = assignedbyEmployee;
    }

    public String getAssignedToUsername() {
        return assignedToUsername;
    }

    public void setAssignedToUsername(String assignedToUsername) {
        this.assignedToUsername = assignedToUsername;
    }

    public String getAssignedByUsername() {
        return assignedByUsername;
    }

    public void setAssignedByUsername(String assignedByUsername) {
        this.assignedByUsername = assignedByUsername;
    }

    public Date getCreateddate() {
        return createddate;
    }

    public void setCreateddate(Date createddate) {
        this.createddate = createddate;
    }

    public String getSpecification() {
        return specification;
    }

    public void setSpecification(String specification) {
        this.specification = specification;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

	public boolean isCreateRequest() {
		return createRequest;
	}

	public void setCreateRequest(boolean createRequest) {
		this.createRequest = createRequest;
	}
    
    
}
