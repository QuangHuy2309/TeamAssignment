package com.nashtech.rookies.java05.AssetManagement.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Asset;

public interface AssetRepository extends JpaRepository<Asset, String> {

	@Query(value = "Select e.location FROM public.employee e WHERE e.username = :username", nativeQuery = true)
	Optional<String> getAdminLocationByUsername(String username);

	Optional<List<Asset>> findByLocationOrderByIdAsc(String location);

	@Query("SELECT a FROM Asset a WHERE a.location LIKE %?2% AND (a.id LIKE %?1%" + " OR UPPER(a.name) LIKE %?1%)" + " ORDER BY a.id ASC ")
	List<Asset> searchAsset(String keyword, String location);

	@Query("SELECT a FROM Asset a WHERE a.state = 1 AND a.location LIKE %?2% AND (a.id LIKE %?1%" + " OR UPPER(a.name) LIKE %?1%)" + " ORDER BY a.id ASC ")
	List<Asset> searchAssetAvailable(String keyword, String location);

	@Query(value = "Select a.id FROM public.asset a WHERE a.id like :categoryPrefix% order by id desc limit 1", nativeQuery = true)
	Optional<String> getLastestIdByPrefix(String categoryPrefix);

}
