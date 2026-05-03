package com.abcenglish.controller;

import com.abcenglish.entity.QuizResult;
import com.abcenglish.repository.QuizResultRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "*")
public class ExerciseController {

    private final QuizResultRepository quizResultRepository;

    public ExerciseController(QuizResultRepository quizResultRepository) {
        this.quizResultRepository = quizResultRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllExercises(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String level
    ) {
        List<Map<String, Object>> exercises = generateSampleExercises();
        if (type != null) {
            exercises = exercises.stream()
                .filter(e -> type.equalsIgnoreCase((String) e.get("type")))
                .toList();
        }
        return ResponseEntity.ok(exercises);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getExerciseById(@PathVariable Long id) {
        Map<String, Object> exercise = new HashMap<>();
        exercise.put("id", id);
        exercise.put("title", "Bài tập số " + id);
        exercise.put("type", "VOCAB_QUIZ");
        exercise.put("level", "BEGINNER");
        exercise.put("duration", 15);
        exercise.put("questions", generateSampleQuestions());
        return ResponseEntity.ok(exercise);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Map<String, Object>> submitExercise(
            @PathVariable Long id,
            @RequestBody Map<String, Object> answers,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Map<String, Object> result = new HashMap<>();
        result.put("exerciseId", id);
        result.put("score", 85);
        result.put("correctAnswers", 17);
        result.put("totalQuestions", 20);
        result.put("xpEarned", 100);
        result.put("completedAt", LocalDateTime.now().toString());
        result.put("feedback", "Tốt lắm! Bạn đã làm rất tốt. Hãy tiếp tục cố gắng!");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/results")
    public ResponseEntity<List<Map<String, Object>>> getMyResults(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        List<Map<String, Object>> results = new ArrayList<>();

        Map<String, Object> r1 = new HashMap<>();
        r1.put("id", 1L);
        r1.put("skillType", "VOCAB_QUIZ");
        r1.put("score", 8.5);
        r1.put("completedAt", LocalDateTime.now().minusDays(1).toString());
        r1.put("exercise", Map.of("title", "Từ vựng Unit 1"));
        results.add(r1);

        Map<String, Object> r2 = new HashMap<>();
        r2.put("id", 2L);
        r2.put("skillType", "GRAMMAR");
        r2.put("score", 7.0);
        r2.put("completedAt", LocalDateTime.now().minusDays(3).toString());
        r2.put("exercise", Map.of("title", "Ngữ pháp cơ bản"));
        results.add(r2);

        Map<String, Object> r3 = new HashMap<>();
        r3.put("id", 3L);
        r3.put("skillType", "LISTENING");
        r3.put("score", 9.0);
        r3.put("completedAt", LocalDateTime.now().minusDays(5).toString());
        r3.put("exercise", Map.of("title", "Luyện nghe Unit 2"));
        results.add(r3);

        return ResponseEntity.ok(results);
    }

    private List<Map<String, Object>> generateSampleExercises() {
        List<Map<String, Object>> exercises = new ArrayList<>();

        exercises.add(Map.of(
            "id", 1,
            "title", "Từ vựng cơ bản",
            "type", "VOCAB_QUIZ",
            "level", "BEGINNER",
            "duration", 10,
            "questionsCount", 15
        ));

        exercises.add(Map.of(
            "id", 2,
            "title", "Ngữ pháp thì hiện tại",
            "type", "GRAMMAR",
            "level", "BEGINNER",
            "duration", 15,
            "questionsCount", 20
        ));

        exercises.add(Map.of(
            "id", 3,
            "title", "Luyện nghe A1",
            "type", "LISTENING",
            "level", "BEGINNER",
            "duration", 20,
            "questionsCount", 10
        ));

        return exercises;
    }

    private List<Map<String, Object>> generateSampleQuestions() {
        List<Map<String, Object>> questions = new ArrayList<>();

        questions.add(Map.of(
            "id", 1,
            "question", "What is the meaning of 'Beautiful'?",
            "options", List.of("Đẹp", "Xấu", "Lớn", "Nhỏ"),
            "correctAnswer", 0
        ));

        questions.add(Map.of(
            "id", 2,
            "question", "Choose the correct form: She ___ to school every day.",
            "options", List.of("go", "goes", "going", "went"),
            "correctAnswer", 1
        ));

        return questions;
    }
}
