package com.guvi.procurement.controllers;

import com.guvi.procurement.models.QualityGrade;
import com.guvi.procurement.repositories.QualityGradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/grades")
public class GradeController {

    @Autowired
    private QualityGradeRepository gradeRepository;

    @GetMapping
    public ResponseEntity<List<QualityGrade>> getAllGrades() {
        return ResponseEntity.ok(gradeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<QualityGrade> createGrade(@RequestBody QualityGrade grade) {
        return ResponseEntity.ok(gradeRepository.save(grade));
    }
}
