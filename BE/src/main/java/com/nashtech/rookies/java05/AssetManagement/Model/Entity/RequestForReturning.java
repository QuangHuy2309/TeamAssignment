package com.nashtech.rookies.java05.AssetManagement.Model.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "request_for_returning")
public class RequestForReturning {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "request_by")
    private Employee requestByEmployee;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "accepted_by")
    private Employee acceptedByEmployee;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "returned_date", columnDefinition = "DATE")
    private Date returnedDate;

    @Column(name = "state")
    private int state;

    public RequestForReturning(Long id, Assignment assignment, Employee requestByEmployee, Employee acceptedByEmployee,
                               Date returnedDate, int state) {
        this.id = id;
        this.assignment = assignment;
        this.requestByEmployee = requestByEmployee;
        this.acceptedByEmployee = acceptedByEmployee;
        this.returnedDate = returnedDate;
        this.state = state;
    }

    public RequestForReturning() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Assignment getAssignment() {
        return assignment;
    }

    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }

    public Employee getRequestByEmployee() {
        return requestByEmployee;
    }

    public void setRequestByEmployee(Employee requestByEmployee) {
        this.requestByEmployee = requestByEmployee;
    }

    public Employee getAcceptedByEmployee() {
        return acceptedByEmployee;
    }

    public void setAcceptedByEmployee(Employee acceptedByEmployee) {
        this.acceptedByEmployee = acceptedByEmployee;
    }

    public Date getReturnedDate() {
        return returnedDate;
    }

    public void setReturnedDate(Date returnedDate) {
        this.returnedDate = returnedDate;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RequestForReturning that = (RequestForReturning) o;
        return Objects.equals(state, that.state) && Objects.equals(id, that.id)
                && Objects.equals(assignment, that.assignment) && Objects.equals(requestByEmployee, that.requestByEmployee)
                && Objects.equals(acceptedByEmployee, that.acceptedByEmployee) && Objects.equals(returnedDate, that.returnedDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, assignment, requestByEmployee, acceptedByEmployee, returnedDate, state);
    }
}
