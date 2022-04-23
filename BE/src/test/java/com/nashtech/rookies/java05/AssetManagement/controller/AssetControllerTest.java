package com.nashtech.rookies.java05.AssetManagement.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Asset;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Category;
import com.nashtech.rookies.java05.AssetManagement.services.AssetService;
import com.nashtech.rookies.java05.AssetManagement.services.AssignmentService;

@SpringBootTest
@AutoConfigureMockMvc
public class AssetControllerTest {

	@MockBean
	private AssetService assetService;

	@MockBean
	private AssignmentService assignmentService;

	@Autowired
	private MockMvc mockMvc;
	
	@Autowired
	private WebApplicationContext webApplicationContext;

	private List<Asset> assets;

	private Asset asset1;

	private Asset asset2;

	@BeforeEach
	public void setup() throws ParseException {
		Category cate_1 = new Category("PC", "Personal Computer", null);
		Date date = new SimpleDateFormat("yyyy-MM-dd").parse("2010-03-03");
		asset1 = new Asset("PC000001", "Personal Computer 1", date, 1, "HCM", "PC1", cate_1, null);
		asset2 = new Asset("PC000002", "Personal Computer 2", date, 1, "HCM", "PC2", cate_1, null);
		assets = new ArrayList<Asset>();
		assets.add(asset1);
		assets.add(asset2);
		cate_1.setAssets(assets);
		mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
	}

	@Test
	@DisplayName("Delete fail when exist assignment history")
	@WithMockUser(username = "huy", password = "123456", roles = "Admin")
	public void deleteFail_WhenExistsAssignmentHistory() throws Exception {
		when(assetService.findAssetById("PC000001")).thenReturn(asset1);
		when(assignmentService.existsByAssetAndStatusNot(asset1,0)).thenReturn(true);

		mockMvc.perform(delete("/api/v1/assets/PC000001")
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isBadRequest());
	}
	
	@Test
	@DisplayName("Delete fail when asset not exist")
	@WithMockUser(username = "huy", password = "123456", roles = "Admin")
	public void deleteFail_WhenAssetNotExist() throws Exception {
		when(assetService.findAssetById("PC000003")).thenReturn(null);

		mockMvc.perform(delete("/api/v1/assets/PC000003")
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isNotFound());
	}
	
	@Test
	@DisplayName("Delete success")
	@WithMockUser(username = "huy", password = "123456", roles = "Admin")
	public void deleteSuccessful() throws Exception {
		when(assetService.findAssetById("PC000001")).thenReturn(asset1);
		when(assignmentService.existsByAssetAndStatusNot(asset1,0)).thenReturn(false);
		when(assetService.deleteAssetById("PC000001")).thenReturn(true);
		mockMvc.perform(delete("/api/v1/assets/PC000001")
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
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
