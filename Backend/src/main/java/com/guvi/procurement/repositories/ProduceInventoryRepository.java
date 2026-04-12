package com.guvi.procurement.repositories;

import com.guvi.procurement.models.ProduceInventory;
import com.guvi.procurement.models.ProduceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProduceInventoryRepository extends JpaRepository<ProduceInventory, Long> {
    Optional<ProduceInventory> findByCategory(ProduceCategory category);
}
