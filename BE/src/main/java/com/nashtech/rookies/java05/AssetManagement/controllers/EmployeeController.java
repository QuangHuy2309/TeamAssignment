package com.nashtech.rookies.java05.AssetManagement.controllers;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.EmployeeDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import com.nashtech.rookies.java05.AssetManagement.exceptions.InvalidDataException;
import com.nashtech.rookies.java05.AssetManagement.exceptions.MethodFailedException;
import com.nashtech.rookies.java05.AssetManagement.exceptions.ObjectNotFoundException;
import com.nashtech.rookies.java05.AssetManagement.payload.ChangePasswordRequest;
import com.nashtech.rookies.java05.AssetManagement.payload.MessageResponse;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtAuthTokenFilter;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtUtils;
import com.nashtech.rookies.java05.AssetManagement.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class EmployeeController {
	@Autowired
	private EmployeeService employeeService;
	
	@Autowired
	private JwtUtils jwtUtils;

	@PutMapping("/employees/updatePassword/{userId}")
	public ResponseEntity<?> updatePassword(@PathVariable String userId,
			@RequestBody ChangePasswordRequest changePasswordRequest) {
		if (changePasswordRequest.getNewPassword() == null || changePasswordRequest.getNewPassword().length() == 0)
			throw new InvalidDataException("Error: New password is null.");

		if (changePasswordRequest.getNewPassword().length() < 8) {
			throw new InvalidDataException("Error: Password length is less than 8.");
		}

		try {
			Employee employee = employeeService.getEmployee(userId).get();

			Employee updatedUser = employeeService.changePassword(userId, employee.getPassword(),
					changePasswordRequest.getOldPassword(), changePasswordRequest.getNewPassword());

			if (updatedUser == null)
				return ResponseEntity.badRequest().body(new MessageResponse("Error: Change password failed."));
			return ResponseEntity.ok().body(new MessageResponse("Update password successfully."));
		} catch (NoSuchElementException ex) {
			throw new ObjectNotFoundException("Error: Employee not found with ID: " + userId);
		}

	}

	@GetMapping("/employees/{id}")
	public EmployeeDTO getDetailEmployee(@PathVariable(name = "id") String id) {
		try {
			return employeeService.convertToDto(employeeService.getEmployee(id).get());
		} catch (NoSuchElementException ex) {
			throw new ObjectNotFoundException("Error: Not found employee with ID: " + id);
		}
	}

	@GetMapping("/employees")
	public List<EmployeeDTO> getAllEmployee(@RequestParam(name = "type", required = false) String type,
			HttpServletRequest request) {
		String jwt = JwtAuthTokenFilter.parseJwt(request);
		String username = jwtUtils.getUserNameFromJwtToken(jwt);
		String location = "";
		try {
		 location = employeeService.getEmployeeByUsername(username).get().getLocation();
		} catch(NoSuchElementException ex) {
			throw new ObjectNotFoundException("Error: Not found employee with username: " + username);
		}
		List<Employee> employeeList;
		if (type == null) // Find All
		{
			employeeList = employeeService.retrievesEmployees(location);
		}
		else {
			employeeList = employeeService.retrievesEmployeesByType(type, location);
		}
		return employeeList.stream().map(employeeService::convertToDto)
				.collect(Collectors.toList());
	}

	@PostMapping("/employees")
	public EmployeeDTO createEmployee(@RequestBody EmployeeDTO emp) {
		if (emp.getFirstname() == null || emp.getLastname() == null || emp.getDob() == null
				|| emp.getJoineddate() == null || emp.getType() == null || emp.getLocation() == null) {
			throw new InvalidDataException("Error: Some fields are missing");
		}
		emp.setFirstname(emp.getFirstname().trim());
		emp.setLastname(emp.getLastname().trim());
		emp.setType(emp.getType().trim());
		emp.setLocation(emp.getLocation().trim());
		if (emp.getFirstname() == "" || emp.getLastname() == "" || emp.getDob() == null || emp.getJoineddate() == null
				|| emp.getType() == "" || emp.getLocation() == "") {
			throw new InvalidDataException("Error: Field is empty");
		}
		if (emp.getDob().after(emp.getJoineddate())) {
			throw new InvalidDataException("Error: Joined Date is not correct");
		}
		DateFormat formatter1 = new SimpleDateFormat("yyyyMMdd");
		int d1 = Integer.parseInt(formatter1.format(emp.getDob()));
		int d2 = Integer.parseInt(formatter1.format(new Date()));
		int age = (d2 - d1) / 10000;
		if (age < 18) {
			throw new InvalidDataException("Error: This user is not enough 18 years old");
		}
		Employee employee = employeeService.createEmployee(emp);
		if (employee == null) {
			throw new MethodFailedException("Create User Failed");
		}
		return employeeService.convertToDto(employee);
	}

	@PutMapping("/employees/{employeeId}")
	public EmployeeDTO editEmployee(@PathVariable(name = "employeeId") String employeeId,
			@RequestBody EmployeeDTO emp) {
		try {
			if (emp.getDob() == null || emp.getJoineddate() == null || emp.getType() == null) {
				throw new InvalidDataException("Error: Some fields are missing");
			}
			Employee empl = employeeService.getEmployee(employeeId).get();
			emp.setType(emp.getType().trim());
			if (String.valueOf(emp.getDob()) == "" || String.valueOf(emp.getJoineddate()) == ""
					|| emp.getType() == "") {
				throw new InvalidDataException("Error: Field is empty");
			}
			if (emp.getDob().after(emp.getJoineddate())) {
				throw new InvalidDataException("Error: Joined Date is not correct");
			}
			DateFormat formatter1 = new SimpleDateFormat("yyyyMMdd");
			int d1 = Integer.parseInt(formatter1.format(emp.getDob()));
			int d2 = Integer.parseInt(formatter1.format(new Date()));
			int age = (d2 - d1) / 10000;
			if (age < 18) {
				throw new InvalidDataException("Error: This user is not enough 18 years old");
			}
			empl.setDob(emp.getDob());
			empl.setGender(emp.isGender());
			empl.setJoineddate(emp.getJoineddate());
			empl.setType(emp.getType());
			employeeService.updateEmployee(empl);
			return employeeService.convertToDto(empl);
		} catch (NoSuchElementException e) {
			throw new ObjectNotFoundException("Error: Not found employee with ID: " + employeeId);
		}
	}

	@GetMapping("/employees/search")
	public List<EmployeeDTO> searchEmployee(@RequestParam(name = "criteria") String search,
			@RequestParam(name = "location") String location) {
		return employeeService.searchEmployee(search, location).stream().map(employeeService::convertToDto)
				.collect(Collectors.toList());
	}

	@PutMapping("/employees/disable/{userId}")
	public ResponseEntity<?> disableUser(@PathVariable String userId){
		try{
			return employeeService.disableUser(userId)
					? new ResponseEntity<>("Disable successfully", HttpStatus.OK)
					: new ResponseEntity<>("Disable failed", HttpStatus.NOT_FOUND);
		}
		catch (NoSuchElementException ex){
			throw new ObjectNotFoundException("Error: not found employee with ID: " + userId);
		}

	}



}
