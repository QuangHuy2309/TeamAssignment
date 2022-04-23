package com.nashtech.rookies.java05.AssetManagement.services.impl;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.ReportDTO;

public class ReportMapper implements RowMapper<ReportDTO>{

	@Override
	public ReportDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
		ReportDTO report = new ReportDTO();
		report.setAssetAssign(Long.parseLong(rs.getString("assetassigned")));
		report.setAssetAvailable(Long.parseLong(rs.getString("assetavailable")));
		report.setAssetNotAvailable(Long.parseLong(rs.getString("assetnotavailable")));
		report.setAssetRecycled(Long.parseLong(rs.getString("assetrecycled")));
		report.setAssetWaiting(Long.parseLong(rs.getString("assetwaiting")));
		report.setTotalAsset(Long.parseLong(rs.getString("totalasset")));
		report.setCategoryName(rs.getString("categoryname"));
		report.setCategoryPrefix(rs.getString("categoryprefix"));
		return report;
	}
	
}
