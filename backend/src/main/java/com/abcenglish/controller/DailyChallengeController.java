package com.abcenglish.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@RestController
@RequestMapping("/api/daily")
@CrossOrigin(origins = "*")
public class DailyChallengeController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTodayChallenge(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Map<String, Object> challenge = new HashMap<>();
        challenge.put("challengeId", UUID.randomUUID().toString());
        challenge.put("type", getChallengeTypeForDay());
        challenge.put("title", getChallengeTitle());
        challenge.put("description", getChallengeDescription());
        challenge.put("xpReward", 50);
        challenge.put("targetGoal", 10);
        challenge.put("progress", Map.of("current", 0, "completed", false));
        challenge.put("content", Map.of(
            "questions", getSampleQuestions()
        ));
        challenge.put("difficulty", "MEDIUM");
        challenge.put("available", true);
        return ResponseEntity.ok(challenge);
    }

    @GetMapping("/week")
    public ResponseEntity<List<Map<String, Object>>> getWeeklyProgress() {
        List<Map<String, Object>> weekProgress = new ArrayList<>();
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        for (int i = 0; i < 7; i++) {
            LocalDate day = monday.plusDays(i);
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", day.toString());
            dayData.put("dayOfWeek", day.getDayOfWeek().toString());
            dayData.put("challengeType", getChallengeTypeForDate(day));
            dayData.put("completed", day.isBefore(today) || day.isEqual(today));
            dayData.put("score", day.isBefore(today) || day.isEqual(today) ? 100 : 0);
            weekProgress.add(dayData);
        }
        return ResponseEntity.ok(weekProgress);
    }

    @PostMapping("/complete")
    public ResponseEntity<Map<String, Object>> completeChallenge(
            @RequestBody Map<String, Object> data,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("xpEarned", 50);
        result.put("streakUpdated", true);
        result.put("newStreak", 1);
        return ResponseEntity.ok(result);
    }

    private String getChallengeTypeForDay() {
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        return switch (today) {
            case MONDAY -> "VOCAB_QUIZ";
            case TUESDAY -> "LISTENING";
            case WEDNESDAY -> "GRAMMAR_SPRINT";
            case THURSDAY -> "SPEAKING_SHADOWING";
            case FRIDAY -> "READING_SPEED";
            case SATURDAY, SUNDAY -> "MIXED";
        };
    }

    private String getChallengeTypeForDate(LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();
        return switch (day) {
            case MONDAY -> "VOCAB_QUIZ";
            case TUESDAY -> "LISTENING";
            case WEDNESDAY -> "GRAMMAR_SPRINT";
            case THURSDAY -> "SPEAKING_SHADOWING";
            case FRIDAY -> "READING_SPEED";
            case SATURDAY, SUNDAY -> "MIXED";
        };
    }

    private String getChallengeTitle() {
        return switch (getChallengeTypeForDay()) {
            case "VOCAB_QUIZ" -> "Bài tập từ vựng";
            case "LISTENING" -> "Luyện nghe";
            case "GRAMMAR_SPRINT" -> "Ngữ pháp nhanh";
            case "SPEAKING_SHADOWING" -> "Shadowing Speaking";
            case "READING_SPEED" -> "Đọc nhanh";
            default -> "Thử thách hỗn hợp";
        };
    }

    private String getChallengeDescription() {
        return switch (getChallengeTypeForDay()) {
            case "VOCAB_QUIZ" -> "Hoàn thành quiz từ vựng hôm nay để nhận XP!";
            case "LISTENING" -> "Luyện kỹ năng nghe với các bài học thú vị.";
            case "GRAMMAR_SPRINT" -> "Kiểm tra ngữ pháp trong 5 phút!";
            case "SPEAKING_SHADOWING" -> "Luyện phát âm theo câu mẫu.";
            case "READING_SPEED" -> "Đọc và hiểu nhanh các đoạn văn.";
            default -> "Hoàn thành các thử thách khác nhau mỗi ngày!";
        };
    }

    private List<Map<String, String>> getSampleQuestions() {
        List<Map<String, String>> questions = new ArrayList<>();
        questions.add(Map.of("word", "Beautiful", "translation", "Đẹp"));
        questions.add(Map.of("word", "Happiness", "translation", "Hạnh phúc"));
        questions.add(Map.of("word", "Knowledge", "translation", "Kiến thức"));
        questions.add(Map.of("word", "Adventure", "translation", "Cuộc phiêu lưu"));
        questions.add(Map.of("word", "Remember", "translation", "Nhớ"));
        return questions;
    }
}
