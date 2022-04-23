package com.nashtech.rookies.java05.AssetManagement.Model.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class RequestForReturningDTO {
    private Long id;
    private String asset_code;
    private String asset_name;
    private String requestBy_id;
    private String requestBy_name;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date assigned_date;
    private String acceptedBy_id;
    private String acceptedBy_name;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date returned_date;
    private int state;
    private Long assignmentId;

    public RequestForReturningDTO(Long id, String asset_code, String asset_name, String requestBy_id,
			String requestBy_name, Date assigned_date, String acceptedBy_id, String acceptedBy_name, Date returned_date,
			int state, Long assignmentId) {
		super();
		this.id = id;
		this.asset_code = asset_code;
		this.asset_name = asset_name;
		this.requestBy_id = requestBy_id;
		this.requestBy_name = requestBy_name;
		this.assigned_date = assigned_date;
		this.acceptedBy_id = acceptedBy_id;
		this.acceptedBy_name = acceptedBy_name;
		this.returned_date = returned_date;
		this.state = state;
		this.assignmentId = assignmentId;
	}

	public RequestForReturningDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAsset_code() {
        return asset_code;
    }

    public void setAsset_code(String asset_code) {
        this.asset_code = asset_code;
    }

    public String getAsset_name() {
        return asset_name;
    }

    public void setAsset_name(String asset_name) {
        this.asset_name = asset_name;
    }

    public String getRequestBy_id() {
        return requestBy_id;
    }

    public void setRequestBy_id(String requestBy_id) {
        this.requestBy_id = requestBy_id;
    }

    public String getRequestBy_name() {
        return requestBy_name;
    }

    public void setRequestBy_name(String requestBy_name) {
        this.requestBy_name = requestBy_name;
    }

    public Date getAssigned_date() {
        return assigned_date;
    }

    public void setAssigned_date(Date assigned_date) {
        this.assigned_date = assigned_date;
    }

    public String getAcceptedBy_id() {
        return acceptedBy_id;
    }

    public void setAcceptedBy_id(String acceptedBy_id) {
        this.acceptedBy_id = acceptedBy_id;
    }

    public String getAcceptedBy_name() {
        return acceptedBy_name;
    }

    public void setAcceptedBy_name(String acceptedBy_name) {
        this.acceptedBy_name = acceptedBy_name;
    }

    public Date getReturned_date() {
        return returned_date;
    }

    public void setReturned_date(Date returned_date) {
        this.returned_date = returned_date;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

	public Long getAssignmentId() {
		return assignmentId;
	}

	public void setAssignmentId(Long assignmentId) {
		this.assignmentId = assignmentId;
	}
    
    
}
