package com.nashtech.rookies.java05.AssetManagement.services.impl;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.EmployeeDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Assignment;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import com.nashtech.rookies.java05.AssetManagement.Repository.AssignmentRepository;
import com.nashtech.rookies.java05.AssetManagement.Repository.EmployeeRepository;
import com.nashtech.rookies.java05.AssetManagement.Repository.RequestForReturningRepository;
import com.nashtech.rookies.java05.AssetManagement.exceptions.InvalidDataException;
import com.nashtech.rookies.java05.AssetManagement.exceptions.ObjectNotFoundException;
import com.nashtech.rookies.java05.AssetManagement.services.AssignmentService;
import com.nashtech.rookies.java05.AssetManagement.services.EmployeeService;

import com.nashtech.rookies.java05.AssetManagement.utils.ASSIGNMENT_STATUS;
import com.nashtech.rookies.java05.AssetManagement.utils.USER_STATUS;
import org.hibernate.boot.model.source.spi.Sortable;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private RequestForReturningRepository requestForReturningRepository;

    final private PasswordEncoder encoder;

    @Autowired
    private ModelMapper modelMapper;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, PasswordEncoder encoder) {
        this.employeeRepository = employeeRepository;
        this.encoder = encoder;
    }

    @Override
    public Employee changePassword(String userId, String employeePassword, String oldPassword, String newPassword) {

        Employee employee = employeeRepository.findById(userId).get();

        if (oldPassword == null || oldPassword.length() == 0) {
            if (employee.getStatus() != 1)
                throw new InvalidDataException("Error: Old password is null.");
        }

        String newPasswordEncoded = encoder.encode(newPassword);
        if (employee.getStatus() != 1) {
            boolean isMatched = encoder.matches(oldPassword, employeePassword);
            if (!isMatched) {
                throw new InvalidDataException("Error: Old password is not correct.");
            }
        }
        else {
            employee.setStatus(2);
        }
        employee.setPassword(newPasswordEncoded);
        return employeeRepository.save(employee);

    }

    @Override
    public Optional<Employee> getEmployee(String userId) {
        return employeeRepository.findById(userId);
    }

    
    @Override
    public List<Employee> retrievesEmployees(String location) {
    	Sort sortable = Sort.by("id").ascending();
        return employeeRepository.findByStatusNotAndLocation(USER_STATUS.INACTIVE, location ,sortable);
    }
    
    @Override
    public List<Employee> retrievesEmployeesByType(String type, String location) {
    	Sort sortable = Sort.by("id").ascending();
        return employeeRepository.findByTypeIgnoreCaseAndStatusNotAndLocation(type,USER_STATUS.INACTIVE, location,sortable);
    }

    @Override
    public Employee createEmployee(EmployeeDTO emp) {
        Employee e = modelMapper.map(emp, Employee.class);
        e.setStatus(USER_STATUS.ACTIVE);
        generateCode(e);
        generateUsername(e);
        generatePassword(e);
        return employeeRepository.save(e);
    }

    @Override
    public void updateEmployee(Employee emp) {
        employeeRepository.save(emp);
    }

    public void generateCode(Employee emp)
    {
        String prefix = "SD";
        Long max = employeeRepository.count();
        emp.setId(prefix + (String.format("%04d", max + 1)));
    }

    public void generateUsername(Employee emp)
    {
        String username = emp.getFirstname().trim().toLowerCase();
        String[] name = username.split(" ");
        username = name[name.length-1].trim();
        String lastname = emp.getLastname().trim().toLowerCase();
        username = username + lastname.charAt(0);
        for (int i = 1; i < lastname.length(); i++)
        {
            char c = lastname.charAt(i);
            if (c == ' ' && lastname.charAt(i+1) != ' ')
            {
                username = username + lastname.charAt(i+1);
            }
        }
        int max = employeeRepository.countAllByUsernameContains(username);
        if (max == 0)
        {
            emp.setUsername(username);
        }
        else
        {
            username = username + max;
            emp.setUsername(username);
        }
    }

    public void generatePassword(Employee emp)
    {
        SimpleDateFormat formatter = new SimpleDateFormat("ddMMyyyy");
        String d = formatter.format(emp.getDob());
        String password = emp.getUsername() + "@" + d;
        emp.setPassword(encoder.encode(password));
    }

    @Override
    public List<Employee> searchEmployee(String searchText, String location) {
        Sort sortable = Sort.by("id").ascending();
        if (searchText == null || searchText.trim().length() == 0)
            return employeeRepository.findByStatusNotAndLocation(USER_STATUS.INACTIVE, location ,sortable);
        return employeeRepository.searchEmployee(searchText.toUpperCase(), location);
    }

    public EmployeeDTO convertToDto(Employee em) {
    	return modelMapper.map(em, EmployeeDTO.class);
    }

    @Override
    public Optional<Employee> getEmployeeByUsername(String username) {
        return employeeRepository.findByUsernameAndStatusNot(username, 0);
    }

    @Override
    public boolean disableUser(String userId) throws NoSuchElementException{
        Employee employee = getEmployee(userId).get();
        //check if employee still have valid assignment
        boolean validAssignment = isValidAssignment(userId);
        if (!validAssignment){
            if (employee.getStatus() != USER_STATUS.INACTIVE){
                employee.setStatus(USER_STATUS.INACTIVE);
                employeeRepository.save(employee);
                return true;
            }
        }
        return false;
    }

    private boolean isValidAssignment(String userId) throws NoSuchElementException{
        Employee assignedBy = getEmployee(userId).get();
        Employee assignedTo = getEmployee(userId).get();
        boolean empResult = assignmentRepository.existsByAssignedbyEmployeeOrAssignedtoEmployee(assignedBy, assignedTo);
        boolean statusResult = assignmentRepository.existsByStatusNot(ASSIGNMENT_STATUS.COMPLETE);
        if (empResult && statusResult){
            return true;
        }
        return false;
    }

}
