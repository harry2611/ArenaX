package com.arenax;

import com.arenax.service.SeedDataService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ArenaXApplication {

    public static void main(String[] args) {
        SpringApplication.run(ArenaXApplication.class, args);
    }

    @Bean
    CommandLineRunner seedArenaX(SeedDataService seedDataService) {
        return args -> seedDataService.seed();
    }
}

