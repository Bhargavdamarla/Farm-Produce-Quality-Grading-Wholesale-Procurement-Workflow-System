package com.guvi.procurement;

import com.guvi.procurement.models.ProduceCategory;
import com.guvi.procurement.models.Role;
import com.guvi.procurement.models.User;
import com.guvi.procurement.repositories.ProduceCategoryRepository;
import com.guvi.procurement.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProduceCategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User farmer = new User();
            farmer.setName("John Farmer");
            farmer.setEmail("farmer@example.com");
            farmer.setRole(Role.FARMER);

            User inspector = new User();
            inspector.setName("Alice Inspector");
            inspector.setEmail("inspector@example.com");
            inspector.setRole(Role.INSPECTOR);

            User officer = new User();
            officer.setName("Bob Officer");
            officer.setEmail("officer@example.com");
            officer.setRole(Role.PROCUREMENT_OFFICER);

            // User IDs are predictable: 1, 2, 3
            userRepository.saveAll(List.of(farmer, inspector, officer));
        }

        if (categoryRepository.count() == 0) {
            ProduceCategory grains = new ProduceCategory();
            grains.setName("Grains");

            ProduceCategory vegetables = new ProduceCategory();
            vegetables.setName("Vegetables");

            ProduceCategory fruits = new ProduceCategory();
            fruits.setName("Fruits");

            // Category IDs are predictable: 1, 2, 3
            categoryRepository.saveAll(List.of(grains, vegetables, fruits));
        }
    }
}
