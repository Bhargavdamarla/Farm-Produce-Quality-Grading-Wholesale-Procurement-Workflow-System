package com.guvi.procurement.dto;

import com.guvi.procurement.models.ProduceStatus;
import com.guvi.procurement.models.ProduceGrade;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProduceReportDTO {
    private Long produceId;
    private String farmerName;
    private String categoryName;
    private Double quantity;
    private ProduceStatus status;
    private ProduceGrade grade;
    private Double qualityScore;
    private String inspectorName;
}
