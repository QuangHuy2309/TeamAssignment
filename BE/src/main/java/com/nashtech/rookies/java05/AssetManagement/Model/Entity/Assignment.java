package com.nashtech.rookies.java05.AssetManagement.Model.Entity;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;


@Entity
@Table(name="assignment", schema = "public")
public class Assignment {
   @Id
   @Column(name="id")
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @NotNull(message = "Asset name is not null")
   @ManyToOne(optional =  false, fetch = FetchType.EAGER)
   @JoinColumn(name = "asset_id")
   private Asset asset;

   @NotNull(message = "Employee assigned to is not null")
   @ManyToOne(optional = false, fetch = FetchType.EAGER)
   @JoinColumn(name = "assignedto_id")
   private Employee assignedtoEmployee;

   @NotNull(message = "Employee assigned by is not null")
   @ManyToOne(optional = false, fetch = FetchType.EAGER)
   @JoinColumn(name = "assignedby_id")
   private Employee assignedbyEmployee;

   @JsonFormat(pattern = "yyyy-MM-dd")
	@Column(name = "createddate", columnDefinition="DATE")
	private Date createddate;

   @Column(name = "note", columnDefinition = "TEXT")
   private String note;

   @Column(name = "status")
   private int status;

   public Assignment() {
   }

   public Assignment(@NotBlank(message = "ID is not null") Long id, Asset asset,
           @NotBlank(message = "Employee assigned to is not null") Employee assignedtoEmployee,
           @NotBlank(message = "Employee assigned by is not null") Employee assignedbyEmployee, Date createddate,
           String note, int status) {
       this.id = id;
       this.asset = asset;
       this.assignedtoEmployee = assignedtoEmployee;
       this.assignedbyEmployee = assignedbyEmployee;
       this.createddate = createddate;
       this.note = note;
       this.status = status;
   }

   public Long getId() {
       return id;
   }

   public void setId(@NotBlank(message = "ID is not null") Long id) {
       this.id = id;
   }

   public Asset getAsset() {
       return asset;
   }

   public void setAsset(Asset asset) {
       this.asset = asset;
   }

   public Employee getAssignedtoEmployee() {
       return assignedtoEmployee;
   }

   public void setAssignedtoEmployee(Employee assignedtoEmployee) {
       this.assignedtoEmployee = assignedtoEmployee;
   }

   public Employee getAssignedbyEmployee() {
       return assignedbyEmployee;
   }

   public void setAssignedbyEmployee(Employee assignedbyEmployee) {
       this.assignedbyEmployee = assignedbyEmployee;
   }

   public Date getCreateddate() {
       return createddate;
   }

   public void setCreateddate(Date createddate) {
       this.createddate = createddate;
   }

   public String getNote() {
       return note;
   }

   public void setNote(String note) {
       this.note = note;
   }

   public int getStatus() {
       return status;
   }

   public void setStatus(int status) {
       this.status = status;
   }

   @Override
   public int hashCode() {
       final int prime = 31;
       int result = 1;
       result = prime * result + ((asset == null) ? 0 : asset.hashCode());
       result = prime * result + ((assignedbyEmployee == null) ? 0 : assignedbyEmployee.hashCode());
       result = prime * result + ((assignedtoEmployee == null) ? 0 : assignedtoEmployee.hashCode());
       result = prime * result + ((createddate == null) ? 0 : createddate.hashCode());
       result = prime * result + ((id == null) ? 0 : id.hashCode());
       result = prime * result + ((note == null) ? 0 : note.hashCode());
       result = prime * result + status;
       return result;
   }

   @Override
   public boolean equals(Object obj) {
       if (this == obj)
           return true;
       if (obj == null)
           return false;
       if (getClass() != obj.getClass())
           return false;
       Assignment other = (Assignment) obj;
       if (asset == null) {
           if (other.asset != null)
               return false;
       } else if (!asset.equals(other.asset))
           return false;
       if (assignedbyEmployee == null) {
           if (other.assignedbyEmployee != null)
               return false;
       } else if (!assignedbyEmployee.equals(other.assignedbyEmployee))
           return false;
       if (assignedtoEmployee == null) {
           if (other.assignedtoEmployee != null)
               return false;
       } else if (!assignedtoEmployee.equals(other.assignedtoEmployee))
           return false;
       if (createddate == null) {
           if (other.createddate != null)
               return false;
       } else if (!createddate.equals(other.createddate))
           return false;
       if (id == null) {
           if (other.id != null)
               return false;
       } else if (!id.equals(other.id))
           return false;
       if (note == null) {
           if (other.note != null)
               return false;
       } else if (!note.equals(other.note))
           return false;
       if (status != other.status)
           return false;
       return true;
   }

   

   
}
