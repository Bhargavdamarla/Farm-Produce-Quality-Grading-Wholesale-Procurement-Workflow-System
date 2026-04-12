package com.guvi.procurement.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class FarmProduce {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ProduceCategory category;

    private Double quantity; // in Kg

    @Enumerated(EnumType.STRING)
    private ProduceStatus status = ProduceStatus.PENDING_INSPECTION;

    private LocalDateTime submissionDate = LocalDateTime.now();
    
    @Transient
    private QualityInspection inspection; // To be fetched dynamically or mapped properly
}
