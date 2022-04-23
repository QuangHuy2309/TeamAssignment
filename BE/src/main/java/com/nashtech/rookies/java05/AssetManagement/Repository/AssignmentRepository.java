package com.nashtech.rookies.java05.AssetManagement.Repository;

import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Asset;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Assignment;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByStatusNot(int status, Sort sort);

    List<Assignment> findAssignmentsByAssignedtoEmployeeAndCreateddateLessThanEqual(Employee employee, Date currentDate);

    boolean existsAssignmentByAsset(Asset asset);

    @Query("SELECT a FROM Assignment a " +
            "WHERE a.status <> 3 AND (a.asset.id LIKE %?1%" + " OR UPPER(a.asset.name) LIKE %?1%" + " OR UPPER(a.assignedtoEmployee.username) LIKE %?1%)" +
            " ORDER BY a.id ASC ")
    List<Assignment> searchAssignment(String keyword);

    List<Assignment> findByCreateddateAndStatusNot(Date date, int status, Sort sortable);
    
    boolean existsAssignmentByAssetAndStatusNot(Asset asset, int status);

    List<Assignment> findByCreateddate(Date date, Sort sortable);

    boolean existsByAssignedbyEmployeeOrAssignedtoEmployee(Employee assignedByEmp, Employee assignedToEmp);

    boolean existsByStatusNot(int completedStatus);
}
