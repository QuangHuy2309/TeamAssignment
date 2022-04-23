package com.nashtech.rookies.java05.AssetManagement.Model.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;

public class EmployeeDTO {
	private String id;
	
	private String username;
	
    @NotBlank(message = "Username is not null")
    @Size(max = 50)
    private String firstname;

    @Size(max = 50)
    private String lastname;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dob;

    private boolean gender;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date joineddate;

    @Size(max = 10)
    private String type;

    private String location;
    
    public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public boolean isGender() {
        return gender;
    }

    public void setGender(boolean gender) {
        this.gender = gender;
    }

    public Date getJoineddate() {
        return joineddate;
    }

    public void setJoineddate(Date joineddate) {
        this.joineddate = joineddate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
