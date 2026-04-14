package com.guvi.procurement.repositories;

import com.guvi.procurement.models.FarmProduce;
import com.guvi.procurement.models.ProduceStatus;
import com.guvi.procurement.dto.ProduceReportDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FarmProduceRepository extends JpaRepository<FarmProduce, Long> {
    List<FarmProduce> findByStatus(ProduceStatus status);
    List<FarmProduce> findByFarmerId(Long farmerId);

    @Query("SELECT new com.guvi.procurement.dto.ProduceReportDTO(" +
           "fp.id, f.name, c.name, fp.quantity, fp.status, qi.grade, qi.qualityScore, i.name) " +
           "FROM FarmProduce fp " +
           "JOIN fp.farmer f " +
           "JOIN fp.category c " +
           "LEFT JOIN QualityInspection qi ON qi.produce.id = fp.id " +
           "LEFT JOIN qi.inspector i")
    List<ProduceReportDTO> getDetailedProduceReport();
}
