package com.nashtech.rookies.java05.AssetManagement.Model.DTO;

public class ReportDTO {
	private String categoryPrefix;
	private String categoryName;
	private Long totalAsset;
	private Long assetAvailable;
	private Long assetNotAvailable;
	private Long assetAssign;
	private Long assetWaiting;
	private Long assetRecycled;
	
	
	public ReportDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	public ReportDTO(String categoryPrefix, String categoryName, Long totalAsset, Long assetAvailable,
			Long assetNotAvailable, Long assetAssign, Long assetWaiting, Long assetRecycled) {
		super();
		this.categoryPrefix = categoryPrefix;
		this.categoryName = categoryName;
		this.totalAsset = totalAsset;
		this.assetAvailable = assetAvailable;
		this.assetNotAvailable = assetNotAvailable;
		this.assetAssign = assetAssign;
		this.assetWaiting = assetWaiting;
		this.assetRecycled = assetRecycled;
	}



	public String getCategoryPrefix() {
		return categoryPrefix;
	}
	public void setCategoryPrefix(String categoryPrefix) {
		this.categoryPrefix = categoryPrefix;
	}
	public String getCategoryName() {
		return categoryName;
	}
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
	public Long getTotalAsset() {
		return totalAsset;
	}
	public void setTotalAsset(Long totalAsset) {
		this.totalAsset = totalAsset;
	}
	public Long getAssetAssign() {
		return assetAssign;
	}
	public void setAssetAssign(Long assetAssign) {
		this.assetAssign = assetAssign;
	}
	public Long getAssetAvailable() {
		return assetAvailable;
	}
	public void setAssetAvailable(Long assetAvailable) {
		this.assetAvailable = assetAvailable;
	}
	public Long getAssetNotAvailable() {
		return assetNotAvailable;
	}
	public void setAssetNotAvailable(Long assetNotAvailable) {
		this.assetNotAvailable = assetNotAvailable;
	}
	public Long getAssetWaiting() {
		return assetWaiting;
	}
	public void setAssetWaiting(Long assetWaiting) {
		this.assetWaiting = assetWaiting;
	}


	public Long getAssetRecycled() {
		return assetRecycled;
	}


	public void setAssetRecycled(Long assetRecycled) {
		this.assetRecycled = assetRecycled;
	}
	
	
	
	
}
