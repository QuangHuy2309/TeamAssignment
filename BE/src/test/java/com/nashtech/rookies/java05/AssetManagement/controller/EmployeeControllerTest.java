package com.nashtech.rookies.java05.AssetManagement.controller;

import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import com.nashtech.rookies.java05.AssetManagement.services.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class EmployeeControllerTest {

    @MockBean
    private EmployeeService employeeService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private List<Employee> employeeList;

    private Employee employee1;

    private Employee employee2;

    @BeforeEach
    public void setup() throws ParseException{
        String sdob = "01-01-2000";
        String sJoinedDate = "04-08-2021";
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date joinedDate = formatter.parse(sJoinedDate);
        Date dob = formatter.parse(sdob);
        employee1 = new Employee("SD0100", "khangn", encoder.encode("khangn@01012000"), "Khang", "Nguyen Chi", dob, true, joinedDate, "Staff", 1, "HCM");
        employee2 = new Employee("SD0200", "vietv", encoder.encode("vietv@01012000"), "Viet", "Van Chi", dob, true, joinedDate, "Admin", 1, "HCM");
        employeeList = new ArrayList<>();
        employeeList.add(employee1);
        employeeList.add(employee2);
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    @DisplayName("Disable employee failed because user is already inactive")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void disableFail_withUserStatus_Inactive() throws Exception{
        when(employeeService.disableUser("SD0050")).thenReturn(false);
        mockMvc.perform(put("/api/v1/employees/disable/SD0050")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Disable employee success")
    @WithMockUser(username = "binhbb", password = "123456", roles = "Admin")
    public void disableSuccess() throws Exception{
        when(employeeService.disableUser("SD0054")).thenReturn(true);
        mockMvc.perform(put("/api/v1/employees/disable/SD0054")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

}
