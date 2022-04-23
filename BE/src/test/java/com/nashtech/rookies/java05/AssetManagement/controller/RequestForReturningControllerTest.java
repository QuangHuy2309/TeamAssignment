package com.nashtech.rookies.java05.AssetManagement.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.security.auth.message.callback.PrivateKeyCallback.Request;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.nashtech.rookies.java05.AssetManagement.Model.DTO.RequestForReturningDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Asset;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Assignment;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Category;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.RequestForReturning;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtUtils;
import com.nashtech.rookies.java05.AssetManagement.services.AssignmentService;
import com.nashtech.rookies.java05.AssetManagement.services.EmployeeService;
import com.nashtech.rookies.java05.AssetManagement.services.RequestForReturningService;
import com.nashtech.rookies.java05.AssetManagement.utils.ASSIGNMENT_STATUS;

@SpringBootTest
@AutoConfigureMockMvc
public class RequestForReturningControllerTest {
	@MockBean
	private RequestForReturningService requestForReturningService;

	@MockBean
	private JwtUtils jwtUtils;

	@MockBean
	private EmployeeService employeeService;

	@MockBean
	private AssignmentService assignmentService;

	@Autowired
	private WebApplicationContext webApplicationContext;

	@Autowired
	private MockMvc mockMvc;

	Optional<Employee> employeeRequest;

	Optional<Assignment> assignmentRequest;

	Optional<Assignment> assignmentRequestNull;
	
	RequestForReturning request;

	String token;

	@BeforeEach
	public void setup() throws Exception {
		mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		Category cate_1 = new Category("PC", "Personal Computer", null);
		Date date = new SimpleDateFormat("yyyy-MM-dd").parse("2010-03-03");
		Date dob = new SimpleDateFormat("yyyy-MM-dd").parse("2000-03-03");
		Employee employee1 = new Employee("SD0028", "binhbb",
				"$2a$10$RQ3gahR8lGfdcjajqnnunOxLz8Rlob91g6LcBdCTPUkbn2/C5OiUC", "Hoang", "Le", dob, true, date, "Admin",
				2, "HCM");
		Employee employee2 = new Employee("SD0029", "anhnn",
				"$2a$10$RQ3gahR8lGfdcjajqnnunOxLz8Rlob91g6LcBdCTPUkbn2/C5OiUC", "Hoang", "Le", dob, true, date, "Admin",
				2, "HCM");
		Asset asset1 = new Asset("PC000001", "Personal Computer 1", date, 1, "HCM", "PC1", cate_1, null);
		assignmentRequest = Optional
				.of(new Assignment(14L, asset1, employee1, employee2, date, "", ASSIGNMENT_STATUS.ACCEPTED));
		assignmentRequestNull = Optional.empty();
		employeeRequest = Optional.of(employee1);
		request = new RequestForReturning(1L, assignmentRequest.get(), employee1, employee2, date, 1);
	}

