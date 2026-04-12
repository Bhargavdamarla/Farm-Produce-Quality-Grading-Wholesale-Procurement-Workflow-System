package com.guvi.procurement.controllers;

import com.guvi.procurement.dto.ProduceReportDTO;
import com.guvi.procurement.models.ProduceInventory;
import com.guvi.procurement.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @GetMapping("/judges-summary")
    public ResponseEntity<List<ProduceReportDTO>> getJudgesSummary() {
        return ResponseEntity.ok(reportService.getJudgesComplexReport());
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<ProduceInventory>> getLiveInventory() {
        return ResponseEntity.ok(reportService.getLiveInventory());
    }
}
