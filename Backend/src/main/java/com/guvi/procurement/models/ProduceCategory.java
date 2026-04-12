package com.guvi.procurement.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ProduceCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}
