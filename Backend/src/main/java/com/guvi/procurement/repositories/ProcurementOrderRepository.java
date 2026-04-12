package com.guvi.procurement.repositories;

import com.guvi.procurement.models.ProcurementOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcurementOrderRepository extends JpaRepository<ProcurementOrder, Long> {
}