	@Test
	@DisplayName("Fail Create - Request mising field.")
	@WithMockUser(username = "huy", password = "perform", roles = "Admin")
	public void createFail_MissingField() throws Exception {
		RequestForReturningDTO requestDto = new RequestForReturningDTO(null, null, null, null, null, null, null, null,
				null, 0, null);
		mockMvc.perform(post("/api/v1/requests").accept(MediaType.APPLICATION_JSON)
				.contentType(MediaType.APPLICATION_JSON).content(parseToJson(requestDto)))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("Fail Create - Assignment not found.")
	@WithMockUser(username = "anhnn", password = "anhnn@01012000", roles = "Admin")
	@WithUserDetails("anhnn")
	public void createFail_NotFoundAssignment() throws Exception {
		RequestForReturningDTO requestDto = new RequestForReturningDTO(null, null, null, null, null, null, null, null,
				null, 0, 1L);
		when(employeeService.getEmployeeByUsername(null)).thenReturn(employeeRequest);
		when(assignmentService.findAssignmentById(1L)).thenReturn(assignmentRequestNull);
		mockMvc.perform(
				post("/api/v1/requests").accept(MediaType.APPLICATION_JSON).header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON).content(parseToJson(requestDto)))
				.andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Fail Create - Request has assignment that already created.")
	@WithMockUser(username = "username1", password = "123456", roles = "Admin")
	public void createFail_CreatedAssignment() throws Exception {
		RequestForReturningDTO requestDto = new RequestForReturningDTO(null, null, null, null, null, null, null, null,
				null, 0, 14L);
		when(employeeService.getEmployeeByUsername(null)).thenReturn(employeeRequest);
		when(assignmentService.findAssignmentById(14L)).thenReturn(assignmentRequest);
		Assignment assignment = assignmentRequest.get();
		when(requestForReturningService.existByAssignment(assignment)).thenReturn(true);
		mockMvc.perform(post("/api/v1/requests").accept(MediaType.APPLICATION_JSON)
				.contentType(MediaType.APPLICATION_JSON).content(parseToJson(requestDto)))
				.andExpect(status().isBadRequest());
	}
	
	@Test
	@DisplayName("Fail Delete - Request does not exist")
	@WithMockUser(username = "username1", password = "123456", roles = "Admin")
	public void deleteFail_RequestNotFound() throws Exception {
		when(requestForReturningService.getRequestById(3L)).thenReturn(null);
		mockMvc.perform(delete("/api/v1/requests/3")
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isNotFound());
	}
	
	@Test
	@DisplayName("Fail Delete - Request doesn't have status waiting")
	@WithMockUser(username = "username1", password = "123456", roles = "Admin")
	public void deleteFail_StatusIsNotWaiting() throws Exception {
		Assignment assignment = assignmentRequest.get();
		Employee employeeEntity = employeeRequest.get();
		RequestForReturning requestStatusNotWaiting  = new RequestForReturning(3L, assignment, employeeEntity, null, null, 2);
		when(requestForReturningService.getRequestById(3L)).thenReturn(requestStatusNotWaiting);
		mockMvc.perform(delete("/api/v1/requests/3")).andExpect(status().isBadRequest());
	}
	
	@Test
	@DisplayName("Success Delete")
	@WithMockUser(username = "username1", password = "123456", roles = "Admin")
	public void deleteSuccess() throws Exception {
		Assignment assignment = assignmentRequest.get();
		Employee employeeEntity = employeeRequest.get();
		RequestForReturning requestSuccess  = new RequestForReturning(3L, assignment, employeeEntity, null, null, 1);
		when(requestForReturningService.getRequestById(3L)).thenReturn(requestSuccess);
		when(requestForReturningService.deleteRequestById(3L)).thenReturn(true);
		mockMvc.perform(delete("/api/v1/requests/3")).andExpect(status().isOk());
	}

	@Test
	@DisplayName("Search request with asset name")
	@WithMockUser(username = "username1", password = "123456", roles = "Admin")
	public void searchRequestFail_WithAssetName() throws Exception {
		Assignment assignment = assignmentRequest.get();
		Employee employeeEntity = employeeRequest.get();
		RequestForReturning requestSuccess  = new RequestForReturning(3L, assignment, employeeEntity, null, null, 1);
		List<RequestForReturning> requestForReturnings = new ArrayList<RequestForReturning>();
		requestForReturnings.add(requestSuccess);
		when(requestForReturningService.getRequestById(3L)).thenReturn(requestSuccess);
		when(requestForReturningService.searchRequest(requestSuccess.getAssignment().getAsset().getName(), "HCM")).thenReturn(requestForReturnings);
		mockMvc.perform(get("/api/v1/requests/search").param("criteria", "abc")
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Search request with asset code")
	@WithMockUser(username = "username1", password = "123456", roles = "Admin")
	public void searchRequestFail_WithAssetCode() throws Exception {
		Assignment assignment = assignmentRequest.get();
		Employee employeeEntity = employeeRequest.get();
		RequestForReturning requestSuccess  = new RequestForReturning(3L, assignment, employeeEntity, null, null, 1);
		List<RequestForReturning> requestForReturnings = new ArrayList<RequestForReturning>();
		requestForReturnings.add(requestSuccess);
		when(requestForReturningService.getRequestById(3L)).thenReturn(requestSuccess);
		when(requestForReturningService.searchRequest(requestSuccess.getAssignment().getAsset().getId(), "HCM")).thenReturn(requestForReturnings);
		mockMvc.perform(get("/api/v1/requests/search").param("criteria", "ms")
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Search request with requester's username")
	@WithMockUser(username = "anhnn", password = "anhnn@01012000", roles = "Admin")
	public void searchRequest_WithRequesterUsername() throws Exception {
		Assignment assignment = assignmentRequest.get();
		Employee employeeEntity = employeeRequest.get();
		RequestForReturning requestSuccess  = new RequestForReturning(3L, assignment, employeeEntity, null, null, 1);
		List<RequestForReturning> requestForReturnings = new ArrayList<RequestForReturning>();
		requestForReturnings.add(requestSuccess);
		when(requestForReturningService.getRequestById(3L)).thenReturn(requestSuccess);
		when(requestForReturningService.searchRequest(requestSuccess.getRequestByEmployee().getUsername(), "HCM")).thenReturn(requestForReturnings);
		mockMvc.perform(get("/api/v1/requests/search").param("criteria", "anh")
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isNotFound());
	}

	public String parseToJson(Object obj) {
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		String json;
		try {
			json = ow.writeValueAsString(obj);
			return json;
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return null;
	}
}
