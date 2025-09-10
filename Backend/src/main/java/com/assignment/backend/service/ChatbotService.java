//package com.assignment.backend.service;
//
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.HttpClientErrorException;
//
//@Service
//public class ChatbotService {
//
//    private final OpenAiService openAiService;
//
//    public ChatbotService(OpenAiService openAiService) {
//        this.openAiService = openAiService;
//    }
//
//    public String askChatbot(String message) {
//        try {
//            return openAiService.getChatbotResponse(message);
//        } catch (HttpClientErrorException.TooManyRequests e) {
//            // Handle 429 quota exceeded
//            return "Sorry, the chatbot is busy due to high traffic. Please try again later.";
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "Sorry, the chatbot is busy. Please try again later.";
//        }
//    }
//}
