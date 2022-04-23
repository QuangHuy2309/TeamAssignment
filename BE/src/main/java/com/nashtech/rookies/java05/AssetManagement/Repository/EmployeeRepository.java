package com.nashtech.rookies.java05.AssetManagement.Repository;

import java.util.List;
import java.util.Optional;

import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmployeeRepository extends JpaRepository<Employee, String> {

    Optional<Employee> findByUsernameAndStatusNot(String username, int status);
    
    List<Employee> findByStatusNotAndLocation(int status, String location, Sort sort);
    
    int countAllByUsernameContains(String username);
    
    int countByTypeAndStatusNotAndLocation(String type, int status, String location);
    
    int countByStatusNotAndLocation(int status, String location);

    List<Employee> findAllByStatusNot(Sort sort, int status);

    @Query("SELECT e FROM Employee e WHERE e.status <> 0 AND e.location LIKE %?2% AND (e.id LIKE %?1%"
            + " OR concat(UPPER(e.firstname), ' ', UPPER(e.lastname)) LIKE %?1%)"
            + " ORDER BY e.id ASC ")
    List<Employee> searchEmployee(String keyword, String location);

    List<Employee> findByTypeIgnoreCaseAndStatusNotAndLocation(String type, int status, String location, Sort sort);
}
