package com.nashtech.rookies.java05.AssetManagement.Repository;

import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Assignment;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.RequestForReturning;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface RequestForReturningRepository extends JpaRepository<RequestForReturning, Long> {
	boolean existsByAssignment(Assignment assignment);

	@Query(value = "Select * FROM public.request_for_returning r WHERE r.id = :requestId", nativeQuery = true)
	Optional<RequestForReturning> findRequestById(Long requestId);

	List<RequestForReturning> findAllByAssignment_Asset_Location(String location, Sort sort);

	List<RequestForReturning> findAllByStateAndAssignment_Asset_Location(int state, String location, Sort sort);

	@Query("SELECT r FROM RequestForReturning r WHERE DATE(r.returnedDate) = DATE(:returned_date) " +
			"AND UPPER(r.assignment.asset.location) = :location ORDER BY r.id ASC ")
	List<RequestForReturning> findAllByReturned_date(Date returned_date, String location);

	@Query("SELECT r FROM RequestForReturning r WHERE r.state = :state AND DATE(r.returnedDate) = DATE(:returned_date) " +
			"AND UPPER(r.assignment.asset.location) = :location ORDER BY r.id ASC ")
	List<RequestForReturning> findAllByStateAndReturned_date(int state, Date returned_date, String location);

	@Query("SELECT r FROM RequestForReturning r " +
			"WHERE r.assignment.asset.location LIKE %?2% AND (r.assignment.asset.id LIKE %?1%" + " OR UPPER(r.assignment.asset.name) LIKE %?1%" + " OR UPPER(r.requestByEmployee.username) LIKE %?1%)" +
			" ORDER BY r.id ASC ")
	List<RequestForReturning> searchRequest(String keyword, String location);
	
	@Query(value = "Select * FROM public.request_for_returning r WHERE r.assignment_id = :assignmentId", nativeQuery = true)
	Optional<RequestForReturning> findRequestByAssignmentId(Long assignmentId);
}
