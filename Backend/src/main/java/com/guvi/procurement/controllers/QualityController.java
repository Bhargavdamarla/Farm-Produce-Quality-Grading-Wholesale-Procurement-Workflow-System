package com.guvi.procurement.controllers;

import com.guvi.procurement.dto.GradeSubmitRequest;
import com.guvi.procurement.models.QualityInspection;
import com.guvi.procurement.services.QualityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/inspections")
public class QualityController {
    @Autowired
    private QualityService qualityService;

    @Autowired
    private com.guvi.procurement.repositories.QualityInspectionRepository inspectionRepository;

    @PostMapping
    public ResponseEntity<QualityInspection> inspectProduce(@RequestBody GradeSubmitRequest request) {
        return ResponseEntity.ok(qualityService.inspectProduce(request));
    }

    @GetMapping
    public ResponseEntity<java.util.List<QualityInspection>> getAllInspections() {
        return ResponseEntity.ok(inspectionRepository.findAll());
    }
}
