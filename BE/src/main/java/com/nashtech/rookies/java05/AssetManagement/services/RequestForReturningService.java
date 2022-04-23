package com.nashtech.rookies.java05.AssetManagement.services;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.RequestForReturningDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Assignment;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.RequestForReturning;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface RequestForReturningService {
	RequestForReturning createRequest(RequestForReturning request);

	RequestForReturningDTO convertToDto(RequestForReturning request);

	RequestForReturning convertToEntity(RequestForReturningDTO requestDto);
	
	boolean existByAssignment(Assignment assignment);

	List<RequestForReturning> retrieveRequests(String location);

	List<RequestForReturning> retrieveRequestsByStateAndLocation(int state, String location);

	List<RequestForReturning> retrieveRequestsByReturnedDateAndLocation(Date date, String location);

	List<RequestForReturning> retrieveRequestsByStateAndReturnedDateAndLocation(int state, Date date, String location);

	RequestForReturning getRequestById(Long requestId);

	List<RequestForReturning> searchRequest(String searchText, String location);

	boolean deleteRequestById(Long requestId);

	Optional<RequestForReturning> findRequestById(Long requestId);

	boolean completeReturningRequest(RequestForReturning request, String acceptedBy);
}
