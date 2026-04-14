package com.guvi.procurement.controllers;

import com.guvi.procurement.dto.ProcurementRequest;
import com.guvi.procurement.models.ProcurementOrder;
import com.guvi.procurement.services.ProcurementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/procurement")
public class ProcurementController {
    @Autowired
    private ProcurementService procurementService;
    
    @Autowired
    private com.guvi.procurement.repositories.ProcurementOrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<?> procureProduce(@RequestBody ProcurementRequest request) {
        try {
            return ResponseEntity.ok(procurementService.procureProduce(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<java.util.List<ProcurementOrder>> getAllProcurements() {
        return ResponseEntity.ok(orderRepository.findAll());
    }
}
