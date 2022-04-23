package com.nashtech.rookies.java05.AssetManagement.Model.Entity;

import java.util.Date;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "employee", schema = "public")
public class Employee {
	@Id
	@Column(name = "id")
	@NotBlank(message = "ID is not null")
	private String id;

	@Column(name = "username")
	@NotBlank(message = "Username is not null")
	@Size(min = 3, max = 50)
	private String username;

	@Column(name = "password", columnDefinition = "TEXT")
	@Size(min = 6)
	private String password;

	@Column(name = "firstname")
	@Size(min = 1, max = 15)
	private String firstname;

	@Column(name = "lastname")
	@Size(min = 1, max = 50)
	private String lastname;

	@JsonFormat(pattern = "yyyy-MM-dd")
	@Column(name = "dob", columnDefinition = "DATE")
	private Date dob;

	@Column(name = "gender")
	private boolean gender;

	@JsonFormat(pattern = "yyyy-MM-dd")
	@Column(name = "joineddate", columnDefinition = "DATE")
	private Date joineddate;

	@Column(name = "type")
	@Size(min = 1, max = 10)
	private String type;

	@Column(name = "status")
	private int status;

	@Column(name = "location", columnDefinition = "TEXT")
	private String location;

	public Employee() {
	}

	public Employee(@NotBlank(message = "ID is not null") String id,
			@NotBlank(message = "Username is not null") @Size(min = 3, max = 50) String username,
			@Size(min = 6) String password, @Size(min = 1, max = 15) String firstname,
			@Size(min = 1, max = 50) String lastname, Date dob, boolean gender, Date joineddate,
			@Size(min = 1, max = 10) String type, int status, String location) {
		super();
		this.id = id;
		this.username = username;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		this.dob = dob;
		this.gender = gender;
		this.joineddate = joineddate;
		this.type = type;
		this.status = status;
		this.location = location;
	}

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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	@Override
	public int hashCode() {
		return Objects.hash(dob, firstname, gender, id, joineddate, lastname, password, type, status, username);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Employee other = (Employee) obj;
		return Objects.equals(dob, other.dob) && Objects.equals(firstname, other.firstname) && gender == other.gender
				&& Objects.equals(id, other.id) && Objects.equals(joineddate, other.joineddate)
				&& Objects.equals(lastname, other.lastname) && Objects.equals(password, other.password)
				&& status == other.status && Objects.equals(username, other.username);
	}

}
