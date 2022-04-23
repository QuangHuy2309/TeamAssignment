package com.nashtech.rookies.java05.AssetManagement.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.AssetDTO;
import com.nashtech.rookies.java05.AssetManagement.Model.DTO.ReportDTO;
import com.nashtech.rookies.java05.AssetManagement.Repository.AssetRepository;
import com.nashtech.rookies.java05.AssetManagement.services.impl.ReportServiceImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class ReportController {
	@Autowired
	AssetRepository assetRepo;
	@Autowired
	ReportServiceImpl reportService;
	
	@GetMapping("/reports")
	public ResponseEntity<?> getAssetReport() {
		List<ReportDTO> report = reportService.getAssetReport();
		return new ResponseEntity<List<ReportDTO>>(report, HttpStatus.OK);
	}
}
