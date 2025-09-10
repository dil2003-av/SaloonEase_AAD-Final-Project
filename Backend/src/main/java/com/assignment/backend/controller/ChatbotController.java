//package com.assignment.backend.controller;
//
//import com.assignment.backend.service.ChatbotService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/chatbot")
//@CrossOrigin(origins = "*")
//public class ChatbotController {
//
//    private final ChatbotService chatbotService;
//
//    public ChatbotController(ChatbotService chatbotService) {
//        this.chatbotService = chatbotService;
//    }
//
//    @PostMapping("/ask")
//    public ResponseEntity<Map<String, String>> askChatbot(@RequestBody Map<String, String> payload) {
//        String message = payload.get("message");
//        if (message == null || message.isEmpty()) {
//            return ResponseEntity.badRequest().body(Map.of("error", "Message is required"));
//        }
//
//        String reply;
//        try {
//            reply = chatbotService.askChatbot(message);
//        } catch (Exception e) {
//            e.printStackTrace();
//            reply = "Sorry, the chatbot is busy. Please try again later.";
//        }
//
//        return ResponseEntity.ok(Map.of("reply", reply));
//    }
//}
//
//
