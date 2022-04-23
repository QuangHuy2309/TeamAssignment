package com.nashtech.rookies.java05.AssetManagement.controllers;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.RequestForReturningDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Asset;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Assignment;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.RequestForReturning;
import com.nashtech.rookies.java05.AssetManagement.exceptions.InvalidDataException;
import com.nashtech.rookies.java05.AssetManagement.exceptions.MethodFailedException;
import com.nashtech.rookies.java05.AssetManagement.exceptions.ObjectNotFoundException;
import com.nashtech.rookies.java05.AssetManagement.payload.MessageResponse;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtAuthTokenFilter;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtUtils;
import com.nashtech.rookies.java05.AssetManagement.services.AssetService;
import com.nashtech.rookies.java05.AssetManagement.services.AssignmentService;
import com.nashtech.rookies.java05.AssetManagement.services.EmployeeService;
import com.nashtech.rookies.java05.AssetManagement.services.RequestForReturningService;
import com.nashtech.rookies.java05.AssetManagement.utils.ASSIGNMENT_STATUS;
import com.nashtech.rookies.java05.AssetManagement.utils.HelperFunction;
import com.nashtech.rookies.java05.AssetManagement.utils.REQUEST_FOR_RETURNING_STATUS;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class RequestForReturningController {
	@Autowired
	private RequestForReturningService requestForReturningService;

	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private AssignmentService assignmentService;

	@Autowired
	private AssetService assetService;

	@Autowired
	private HelperFunction helperFunction;

	@PostMapping("/requests")
	public ResponseEntity<?> createRequestForReturning(HttpServletRequest servletRequest,
			@RequestBody RequestForReturningDTO requestDto) {
		if (requestDto.getAssignmentId() == null) {
			throw new InvalidDataException("Error: Missing field.");
		}
		String jwt = JwtAuthTokenFilter.parseJwt(servletRequest);
		String username = jwtUtils.getUserNameFromJwtToken(jwt);
		Employee employeeRequest = employeeService.getEmployeeByUsername(username).orElse(null);
		if (employeeRequest == null) {
			throw new ObjectNotFoundException("Error: Cannot found user " + username);
		}
		Assignment assignmentForRequest = assignmentService.findAssignmentById(requestDto.getAssignmentId())
				.orElse(null);
		if (assignmentForRequest == null) {
			throw new ObjectNotFoundException("Error: Assignment does not exist!");
		}

		if (assignmentForRequest.getStatus() != ASSIGNMENT_STATUS.ACCEPTED) {
			throw new InvalidDataException("Error: Only request of assignment which has been accepted can be created");
		}

		requestDto.setRequestBy_name(username);
		requestDto.setState(REQUEST_FOR_RETURNING_STATUS.WAITING_FOR_RETURNING);

		boolean checkIfExistByAssignment = requestForReturningService.existByAssignment(assignmentForRequest);
		if (checkIfExistByAssignment) {
			throw new InvalidDataException(
					"Error: Request for returning assignment id " + requestDto.getAssignmentId() + " already created!");
		}
		RequestForReturning requestEntity = requestForReturningService.convertToEntity(requestDto);
		RequestForReturning requestCreated = requestForReturningService.createRequest(requestEntity);
		if (requestCreated == null) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Create Asset failed."));
		}
		return new ResponseEntity<RequestForReturningDTO>(requestForReturningService.convertToDto(requestCreated),
				HttpStatus.OK);
	}

	@GetMapping("/requests")
	public List<RequestForReturningDTO> getAllRequests(HttpServletRequest servletRequest, @RequestParam(name = "state", required = false) String state,
													   @RequestParam(name = "date", required = false) String date) throws ParseException {
		String location = helperFunction.getAdminLocationByJwt(servletRequest);

		if (state == null && date == null)
			return requestForReturningService.retrieveRequests(location).stream().map(requestForReturningService::convertToDto)
					.collect(Collectors.toList());

		if (date == null)
			return requestForReturningService.retrieveRequestsByStateAndLocation(Integer.parseInt(state), location)
					.stream().map(requestForReturningService::convertToDto)
					.collect(Collectors.toList());

		if (state == null) {
			Date returned_date = new SimpleDateFormat("yyyy-MM-dd").parse(date);
			return requestForReturningService.retrieveRequestsByReturnedDateAndLocation(returned_date, location)
					.stream().map(requestForReturningService::convertToDto)
					.collect(Collectors.toList());
		}

		Date returned_date = new SimpleDateFormat("yyyy-MM-dd").parse(date);
		return requestForReturningService.retrieveRequestsByStateAndReturnedDateAndLocation(Integer.parseInt(state), returned_date, location)
				.stream().map(requestForReturningService::convertToDto)
				.collect(Collectors.toList());

	}

	@GetMapping("/requests/{requestId}")
	public ResponseEntity<?> getRequest(@PathVariable Long requestId) {
		RequestForReturning requestForReturning = requestForReturningService.getRequestById(requestId);
		if (requestForReturning == null)
			throw new ObjectNotFoundException("Error: Request not found with ID: " + requestId);
		return new ResponseEntity<RequestForReturningDTO>(requestForReturningService.convertToDto(requestForReturning), HttpStatus.OK);
	}

	@GetMapping("/requests/search")
	public List<RequestForReturningDTO> searchRequest(HttpServletRequest servletRequest, @RequestParam(name = "criteria") String search) {
		String location = helperFunction.getAdminLocationByJwt(servletRequest);
		return requestForReturningService.searchRequest(search, location).stream().map(requestForReturningService::convertToDto)
				.collect(Collectors.toList());
	}

	@DeleteMapping("/requests/{requestId}")
	public ResponseEntity<?> deleteRequest(@PathVariable Long requestId) {
		RequestForReturning request = requestForReturningService.getRequestById(requestId);
		if (request == null) {
			throw new ObjectNotFoundException("Error: Request id " + requestId + " not found!");
		}
		if (request.getState() != REQUEST_FOR_RETURNING_STATUS.WAITING_FOR_RETURNING) {
			throw new InvalidDataException("Error: Only request have state waiting for returning can be deleted");
		}

		boolean requestDeleted = requestForReturningService.deleteRequestById(requestId);

		if (requestDeleted == false) {
			throw new MethodFailedException("Error: Cannot delete request");
		}

		return new ResponseEntity<Void>(HttpStatus.OK);
	}

	@PutMapping("/requests/complete/{requestId}")
	public ResponseEntity<?> completeReturningRequest(@PathVariable Long requestId, @RequestParam String acceptedBy){
		try{
			RequestForReturning request = requestForReturningService.getRequestById(requestId);
			try
			{
				Assignment assignment = assignmentService.findAssignmentById(request.getAssignment().getId()).get();
				try {
					Asset asset = assetService.findAssetById(assignment.getAsset().getId());
				}
				catch (NoSuchElementException ex)
				{
					throw new ObjectNotFoundException("Error: Asset not found with id: " + assignment.getAsset().getId());
				}
			}
			catch (NoSuchElementException ex)
			{
				throw new ObjectNotFoundException("Error: Assignment not found with id: " + request.getAssignment().getId());
			}
			boolean result = requestForReturningService.completeReturningRequest(request, acceptedBy);
			return result ? new ResponseEntity<>("Completed", HttpStatus.OK) : new ResponseEntity<>("Failed", HttpStatus.NOT_FOUND);
		}
		catch (NoSuchElementException ex){
			throw new ObjectNotFoundException("Error: Not found request with Id: " + requestId);
		}
	}
}
