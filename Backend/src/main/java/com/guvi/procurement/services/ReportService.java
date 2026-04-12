package com.guvi.procurement.services;

import com.guvi.procurement.dto.ProduceReportDTO;
import com.guvi.procurement.models.ProduceInventory;
import com.guvi.procurement.repositories.FarmProduceRepository;
import com.guvi.procurement.repositories.ProduceInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private FarmProduceRepository produceRepository;
    @Autowired
    private ProduceInventoryRepository inventoryRepository;

    public List<ProduceReportDTO> getJudgesComplexReport() {
        return produceRepository.getDetailedProduceReport();
    }

    public List<ProduceInventory> getLiveInventory() {
        return inventoryRepository.findAll();
    }
}
