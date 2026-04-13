package com.guvi.procurement.controllers;

import com.guvi.procurement.models.ProduceInventory;
import com.guvi.procurement.repositories.ProduceInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private ProduceInventoryRepository inventoryRepository;

    // GET /api/inventory — Get all inventory items
    @GetMapping
    public ResponseEntity<List<ProduceInventory>> getAllInventory() {
        return ResponseEntity.ok(inventoryRepository.findAll());
    }

    // GET /api/inventory/{id} — Get single inventory item
    @GetMapping("/{id}")
    public ResponseEntity<ProduceInventory> getInventoryById(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
