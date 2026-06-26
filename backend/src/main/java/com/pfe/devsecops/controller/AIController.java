package com.pfe.devsecops.controller;


import com.pfe.devsecops.dto.AIQuestionRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<String> askAI(@RequestBody AIQuestionRequest request) {
        String ragUrl = "http://rag-service.devsecops.svc.cluster.local:8000/ask";

        String response = restTemplate.postForObject(
                ragUrl,
                request,
                String.class
        );

        return ResponseEntity.ok(response);
    }
}