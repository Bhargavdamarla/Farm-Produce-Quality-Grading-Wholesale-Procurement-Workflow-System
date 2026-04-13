package com.guvi.procurement.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "quality_grade")
@Data
public class QualityGrade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String gradeName;   // e.g. "Grade A", "Grade B", "Grade C"
    private String description;
    private Double minScore;
    private Double maxScore;
}
