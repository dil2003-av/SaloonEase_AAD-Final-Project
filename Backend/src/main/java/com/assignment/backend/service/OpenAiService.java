//package com.assignment.backend.service;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class OpenAiService {
//
//    @Value("${openai.api.key}")
//    private String apiKey;
//
//    private final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
//
//    public String getChatbotResponse(String userMessage) {
//        RestTemplate restTemplate = new RestTemplate();
//
//        // Prepare request payload
//        Map<String, Object> payload = Map.of(
//                "model", "gpt-3.5-turbo",
//                "messages", List.of(Map.of("role", "user", "content", userMessage)),
//                "max_tokens", 150
//        );
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.setBearerAuth(apiKey);
//
//        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
//
//        // Send request
//        ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_URL, request, Map.class);
//
//        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
//            Map body = response.getBody();
//            List choices = (List) body.get("choices");
//            if (choices != null && !choices.isEmpty()) {
//                Map firstChoice = (Map) choices.get(0);
//                Map message = (Map) firstChoice.get("message");
//                if (message != null) {
//                    Object content = message.get("content");
//                    return content != null ? content.toString() : "Sorry, I didn't understand that.";
//                }
//            }
//        }
//
//        return "Sorry, something went wrong!";
//    }
//}
