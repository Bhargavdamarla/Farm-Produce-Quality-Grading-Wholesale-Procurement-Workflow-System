package com.guvi.procurement.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Procurement API is running");
        response.put("endpoints", "/api/health, /api/info, /api/auth, /api/users, /api/produce");
        return ResponseEntity.ok(response);
    }

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> error() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ERROR");
        response.put("message", "The requested endpoint was not found. Use /api/health or /api/info.");
        return ResponseEntity.status(404).body(response);
    }
}
