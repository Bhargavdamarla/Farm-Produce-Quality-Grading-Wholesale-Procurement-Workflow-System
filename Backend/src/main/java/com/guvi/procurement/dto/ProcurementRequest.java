package com.guvi.procurement.dto;

import lombok.Data;

@Data
public class ProcurementRequest {
    private Long produceId;
    private Long officerId;
    private Double priceAgreed;
}
