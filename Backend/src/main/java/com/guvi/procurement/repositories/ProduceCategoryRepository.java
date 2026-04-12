package com.guvi.procurement.repositories;

import com.guvi.procurement.models.ProduceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProduceCategoryRepository extends JpaRepository<ProduceCategory, Long> {
}
