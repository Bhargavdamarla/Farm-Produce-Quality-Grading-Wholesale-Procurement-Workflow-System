package com.guvi.procurement.services;

import com.guvi.procurement.dto.ProcurementRequest;
import com.guvi.procurement.models.*;
import com.guvi.procurement.repositories.FarmProduceRepository;
import com.guvi.procurement.repositories.ProcurementOrderRepository;
import com.guvi.procurement.repositories.ProduceInventoryRepository;
import com.guvi.procurement.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ProcurementService {
    @Autowired
    private ProcurementOrderRepository orderRepository;
    @Autowired
    private FarmProduceRepository produceRepository;
    @Autowired
    private ProduceInventoryRepository inventoryRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ProcurementOrder procureProduce(ProcurementRequest request) {
        FarmProduce produce = produceRepository.findById(request.getProduceId())
                .orElseThrow(() -> new RuntimeException("Produce not found"));

        if (produce.getStatus() != ProduceStatus.ACCEPTED) {
            throw new RuntimeException("Only ACCEPTED produce can be procured");
        }

        User officer = userRepository.findById(request.getOfficerId())
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        // Create Order
        ProcurementOrder order = new ProcurementOrder();
        order.setProduce(produce);
        order.setOfficer(officer);
        order.setQuantity(produce.getQuantity());
        order.setUnitPrice(request.getPriceAgreed());
        order.setTotalAmount(produce.getQuantity() * request.getPriceAgreed());
        
        produce.setStatus(ProduceStatus.PROCURED);
        produceRepository.save(produce);

        // Update Inventory
        Optional<ProduceInventory> invOpt = inventoryRepository.findByCategory(produce.getCategory());
        ProduceInventory inventory = invOpt.orElseGet(() -> {
            ProduceInventory newInv = new ProduceInventory();
            newInv.setCategory(produce.getCategory());
            newInv.setTotalQuantity(0.0);
            return newInv;
        });
        
        inventory.setTotalQuantity(inventory.getTotalQuantity() + produce.getQuantity());
        inventoryRepository.save(inventory);

        return orderRepository.save(order);
    }
}
