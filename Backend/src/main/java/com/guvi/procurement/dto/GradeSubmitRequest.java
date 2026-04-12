package com.guvi.procurement.dto;

import lombok.Data;

@Data
public class GradeSubmitRequest {
    private Long produceId;
    private Long inspectorId;
    private Double qualityScore;
    private String remarks;
}
