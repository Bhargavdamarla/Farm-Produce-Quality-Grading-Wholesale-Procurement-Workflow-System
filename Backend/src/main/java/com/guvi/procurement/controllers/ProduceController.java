package com.guvi.procurement.controllers;

import com.guvi.procurement.dto.SubmitProduceRequest;
import com.guvi.procurement.models.FarmProduce;
import com.guvi.procurement.services.ProduceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/produce")
public class ProduceController {
    @Autowired
    private ProduceService produceService;

    @PostMapping
    public ResponseEntity<FarmProduce> submitProduce(@RequestBody SubmitProduceRequest request) {
        return ResponseEntity.ok(produceService.submitProduce(request));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<FarmProduce>> getPendingProduce() {
        return ResponseEntity.ok(produceService.getPendingInspection());
    }
}
