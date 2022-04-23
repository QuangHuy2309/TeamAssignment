package com.nashtech.rookies.java05.AssetManagement.services.impl;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.AssignmentDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Asset;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Assignment;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import com.nashtech.rookies.java05.AssetManagement.Repository.AssetRepository;
import com.nashtech.rookies.java05.AssetManagement.Repository.AssignmentRepository;
import com.nashtech.rookies.java05.AssetManagement.Repository.EmployeeRepository;
import com.nashtech.rookies.java05.AssetManagement.exceptions.InvalidDataException;
import com.nashtech.rookies.java05.AssetManagement.exceptions.ObjectNotFoundException;
import com.nashtech.rookies.java05.AssetManagement.services.AssetService;
import com.nashtech.rookies.java05.AssetManagement.services.AssignmentService;
import com.nashtech.rookies.java05.AssetManagement.services.RequestForReturningService;
import com.nashtech.rookies.java05.AssetManagement.utils.ASSET_STATUS;
import com.nashtech.rookies.java05.AssetManagement.utils.ASSIGNMENT_STATUS;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class AssignmentServiceImpl implements AssignmentService {
	@Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AssetService assetService;
    
    @Autowired
    private RequestForReturningService requestService;

    @Autowired
    private ModelMapper mapper;

    @Override
    public List<Assignment> getAllAssignments() {
        Sort sortable = Sort.by("id").ascending();
        return assignmentRepository.findByStatusNot(ASSIGNMENT_STATUS.COMPLETE, sortable);
    }

    @Override
    public Optional<Assignment> findAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }

    @Override
    public List<Assignment> getAllAssignmentsbyDate(Date date) {
        Sort sortable = Sort.by("id").ascending();
        return assignmentRepository.findByCreateddate(date, sortable);
    }

    @Override
    public Assignment updateAssignment(Long id, AssignmentDTO dto) {
        Assignment assignmentNeedToUpdate = assignmentRepository.getById(id);
        assignmentNeedToUpdate.setAsset(assetRepository.getById(dto.getAssetId()));
        assignmentNeedToUpdate.setAssignedtoEmployee(employeeRepository.getById(dto.getAssignedtoEmployee()));
        assignmentNeedToUpdate.setAssignedbyEmployee(employeeRepository.getById(dto.getAssignedbyEmployee()));
        assignmentNeedToUpdate.setCreateddate(dto.getCreateddate());
        assignmentNeedToUpdate.setNote(dto.getNote());
        assignmentNeedToUpdate.setStatus(dto.getStatus());
        return assignmentRepository.save(assignmentNeedToUpdate);
    }

    @Override
    public Assignment updateAssignmentStatus(Long id, int status) {
        Assignment assignmentNeedToUpdate = assignmentRepository.getById(id);
        assignmentNeedToUpdate.setStatus(status);
        if (status == ASSIGNMENT_STATUS.REJECTED ){
            assetService.updateAssetState(assignmentNeedToUpdate.getAsset().getId(), ASSET_STATUS.AVAILABLE);
        }
        return assignmentRepository.save(assignmentNeedToUpdate);
    }


    @Override
    public Assignment createAssignment(Assignment assignment) {
        if (assignment.getCreateddate() == null) {
            Date currentDate = new Date();
            assignment.setCreateddate(currentDate);
        }
        assignment.setStatus(2);

        //change state of asset to "Assigned"
        Optional<Asset> asset = assetRepository.findById(assignment.getAsset().getId());
        asset.get().setState(3);
        assetRepository.save(asset.get());

        return assignmentRepository.save(assignment);
    }

    @Override
    public List<Assignment> getAssignmentByAssignedToEmployee(Employee employee) {
        return assignmentRepository.findAssignmentsByAssignedtoEmployeeAndCreateddateLessThanEqual(employee, new Date());
    }

    public boolean deleteAssignment(Long assignmentId) {
        return assignmentRepository.findById(assignmentId).map(assignment -> {
            if (assignment.getStatus() == ASSIGNMENT_STATUS.WAITING){
                assetService.updateAssetState(assignment.getAsset().getId(), ASSET_STATUS.AVAILABLE);
            }
            assignmentRepository.delete(assignment);
            return true;
        }).orElse(false);
    }

    @Override
    public AssignmentDTO convertToDTO(Assignment assignment) {
        AssignmentDTO assignmentDTO = mapper.map(assignment, AssignmentDTO.class);
        assignmentDTO.setAssetId(assignment.getAsset().getId());
        assignmentDTO.setAssetName(assignment.getAsset().getName());
        assignmentDTO.setAssignedtoEmployee(assignment.getAssignedtoEmployee().getId());
        assignmentDTO.setAssignedbyEmployee(assignment.getAssignedbyEmployee().getId());
        assignmentDTO.setAssignedToUsername(assignment.getAssignedtoEmployee().getUsername());
        assignmentDTO.setAssignedByUsername(assignment.getAssignedbyEmployee().getUsername());
        assignmentDTO.setSpecification(assignment.getAsset().getSpecification());
        assignmentDTO.setCategoryName(assignment.getAsset().getCategory().getName());
        boolean createdRequest = requestService.existByAssignment(assignment);
        assignmentDTO.setCreateRequest(createdRequest);
        return assignmentDTO;
    }

    @Override
    public Assignment convertToEntity(AssignmentDTO assignmentDTO) {
        Assignment assignment = mapper.map(assignmentDTO, Assignment.class);
        Asset asset = assetRepository.findById(assignmentDTO.getAssetId()).orElse(null);
        if (asset == null)
            return null;
        Employee assignToEmployee = employeeRepository.findById(assignmentDTO.getAssignedtoEmployee()).orElse(null);
        if (assignToEmployee == null)
            return null;
        Employee assignByEmployee = employeeRepository.findById(assignmentDTO.getAssignedbyEmployee()).orElse(null);
        if (assignByEmployee == null)
            return null;
        assignment.setAsset(asset);
        assignment.setAssignedtoEmployee(assignToEmployee);
        assignment.setAssignedbyEmployee(assignByEmployee);
        return assignment;
    }

    //New asset that admin update must be existed in DB
    private boolean isAssetExisted(Asset asset) {
        return assetRepository.existsById(asset.getId());
    }

    //New employee that admin update assigned by or assigned to must be existed in DB
    private boolean isEmpExisted(Employee employee) {
        return employeeRepository.existsById(employee.getId());
    }

    @Override
    public boolean existsAssignmentByAsset(Asset asset) {
        return assignmentRepository.existsAssignmentByAsset(asset);
    }

    @Override
    public List<Assignment> searchAssignments(String searchText) {
        Sort sortable = Sort.by("id").ascending();
        if (searchText == null || searchText.trim().length() == 0)
            return assignmentRepository.findAll(sortable);
        return assignmentRepository.searchAssignment(searchText.toUpperCase());
    }

	@Override
	public boolean existsByAssetAndStatusNot(Asset asset, int status) {
		return assignmentRepository.existsAssignmentByAssetAndStatusNot(asset, status);
	}


}