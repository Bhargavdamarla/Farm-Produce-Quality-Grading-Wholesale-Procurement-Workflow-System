package com.guvi.procurement.controllers;

import com.guvi.procurement.dto.ProcurementRequest;
import com.guvi.procurement.models.ProcurementOrder;
import com.guvi.procurement.services.ProcurementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/procurements")
public class ProcurementController {
    @Autowired
    private ProcurementService procurementService;

    @PostMapping
    public ResponseEntity<ProcurementOrder> procureProduce(@RequestBody ProcurementRequest request) {
        return ResponseEntity.ok(procurementService.procureProduce(request));
    }
}
