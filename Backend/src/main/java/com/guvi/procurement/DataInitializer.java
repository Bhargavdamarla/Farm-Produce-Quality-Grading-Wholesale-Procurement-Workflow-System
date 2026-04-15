package com.guvi.procurement;

import com.guvi.procurement.models.ProduceCategory;
import com.guvi.procurement.models.Role;
import com.guvi.procurement.models.User;
import com.guvi.procurement.repositories.ProduceCategoryRepository;
import com.guvi.procurement.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProduceCategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Initialize users if table is empty
            if (userRepository.count() == 0) {
                User farmer = new User();
                farmer.setName("John Farmer");
                farmer.setEmail("farmer@example.com");
                farmer.setRole(Role.FARMER);

                User inspector = new User();
                inspector.setName("Alice Inspector");
                inspector.setEmail("inspector@example.com");
                inspector.setRole(Role.QUALITY_INSPECTOR);

                User officer = new User();
                officer.setName("Bob Officer");
                officer.setEmail("officer@example.com");
                officer.setRole(Role.PROCUREMENT_OFFICER);

                // User IDs are predictable: 1, 2, 3
                userRepository.saveAll(List.of(farmer, inspector, officer));
                logger.info("Initialized default users");
            }

            // Initialize categories if table is empty
            if (categoryRepository.count() == 0) {
                ProduceCategory grains = new ProduceCategory();
                grains.setName("Grains");

                ProduceCategory vegetables = new ProduceCategory();
                vegetables.setName("Vegetables");

                ProduceCategory fruits = new ProduceCategory();
                fruits.setName("Fruits");

                // Category IDs are predictable: 1, 2, 3
                categoryRepository.saveAll(List.of(grains, vegetables, fruits));
                logger.info("Initialized default categories");
            }
        } catch (Exception e) {
            logger.warn("Data initialization failed (non-critical): {}", e.getMessage());
            // Don't throw exception - app should still start even if data init fails
        }
    }
}
