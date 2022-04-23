package com.nashtech.rookies.java05.AssetManagement.services.impl;

import java.util.List;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import com.nashtech.rookies.java05.AssetManagement.Model.DTO.ReportDTO;
import com.nashtech.rookies.java05.AssetManagement.services.ReportService;

@Service
public class ReportServiceImpl implements ReportService{
	NamedParameterJdbcTemplate template;
	
	public ReportServiceImpl(NamedParameterJdbcTemplate template) {
		this.template = template;
	}



	@Override
	public List<ReportDTO> getAssetReport() {
		String sqlQuery = "select c.prefix as categoryPrefix, c.name as categoryName, total.totalAsset, available.assetAvailable, "
				+ "		notAvailable.assetNotAvailable, assigned.assetAssigned,	waiting.assetWaiting, recycled.assetRecycled "
				+ "from public.category c "
				+ "inner join LATERAL (select count(1) as totalAsset "
				+ "			from public.asset a  "
				+ "			where a.category_id = c.prefix) as total on 1=1 "
				+ "inner join LATERAL (select count(1) as assetAvailable "
				+ "			from public.asset a "
				+ "			where a.category_id = c.prefix and a.state = 1) as available on 1=1 "
				+ "inner join LATERAL (select count(1) as assetNotAvailable "
				+ "			from public.asset a "
				+ "			where a.category_id = c.prefix and a.state = 2) as notAvailable on 1=1 "
				+ "inner join LATERAL (select count(1) as assetAssigned "
				+ "			from public.asset a "
				+ "			where a.category_id = c.prefix and a.state = 3) as assigned on 1=1 "
				+ "inner join LATERAL (select count(1) as assetWaiting "
				+ "			from public.asset a "
				+ "			where a.category_id = c.prefix and a.state = 4) as waiting on 1=1 "
				+ "inner join LATERAL (select count(1) as assetRecycled "
				+ "			from public.asset a "
				+ "			where a.category_id = c.prefix and a.state = 5) as recycled on 1=1";
		
		return template.query(sqlQuery, new ReportMapper());
	}
	
}
