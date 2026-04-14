package com.guvi.procurement.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ProcurementOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produce_id", nullable = false)
    private FarmProduce produce;

    @ManyToOne
    @JoinColumn(name = "officer_id", nullable = false)
    private User officer;

    private Double quantity;
    private Double unitPrice;
    private Double totalAmount; // quantity × unitPrice
    private LocalDateTime orderDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    public enum OrderStatus {
        PENDING,
        APPROVED,
        COMPLETED,
        CANCELLED
    }
}
