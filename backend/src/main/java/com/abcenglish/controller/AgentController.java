package com.abcenglish.controller;

import com.abcenglish.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/agent")
@CrossOrigin(origins = "*")
public class AgentController {

    private final AIService aiService;

    public AgentController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        try {
            String message = (String) request.get("message");
            Long userId = request.get("userId") != null ? ((Number) request.get("userId")).longValue() : null;

            String response = aiService.chat(message, userId);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("response", response);
            result.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.ok(error);
        }
    }

    @PostMapping("/score")
    public ResponseEntity<Map<String, Object>> scoreAnswer(@RequestBody Map<String, Object> request) {
        String answer = (String) request.get("answer");
        String question = (String) request.getOrDefault("question", "Describe your answer");

        Map<String, Object> result = new HashMap<>();
        result.put("score", 85);
        result.put("feedback", "Good job! Your answer is well-structured and demonstrates good understanding of the topic.");
        result.put("suggestions", List.of(
            "Try to use more varied vocabulary",
            "Work on connecting your ideas more smoothly",
            "Great use of grammar!"
        ));
        result.put("strengths", List.of(
            "Clear structure",
            "Good vocabulary usage"
        ));
        return ResponseEntity.ok(result);
    }

    @PostMapping("/generate-exercises")
    public ResponseEntity<Map<String, Object>> generateExercises(@RequestBody Map<String, Object> request) {
        String topic = (String) request.getOrDefault("topic", "General English");
        String level = (String) request.getOrDefault("level", "BEGINNER");

        Map<String, Object> result = new HashMap<>();
        result.put("exercises", List.of(
            Map.of(
                "id", 1,
                "type", "VOCAB_QUIZ",
                "question", "What does '" + topic + "' mean?",
                "options", List.of("Option A", "Option B", "Option C", "Option D"),
                "correctAnswer", 0
            ),
            Map.of(
                "id", 2,
                "type", "GRAMMAR",
                "question", "Complete the sentence with the correct form",
                "options", List.of("is", "are", "was", "were"),
                "correctAnswer", 1
            )
        ));
        result.put("topic", topic);
        result.put("level", level);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/guidance/{userId}")
    public ResponseEntity<Map<String, Object>> getGuidance(@PathVariable Long userId) {
        Map<String, Object> guidance = new HashMap<>();
        Map<String, Object> content = new HashMap<>();

        content.put("summary", "Bạn đang tiến bộ tốt! Hãy tập trung vào từ vựng và ngữ pháp để cải thiện điểm số.");
        content.put("recommendations", List.of(
            "Học 10 từ vựng mới mỗi ngày",
            "Luyện nghe 15 phút mỗi ngày",
            "Hoàn thành bài tập ngữ pháp"
        ));
        content.put("nextLesson", "Unit 5: Past Tense - Talking about past events");
        content.put("strengths", List.of("Listening skill is strong", "Good vocabulary retention"));
        content.put("areasToImprove", List.of("Speaking confidence", "Grammar accuracy"));

        guidance.put("userId", userId);
        guidance.put("content", content);
        guidance.put("generatedAt", System.currentTimeMillis());

        return ResponseEntity.ok(guidance);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getHistory(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "20") int limit
    ) {
        List<Map<String, Object>> history = new ArrayList<>();

        Map<String, Object> h1 = new HashMap<>();
        h1.put("id", 1L);
        h1.put("message", "Hello! How can I help you today?");
        h1.put("response", "I need help with English grammar.");
        h1.put("timestamp", System.currentTimeMillis() - 86400000);
        history.add(h1);

        return ResponseEntity.ok(history);
    }
}
