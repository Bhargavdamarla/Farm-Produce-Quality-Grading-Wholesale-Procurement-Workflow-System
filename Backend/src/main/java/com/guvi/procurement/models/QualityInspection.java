package com.guvi.procurement.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class QualityInspection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "produce_id", nullable = false)
    private FarmProduce produce;

    @ManyToOne
    @JoinColumn(name = "inspector_id", nullable = false)
    private User inspector;

    private Double qualityScore; // 0 to 100

    @Enumerated(EnumType.STRING)
    private ProduceGrade grade;

    private String remarks;
    private LocalDateTime inspectionDate = LocalDateTime.now();
}
