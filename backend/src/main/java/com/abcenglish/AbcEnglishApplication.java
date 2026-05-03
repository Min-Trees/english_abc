package com.abcenglish;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AbcEnglishApplication {
    public static void main(String[] args) {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();
            
            dotenv.entries().forEach(e -> 
                System.setProperty(e.getKey(), e.getValue())
            );
        } catch (Exception e) {
            System.out.println("Note: .env file not found, using system environment variables");
        }
        
        SpringApplication.run(AbcEnglishApplication.class, args);
    }
}
