package com.nashtech.rookies.java05.AssetManagement.services;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.EmployeeDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;

import java.util.List;
import java.util.Optional;

public interface EmployeeService {
	Employee changePassword(String userId, String employeePassword, String oldPassword, String newPassword);

	Optional<Employee> getEmployee(String userId);

	List<Employee> retrievesEmployees(String location);

	List<Employee> retrievesEmployeesByType(String type, String location);

	public Employee createEmployee(EmployeeDTO emp);

	public void updateEmployee(Employee emp);

	public void generateCode(Employee emp);

	public void generateUsername(Employee emp);

	public void generatePassword(Employee emp);

	List<Employee> searchEmployee(String searchText, String location);
	
	public EmployeeDTO convertToDto(Employee em);

	Optional<Employee> getEmployeeByUsername(String username);

	boolean disableUser(String userId);
}
