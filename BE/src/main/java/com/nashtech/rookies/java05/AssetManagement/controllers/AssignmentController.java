package com.nashtech.rookies.java05.AssetManagement.controllers;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Asset;
import com.nashtech.rookies.java05.AssetManagement.utils.ASSIGNMENT_STATUS;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.AssignmentDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Assignment;
// import com.nashtech.rookies.java05.AssetManagement.services.AssetService;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import com.nashtech.rookies.java05.AssetManagement.exceptions.InvalidDataException;
import com.nashtech.rookies.java05.AssetManagement.exceptions.ObjectNotFoundException;
import com.nashtech.rookies.java05.AssetManagement.payload.MessageResponse;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtAuthTokenFilter;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtUtils;
import com.nashtech.rookies.java05.AssetManagement.services.AssetService;
import com.nashtech.rookies.java05.AssetManagement.services.AssignmentService;
import com.nashtech.rookies.java05.AssetManagement.services.EmployeeService;
import com.nashtech.rookies.java05.AssetManagement.utils.ASSET_STATUS;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class AssignmentController {
    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private AssetService assetService;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/assignments")
    public ResponseEntity<?> getAllAssignments(@RequestParam(name = "state", required = false) List<Integer> state,
                                               @RequestParam(name = "date", required = false)
                                               @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        List<Assignment> result;
        if (date != null) {
            result = assignmentService.getAllAssignmentsbyDate(date);
        } else {
            result = assignmentService.getAllAssignments();
        }
        if (state != null && !state.isEmpty()) {
            List<Assignment> resultHolder = new ArrayList<Assignment>();
            for (int s : state) {
                resultHolder.addAll(result.stream().filter(a -> a.getStatus() == s).collect(Collectors.toList()));
            }
            result.clear();
            result.addAll(resultHolder);
        }
        List<AssignmentDTO> assignmentDTOs = result.stream().map(assignmentService::convertToDTO).collect(Collectors.toList());
        return new ResponseEntity<List<AssignmentDTO>>(assignmentDTOs, HttpStatus.OK);

    }

    @GetMapping("/assignments/details/{assignmentId}")
    public ResponseEntity<?> viewAssignmentDetails(@PathVariable Long assignmentId) {
        Optional<Assignment> opt = assignmentService.findAssignmentById(assignmentId);
        try {

            return new ResponseEntity<>(assignmentService.convertToDTO(opt.get()), HttpStatus.OK);

        } catch (NoSuchElementException ex) {
            throw new ObjectNotFoundException("Error: No found assignment with ID: " + assignmentId);
        }

    }

    @PutMapping("/assignments/{assignmentId}")
    public ResponseEntity<?> updateAssignment(@PathVariable Long assignmentId, @RequestBody AssignmentDTO dto) {
        //validate DTO
        try {
            Employee assignedTo = employeeService.getEmployee(dto.getAssignedtoEmployee()).get();
        } catch (NoSuchElementException ex) {
            throw new ObjectNotFoundException("Error: Assignment not found with assigned to employee Id: " + dto.getAssignedtoEmployee());
        }
        try {
            Employee assignedBy = employeeService.getEmployee(dto.getAssignedbyEmployee()).get();
        } catch (NoSuchElementException ex) {
            throw new ObjectNotFoundException("Error: Assignment not found with assigned by employee Id: " + dto.getAssignedbyEmployee());
        }
        if (assignmentId != dto.getId()) {
            throw new InvalidDataException("Error: assignment Id must match with path value");
        }

        if (dto.getStatus() != ASSIGNMENT_STATUS.WAITING) {
            throw new InvalidDataException("Error: Only edit assignment with Waiting for acceptance status");
        }
        Asset asset = assetService.findAssetById(dto.getAssetId());
        if (asset == null) {
            throw new ObjectNotFoundException("Error: No assignment found with asset id: " + dto.getAssetId());
        }

        Assignment assignment = assignmentService.updateAssignment(assignmentId, dto);
        if (assignment != null) {
            return new ResponseEntity<>(assignmentService.convertToDTO(assignment), HttpStatus.OK);
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Action: Update assignment failed."));

    }

    @PutMapping("/assignments/status/{assignmentId}")
    public ResponseEntity<?> updateAssignmentStatus(@PathVariable Long assignmentId, @RequestParam int status) {
        Optional<Assignment> assignment = assignmentService.findAssignmentById(assignmentId);
        if (assignment.isEmpty()) {
            throw new ObjectNotFoundException("Error: Assignment " + assignmentId + " not found.");
        }

        if (assignment.get().getStatus() != ASSIGNMENT_STATUS.WAITING) {
            return ResponseEntity.badRequest().body(new MessageResponse(
                    "Error: Cannot change assignment with status different than waiting."));
        }
        Assignment assignmentUpdated = assignmentService.updateAssignmentStatus(assignmentId, status);
        if (assignmentUpdated != null) {
            return new ResponseEntity<>(assignmentService.convertToDTO(assignmentUpdated), HttpStatus.OK);
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Action: Update assignment status failed."));

    }

    @PostMapping("/assignments")
    public ResponseEntity<?> createAssignment(HttpServletRequest request, @RequestBody AssignmentDTO assignmentDTO) {
        if (assignmentDTO.getAssetId() == null || assignmentDTO.getAssignedtoEmployee() == null)
            throw new InvalidDataException("Error: Missing some required fields");

        if (assetService.findAssetById(assignmentDTO.getAssetId()) == null)
            throw new ObjectNotFoundException("Error: Asset not found.");

        if (assetService.findAssetById(assignmentDTO.getAssetId()).getState() == ASSET_STATUS.ASSIGNED)
            throw new InvalidDataException("Error: Asset was assigned.");

        // get location of admin (assign employee)
        String jwt = JwtAuthTokenFilter.parseJwt(request);
        String username = jwtUtils.getUserNameFromJwtToken(jwt);

        String location = "";
        try {
            location = employeeService.getEmployeeByUsername(username).get().getLocation();
        } catch (NoSuchElementException ex) {
            throw new ObjectNotFoundException("Error: No found employee with username: " + username);
        }

        Optional<Employee> assignByEmployeeOpt = employeeService.getEmployeeByUsername(username);
        if (!assignByEmployeeOpt.isPresent())
            throw new ObjectNotFoundException("Error: Assign employee not found.");

        if (!assetService.findAssetById(assignmentDTO.getAssetId()).getLocation().equals(location))
            throw new InvalidDataException("Error: Location of asset is not same as admin");

        // get location of employee to be assigned (assignToEmployee)
        Optional<Employee> assignToEmployeeOpt = employeeService.getEmployee(assignmentDTO.getAssignedtoEmployee());
        try {
            Employee assignToEmployee = assignToEmployeeOpt.get();
            if (!assignToEmployee.getLocation().equals(location))
                throw new InvalidDataException(
                        "Error: Location of employee to be assigned is not same as current admin.");

            Employee assignByEmployee = assignByEmployeeOpt.get();
            assignmentDTO.setAssignedbyEmployee(assignByEmployee.getId());
        } catch (NoSuchElementException ex) {
            throw new ObjectNotFoundException("Error: Employee not found.");
        }

        Assignment createdAssignment = assignmentService
                .createAssignment(assignmentService.convertToEntity(assignmentDTO));
        if (createdAssignment == null)
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Create Assignment failed."));
        return new ResponseEntity<>(assignmentService.convertToDTO(createdAssignment), HttpStatus.OK);
    }

    @GetMapping("/assignments/assignedTo/{empId}")
    public ResponseEntity<?> getAssignmentsOfAssignedTo(@PathVariable String empId) {
        try {
            Employee employee = employeeService.getEmployee(empId).get();
            List<Assignment> result = assignmentService.getAssignmentByAssignedToEmployee(employee);
            List<AssignmentDTO> returnList = result.stream().map(assignmentService::convertToDTO).collect(Collectors.toList());
            return new ResponseEntity<>(returnList, HttpStatus.OK);
        } catch (NoSuchElementException ex) {
            throw new ObjectNotFoundException("Error: No such employee with id: " + empId);
        }
    }

    @GetMapping("/assignments/search")
    public List<AssignmentDTO> searchAssignment(@RequestParam(name = "criteria") String search) {
        return assignmentService.searchAssignments(search).stream().map(assignmentService::convertToDTO).collect(Collectors.toList());
    }

    @DeleteMapping("/assignments/{assignmentId}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long assignmentId) {
        boolean deleteResult = false;
        try {
            Assignment assignment = assignmentService.findAssignmentById(assignmentId).get();
            if (assignment.getStatus() == ASSIGNMENT_STATUS.ACCEPTED){
                return ResponseEntity.badRequest().body(new MessageResponse(
                        "Error: Cannot delete assignment with status accepted."));
            }
            if (assignment.getStatus() == ASSIGNMENT_STATUS.COMPLETE){
                return ResponseEntity.badRequest().body(new MessageResponse(
                        "Error: Cannot delete assignment with status completed."));
            }
            if (assignment.getStatus() == ASSIGNMENT_STATUS.WAITING || assignment.getStatus() == ASSIGNMENT_STATUS.REJECTED) {
                deleteResult = assignmentService.deleteAssignment(assignment.getId());
            }
            return (deleteResult) ? new ResponseEntity<Void>(HttpStatus.OK) : ResponseEntity.badRequest().body(new MessageResponse("Error: Delete assignment failed"));
        } catch (NoSuchElementException ex) {
            throw new ObjectNotFoundException("Error: Not found assignment with ID: " + assignmentId);
        }

    }
}