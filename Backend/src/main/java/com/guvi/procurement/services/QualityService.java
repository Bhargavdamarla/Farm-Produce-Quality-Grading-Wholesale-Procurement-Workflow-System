package com.guvi.procurement.services;

import com.guvi.procurement.dto.GradeSubmitRequest;
import com.guvi.procurement.models.*;
import com.guvi.procurement.repositories.FarmProduceRepository;
import com.guvi.procurement.repositories.QualityInspectionRepository;
import com.guvi.procurement.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QualityService {
    @Autowired
    private QualityInspectionRepository inspectionRepository;
    @Autowired
    private FarmProduceRepository produceRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public QualityInspection inspectProduce(GradeSubmitRequest request) {
        FarmProduce produce = produceRepository.findById(request.getProduceId())
                .orElseThrow(() -> new RuntimeException("Produce not found"));
        
        if (produce.getStatus() != ProduceStatus.PENDING_INSPECTION) {
            throw new RuntimeException("Produce is not pending inspection");
        }

        User inspector = userRepository.findById(request.getInspectorId())
                .orElseThrow(() -> new RuntimeException("Inspector not found"));

        QualityInspection inspection = new QualityInspection();
        inspection.setProduce(produce);
        inspection.setInspector(inspector);
        inspection.setQualityScore(request.getQualityScore());
        inspection.setRemarks(request.getRemarks());

        // Auto Grade based on score
        if (request.getQualityScore() >= 80) {
            inspection.setGrade(ProduceGrade.A);
            produce.setStatus(ProduceStatus.ACCEPTED);
        } else if (request.getQualityScore() >= 60) {
            inspection.setGrade(ProduceGrade.B);
            produce.setStatus(ProduceStatus.ACCEPTED);
        } else if (request.getQualityScore() >= 40) {
            inspection.setGrade(ProduceGrade.C);
            produce.setStatus(ProduceStatus.ACCEPTED);
        } else {
            inspection.setGrade(ProduceGrade.REJECTED);
            produce.setStatus(ProduceStatus.REJECTED);
        }

        produceRepository.save(produce);
        return inspectionRepository.save(inspection);
    }
}
