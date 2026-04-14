package com.guvi.procurement.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ProduceInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ProduceCategory category;

    private Double totalQuantity; // in Kg

    @Enumerated(EnumType.STRING)
    private InventoryStatus status = InventoryStatus.IN_STOCK;

    public enum InventoryStatus {
        IN_STOCK,
        LOW_STOCK,
        OUT_OF_STOCK
    }
}
