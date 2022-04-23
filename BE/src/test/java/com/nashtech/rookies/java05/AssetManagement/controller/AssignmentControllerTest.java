package com.nashtech.rookies.java05.AssetManagement.controller;

import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Asset;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Assignment;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Category;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import com.nashtech.rookies.java05.AssetManagement.exceptions.ObjectNotFoundException;
import com.nashtech.rookies.java05.AssetManagement.services.AssignmentService;
import com.nashtech.rookies.java05.AssetManagement.utils.ASSIGNMENT_STATUS;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.swing.text.html.Option;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import java.util.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AssignmentControllerTest {
    @MockBean
    private AssignmentService assignmentService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private List<Assignment> assignments;

    private Asset asset1;

    private Asset asset2;

    private Asset asset3;

    private Employee employee1;

    private Employee employee2;

    private Optional<Assignment> assignmentAccepted;

    private Optional<Assignment> assignmentAccepted2;

    private Optional<Assignment> assignmentWaiting;

    private Optional<Assignment> assignmentWaitingUpdated;

    private Optional<Assignment> assignmentDeclined;

    private Optional<Assignment> assignmentCompleted;

    @BeforeEach
    public void setup() throws ParseException {
        Category cate_1 = new Category("PC", "Personal Computer", null);
        Date date = new SimpleDateFormat("yyyy-MM-dd").parse("2010-03-03");
        Date difDate = new SimpleDateFormat("yyyy-MM-dd").parse("2011-04-04");
        Date dob = new SimpleDateFormat("yyyy-MM-dd").parse("2000-03-03");
        asset1 = new Asset("PC000001", "Personal Computer 1", date, 1, "HCM", "PC1", cate_1, null);
        asset2 = new Asset("PC000002", "Personal Computer 2", date, 1, "HCM", "PC2", cate_1, null);
        asset3 = new Asset("PC000003", "Personal Computer 3", date, 1, "HCM", "PC2", cate_1, null);
        employee1 = new Employee("SD0028",
                "username1",
                "$2a$10$RQ3gahR8lGfdcjajqnnunOxLz8Rlob91g6LcBdCTPUkbn2/C5OiUC", "Hoang",
                "Le", dob, true, date,
                "Admin", 2, "HCM");
        employee2 = new Employee("SD0029",
                "username2",
                "$2a$10$RQ3gahR8lGfdcjajqnnunOxLz8Rlob91g6LcBdCTPUkbn2/C5OiUC", "Hoang",
                "Le", dob, true, date,
                "Admin", 2, "HCM");
        assignmentAccepted = Optional.of(new Assignment(1L, asset1,
                employee1,
                employee2, date,
                "", ASSIGNMENT_STATUS.ACCEPTED));
        assignmentWaiting = Optional.of(new Assignment(2L, asset2,
                employee1,
                employee2, date,
                "", ASSIGNMENT_STATUS.WAITING));
        assignmentWaitingUpdated = Optional.of(new Assignment(2L, asset2,
                employee1,
                employee2, date,
                "", ASSIGNMENT_STATUS.ACCEPTED));
        assignmentDeclined = Optional.of(new Assignment(3L, asset3,
                employee1,
                employee2, date,
                "", ASSIGNMENT_STATUS.REJECTED));
        assignmentAccepted2 = Optional.of(new Assignment(4L, asset3,
                employee1,
                employee2, difDate,
                "", ASSIGNMENT_STATUS.ACCEPTED));
        assignmentCompleted = Optional.of(new Assignment(5L, asset3
                , employee1
                , employee2
                , date
                , "", ASSIGNMENT_STATUS.COMPLETE));
        assignments = new ArrayList<Assignment>();
        assignments.add(assignmentAccepted.get());
        assignments.add(assignmentWaiting.get());
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    @DisplayName("Search assignment with blank")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void search_WhenCriteriaIsBlank() throws Exception {
        when(assignmentService.searchAssignments("")).thenReturn(assignments);
        mockMvc.perform(get("/api/v1/assignments/search").param("criteria", "")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()").value(assignments.size()));
    }

    @Test
    @DisplayName("Search assignment with asset code")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void search_WhenCriteriaIsAssetCode() throws Exception {
        List<Assignment> assignmentList = new ArrayList<Assignment>();
        assignmentList.add(assignmentAccepted.get());
        when(assignmentService.searchAssignments("PC000001")).thenReturn(assignmentList);
        mockMvc.perform(get("/api/v1/assignments/search").param("criteria", "PC000001")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()").value(1));
    }

    @Test
    @DisplayName("Search assignment with asset name")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void search_WhenCriteriaIsAssetName() throws Exception {
        when(assignmentService.searchAssignments("Personal Computer")).thenReturn(assignments);
        mockMvc.perform(get("/api/v1/assignments/search").param("criteria", "Personal Computer")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()").value(assignments.size()));
    }

    @Test
    @DisplayName("Search assignment with assignee's name")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void search_WhenCriteriaIsAssigneeName() throws Exception {
        when(assignmentService.searchAssignments("username1")).thenReturn(assignments);
        mockMvc.perform(get("/api/v1/assignments/search").param("criteria", "username1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()").value(2));
    }

    @Test
    @DisplayName("Delete fail when assignment has status Accepted")
    @WithMockUser(username = "anhnn", password = "123456", roles = "Admin")
    public void deleteFail_WhenStatusIsAccepted() throws Exception {
        when(assignmentService.findAssignmentById(1L)).thenReturn(assignmentAccepted);

        mockMvc.perform(delete("/api/v1/assignments/1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Delete fail when assignment has status Completed")
    @WithMockUser(username = "anhnn", password = "123456", roles = "Admin")
    public void deleteFail_WhenStatusIsCompleted() throws Exception {
        when(assignmentService.findAssignmentById(5L)).thenReturn(assignmentCompleted);

        mockMvc.perform(delete("/api/v1/assignments/5")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Delete fail when asset not exist")
    @WithMockUser(username = "anhnn", password = "123456", roles = "Admin")
    public void deleteFail_WhenAssetNotExist() throws Exception {
        when(assignmentService.findAssignmentById(5L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/v1/assignments/5")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Delete success when assignment has status Waiting")
    @WithMockUser(username = "anhnn", password = "123456", roles = "Admin")
    public void deleteSuccessful_WhenStatusIsWaiting() throws Exception {
        when(assignmentService.findAssignmentById(2L)).thenReturn(assignmentWaiting);
        when(assignmentService.deleteAssignment(2L)).thenReturn(true);
        mockMvc.perform(delete("/api/v1/assignments/2")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Delete success when assignment has status Declined")
    @WithMockUser(username = "anhnn", password = "123456", roles = "Admin")
    public void deleteSuccessful_WhenStatusIsDeclined() throws Exception {
        when(assignmentService.findAssignmentById(3L)).thenReturn(assignmentDeclined);
        when(assignmentService.deleteAssignment(3L)).thenReturn(true);
        mockMvc.perform(delete("/api/v1/assignments/3")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Update status fail when assignment has status Declined")
    @WithMockUser(username = "anhnn", password = "123456", roles = "Admin")
    public void updateStatusFail_WhenStatusIsDeclined() throws Exception {
        when(assignmentService.findAssignmentById(3L)).thenReturn(assignmentDeclined);
        mockMvc.perform(put("/api/v1/assignments/status/3?status=1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Update status fail when assignment has status Accepted")
    @WithMockUser(username = "anhnn", password = "123456", roles = "Staff")
    public void updateStatusFail_WhenStatusIsAccepted() throws Exception {
        when(assignmentService.findAssignmentById(1L)).thenReturn(assignmentAccepted);
        mockMvc.perform(put("/api/v1/assignments/status/1?status=1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Update status fail when assignment doesn't exist")
    @WithMockUser(username = "anhnn", password = "123456", roles = "Staff")
    public void updateStatusFail_WhenAssignmentNotExist() throws Exception {
        when(assignmentService.findAssignmentById(4L)).thenReturn(Optional.empty());
        mockMvc.perform(put("/api/v1/assignments/status/4?status=1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Update status success when assignment has status waiting")
    @WithMockUser(username = "anhnn", password = "123456", roles = "Staff")
    public void updateStatusSucess_WhenAssignmentISWaiting() throws Exception {
        when(assignmentService.findAssignmentById(2L)).thenReturn(assignmentWaiting);
        when(assignmentService.updateAssignmentStatus(2L,1)).thenReturn(assignmentWaitingUpdated.get());
        mockMvc.perform(put("/api/v1/assignments/status/2?status=1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
    }


//     @Test
//    @DisplayName("Staffs view assignments that assigned to them with employeeId existed")
//    @WithMockUser(username = "technv2", password = "Lol_rank_1999", roles = "Staff")
//    public void viewAssignmentsSuccessful_WithExistedEmpID_ReturnEmptyList() throws Exception{
//        List<Assignment> emptyAssignmentList = new ArrayList<>();
//        when(assignmentService.getAssignmentByAssignedToEmployee(employee1)).thenReturn(emptyAssignmentList);
//        mockMvc.perform(get("/api/v1/assignments/assignedTo/SD0084")
//                        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
//    }

    @Test
    @DisplayName("Filter assignment by state")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void filter_WhenFilterisStatus() throws Exception {
        when(assignmentService.getAllAssignments()).thenReturn(assignments);
        mockMvc.perform(get("/api/v1/assignments").param("state", "1")
        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.size()").value(1));
    }

    @Test
    @DisplayName("Filter assignment by date")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void filter_WhenFilterisDate() throws Exception {
        Date date = new SimpleDateFormat("yyyy-MM-dd").parse("2010-03-03");
        List<Assignment> assignmentsSameDate= new ArrayList<Assignment>();
        assignmentsSameDate.add(assignmentAccepted.get());
        assignmentsSameDate.add(assignmentWaiting.get());
        when(assignmentService.getAllAssignmentsbyDate(date)).thenReturn(assignmentsSameDate);
        mockMvc.perform(get("/api/v1/assignments?date=2010-03-03")
        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.size()").value(2));
    }

    @Test
    @DisplayName("Filter assignment but there are no result after filter wrong date")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void filter_WhenFilterGetNoReturn() throws Exception {
        Date date = new SimpleDateFormat("yyyy-MM-dd").parse("2010-03-03");
        when(assignmentService.getAllAssignmentsbyDate(date)).thenReturn(assignments);
        mockMvc.perform(get("/api/v1/assignments?date=2010-03-04")
        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.size()").value(0));
    }

    @Test
    @DisplayName("Filter assignment by state and date")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void filter_WhenFilterisStatusandDate() throws Exception {
        Date date = new SimpleDateFormat("yyyy-MM-dd").parse("2010-03-03");
        List<Assignment> assignmentsBothFilter = new ArrayList<Assignment>();
        assignmentsBothFilter.add(assignmentAccepted.get());
        when(assignmentService.getAllAssignmentsbyDate(date)).thenReturn(assignmentsBothFilter);
        mockMvc.perform(get("/api/v1/assignments?state=1&date=2010-03-03")
        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.size()").value(1));
    }

    @Test
    @DisplayName("Filter param is empty")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void filter_WhenFilterisEmpty() throws Exception {
        when(assignmentService.getAllAssignments()).thenReturn(assignments);
        mockMvc.perform(get("/api/v1/assignments?state=&date=")
        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.size()").value(2));
    }

    @Test
    @DisplayName("Get the list of all assingment")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void getAssignmentListTest() throws Exception {
        when(assignmentService.getAllAssignments()).thenReturn(assignments);
        mockMvc.perform(get("/api/v1/assignments")
        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.size()").value(2));
    }

    @Test
    @DisplayName("Get detail of an existed assignment")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void getAssignmentDetail_ByExistedID() throws Exception {
        when(assignmentService.findAssignmentById(1L)).thenReturn(assignmentAccepted);
        mockMvc.perform(get("/api/v1/assignments/details/1")
        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Error when request an unexisted assignment")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void FailedToGetAssignmentDetail_WithUnexistedID() throws Exception {
        when(assignmentService.findAssignmentById(5L)).thenThrow(new ObjectNotFoundException("Error: No found assignment with ID: "));
        mockMvc.perform(get("/api/v1/assignments/details/5")
        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Request an assignment with decline status")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void FailedToGetDeclineAssignmentDetail_WithID() throws Exception {
        when(assignmentService.findAssignmentById(3L)).thenReturn(assignmentDeclined);
        mockMvc.perform(get("/api/v1/assignments/details/3")
        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
    }
}
