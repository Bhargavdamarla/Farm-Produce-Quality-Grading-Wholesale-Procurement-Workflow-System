package com.guvi.procurement.dto;

import lombok.Data;

@Data
public class SubmitProduceRequest {
    private Long farmerId;
    private Long categoryId;
    private Double quantity;
}
