package com.guvi.procurement.services;

import com.guvi.procurement.dto.SubmitProduceRequest;
import com.guvi.procurement.models.*;
import com.guvi.procurement.repositories.FarmProduceRepository;
import com.guvi.procurement.repositories.ProduceCategoryRepository;
import com.guvi.procurement.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProduceService {
    @Autowired
    private FarmProduceRepository produceRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProduceCategoryRepository categoryRepository;

    public FarmProduce submitProduce(SubmitProduceRequest request) {
        User farmer = userRepository.findById(request.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        
        ProduceCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        FarmProduce produce = new FarmProduce();
        produce.setFarmer(farmer);
        produce.setCategory(category);
        produce.setQuantity(request.getQuantity());
        produce.setStatus(ProduceStatus.PENDING_INSPECTION);

        return produceRepository.save(produce);
    }

    public List<FarmProduce> getPendingInspection() {
        return produceRepository.findByStatus(ProduceStatus.PENDING_INSPECTION);
    }
}
