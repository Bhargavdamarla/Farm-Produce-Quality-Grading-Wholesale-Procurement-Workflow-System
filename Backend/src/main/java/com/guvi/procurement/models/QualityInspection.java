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

    @ManyToOne
    @JoinColumn(name = "produce_id", nullable = false)
    private FarmProduce produce;

    @ManyToOne
    @JoinColumn(name = "inspector_id", nullable = false)
    private User inspector;

    private Double qualityScore; // 0 to 100

    @ManyToOne
    @JoinColumn(name = "grade_id")
    private QualityGrade grade; // Link to QualityGrade entity

    @Enumerated(EnumType.STRING)
    private InspectionStatus status = InspectionStatus.ASSIGNED;

    private String remarks;
    private LocalDateTime inspectionDate = LocalDateTime.now();

    public enum InspectionStatus {
        ASSIGNED, INSPECTED, APPROVED, REJECTED
    }
}
