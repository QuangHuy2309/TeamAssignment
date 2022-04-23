package com.nashtech.rookies.java05.AssetManagement.services.impl;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.AssetDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.DTO.AssignmentDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.DTO.RequestForReturningDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Asset;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Assignment;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.RequestForReturning;
import com.nashtech.rookies.java05.AssetManagement.Repository.RequestForReturningRepository;
import com.nashtech.rookies.java05.AssetManagement.exceptions.ObjectNotFoundException;
import com.nashtech.rookies.java05.AssetManagement.services.AssetService;
import com.nashtech.rookies.java05.AssetManagement.services.AssignmentService;
import com.nashtech.rookies.java05.AssetManagement.services.EmployeeService;
import com.nashtech.rookies.java05.AssetManagement.services.RequestForReturningService;

import com.nashtech.rookies.java05.AssetManagement.utils.ASSET_STATUS;
import com.nashtech.rookies.java05.AssetManagement.utils.ASSIGNMENT_STATUS;
import com.nashtech.rookies.java05.AssetManagement.utils.REQUEST_FOR_RETURNING_STATUS;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class RequestForReturningServiceImpl implements RequestForReturningService {

    @Autowired
    private RequestForReturningRepository requestForReturningRepository;
    
    @Autowired
    private ModelMapper mapper;
    
    @Autowired
    private AssignmentService assignmentService;
    
    @Autowired
    private EmployeeService employeeService;

    @Autowired
	private AssetService assetService;

	@Override
	public RequestForReturningDTO convertToDto(RequestForReturning request) {
		RequestForReturningDTO requestDto = mapper.map(request, RequestForReturningDTO.class);
		if(request.getAcceptedByEmployee()!=null) {
			requestDto.setAcceptedBy_id(request.getAcceptedByEmployee().getId());
			requestDto.setAcceptedBy_name(request.getAcceptedByEmployee().getUsername());
		}
		requestDto.setAsset_code(request.getAssignment().getAsset().getId());
		requestDto.setAsset_name(request.getAssignment().getAsset().getName());
		requestDto.setAssignmentId(request.getAssignment().getId());
		requestDto.setRequestBy_id(request.getRequestByEmployee().getId());
		requestDto.setRequestBy_name(request.getRequestByEmployee().getUsername());
		requestDto.setAssigned_date(request.getAssignment().getCreateddate());
		requestDto.setReturned_date(request.getReturnedDate());
		return requestDto;
	}

	@Override
	public RequestForReturning convertToEntity(RequestForReturningDTO requestDto) {
		RequestForReturning request = mapper.map(requestDto, RequestForReturning.class);
		Assignment assignmentRequest = assignmentService.findAssignmentById(requestDto.getAssignmentId()).orElse(null);
		Employee employeeRequest = employeeService.getEmployeeByUsername(requestDto.getRequestBy_name()).orElse(null);
		Employee employeeAccepted = employeeService.getEmployeeByUsername(requestDto.getAcceptedBy_name()).orElse(null);
		request.setAssignment(assignmentRequest);
		request.setAcceptedByEmployee(employeeAccepted);
		request.setRequestByEmployee(employeeRequest);
		return request;
	}

	@Override
	public RequestForReturning createRequest(RequestForReturning request) {
		return requestForReturningRepository.save(request);
	}

	@Override
	public boolean existByAssignment(Assignment assignment) {
		RequestForReturning request = requestForReturningRepository.findRequestByAssignmentId(assignment.getId()).orElse(null);
		if(request==null) {
			return false;
		}
		return true;
	}

	@Override
	public List<RequestForReturning> retrieveRequests(String location) {
		Sort sortable = Sort.by("id").ascending();
		return requestForReturningRepository.findAllByAssignment_Asset_Location(location, sortable);
	}

	@Override
	public List<RequestForReturning> retrieveRequestsByStateAndLocation(int state, String location) {
		Sort sortable = Sort.by("id").ascending();
		return requestForReturningRepository.findAllByStateAndAssignment_Asset_Location(state, location, sortable);
	}

	@Override
	public List<RequestForReturning> retrieveRequestsByReturnedDateAndLocation(Date date, String location) {
		return requestForReturningRepository.findAllByReturned_date(date, location);
	}

	@Override
	public List<RequestForReturning> retrieveRequestsByStateAndReturnedDateAndLocation(int state, Date date, String location) {
		return requestForReturningRepository.findAllByStateAndReturned_date(state, date, location);
	}

	@Override
	public RequestForReturning getRequestById(Long requestId) throws NoSuchElementException{
		return requestForReturningRepository.findRequestById(requestId).get();
	}

	@Override
	public List<RequestForReturning> searchRequest(String searchText, String location) {
		Sort sortable = Sort.by("id").ascending();
		if (searchText == null || searchText.trim().length() == 0)
			return requestForReturningRepository.findAllByAssignment_Asset_Location(location, sortable);
		return requestForReturningRepository.searchRequest(searchText.toUpperCase(), location);
	}

	public boolean deleteRequestById(Long requestId) {
		return requestForReturningRepository.findById(requestId).map(request -> {
			requestForReturningRepository.delete(request);
			return true;
		}).orElse(false);

	}

	@Override
	public Optional<RequestForReturning> findRequestById(Long requestId) {
		return requestForReturningRepository.findById(requestId);
	}

	@Override
	@Transactional
	public boolean completeReturningRequest(RequestForReturning request, String acceptedBy) {
		Employee acceptedEmp = null;
		try{
			acceptedEmp = employeeService.getEmployee(acceptedBy).get();
		}
		catch (NoSuchElementException ex){
			throw new ObjectNotFoundException("Error: Not found employee with ID: " + acceptedBy);
		}
		try {
			if (request.getState() == REQUEST_FOR_RETURNING_STATUS.WAITING_FOR_RETURNING) {
				//Change state from "WAITING FOR RETURNING" to "COMPLETED"
				request.setState(REQUEST_FOR_RETURNING_STATUS.COMPLETED);
				//Change return date to now
				request.setReturnedDate(new Date());
				//Update acceptedBy field
				if (acceptedEmp != null){
					request.setAcceptedByEmployee(acceptedEmp);
				}
				//Change state of assignment to "3"
				Assignment assignment = assignmentService.findAssignmentById(request.getAssignment().getId()).get();
				assignment.setStatus(ASSIGNMENT_STATUS.COMPLETE);
				AssignmentDTO dto = assignmentService.convertToDTO(assignment);
				Assignment updateAssignment = assignmentService.updateAssignment(request.getAssignment().getId(), dto);
				//Change asset state to available
				Asset asset = assetService.findAssetById(dto.getAssetId());
				asset.setState(ASSET_STATUS.AVAILABLE);
				AssetDTO assetDTO = assetService.convertToDto(asset);
				Asset updateAsset = assetService.updateAsset(dto.getAssetId(), assetDTO);
				return true;
			}
			return false;
		} catch (NoSuchElementException ex) {
			throw new ObjectNotFoundException("Error: Assignment not found with id: " + request.getAssignment().getId());
		}
	}

}
