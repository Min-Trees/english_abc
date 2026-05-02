package com.abcenglish.service;

import com.abcenglish.dto.AIChatRequest;
import com.abcenglish.dto.AIChatResponse;
import com.abcenglish.entity.AIChatHistory;
import com.abcenglish.repository.AIChatHistoryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
public class AIService {

    private final AIChatHistoryRepository chatHistoryRepository;

    @Value("${groq.api.key:your_groq_api_key_here}")
    private String groqApiKey;

    @Value("${groq.api.model:llama3-8b-8192}")
    private String groqModel;

    private final WebClient.Builder webClientBuilder;

    public AIService(AIChatHistoryRepository chatHistoryRepository, WebClient.Builder webClientBuilder) {
        this.chatHistoryRepository = chatHistoryRepository;
        this.webClientBuilder = webClientBuilder;
    }

    public String chat(String userMessage, Long userId) {
        try {
            if (groqApiKey == null || groqApiKey.isEmpty() ||
                groqApiKey.equals("your_groq_api_key_here")) {
                return "AI Tutor chua duoc cau hinh. Vui long dat GROQ_API_KEY trong docker-compose.yml hoac .env file. " +
                       "Ban co the lay API key mien phi tai https://console.groq.com/keys";
            }

            WebClient webClient = webClientBuilder.baseUrl("https://api.groq.com")
                    .defaultHeader("Authorization", "Bearer " + groqApiKey)
                    .build();

            List<Map<String, String>> messages = new ArrayList<Map<String, String>>();
            messages.add(createMap("role", "system", "content",
                    "You are an AI English tutor. Help users learn English by explaining grammar, vocabulary, and conversation. " +
                    "Be friendly, patient, and encouraging. Respond in the same language as the user, but use English examples. " +
                    "Keep responses concise and educational."));

            if (userId != null) {
                List<AIChatHistory> history = chatHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
                Collections.reverse(history);
                int count = 0;
                for (AIChatHistory chat : history) {
                    if (count >= 4) break;
                    messages.add(createMap("role", "user", "content", chat.getUserMessage()));
                    String resp = chat.getAiResponse();
                    messages.add(createMap("role", "assistant", "content", resp != null ? resp : ""));
                    count++;
                }
            }

            messages.add(createMap("role", "user", "content", userMessage));

            Map<String, Object> requestBody = new HashMap<String, Object>();
            requestBody.put("model", groqModel);
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 1024);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = (Map<String, Object>) webClient.post()
                    .uri("/openai/v1/chat/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("choices")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> choice = choices.get(0);
                    @SuppressWarnings("unchecked")
                    Map<String, Object> message = (Map<String, Object>) choice.get("message");
                    String aiResponse = (String) message.get("content");

                    AIChatHistory history = new AIChatHistory();
                    history.setUserId(userId);
                    history.setUserMessage(userMessage);
                    history.setAiResponse(aiResponse);
                    chatHistoryRepository.save(history);

                    return aiResponse;
                }
            }
            return "Xin loi, toi khong the tra loi luc nay.";
        } catch (Exception e) {
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.contains("401")) {
                return "Loi xac thuc AI. Vui long kiem tra GROQ_API_KEY trong cau hinh.";
            }
            return "Da xay ra loi: " + e.getMessage();
        }
    }

    private Map<String, String> createMap(String k1, String v1, String k2, String v2) {
        Map<String, String> m = new HashMap<String, String>();
        m.put(k1, v1);
        m.put(k2, v2);
        return m;
    }
}
