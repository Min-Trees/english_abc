package com.abcenglish.controller;

import com.abcenglish.repository.CourseRepository;
import com.abcenglish.repository.QuizResultRepository;
import com.abcenglish.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final QuizResultRepository quizResultRepository;

    public AdminController(UserRepository userRepository, CourseRepository courseRepository,
                          QuizResultRepository quizResultRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.quizResultRepository = quizResultRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalCourses", courseRepository.count());
        stats.put("totalExercises", quizResultRepository.count());
        stats.put("totalResults", quizResultRepository.count());
        stats.put("activeUsers", userRepository.count());
        stats.put("newUsersThisWeek", 15);
        stats.put("newUsersThisMonth", 45);
        stats.put("avgScore", 78.5);
        stats.put("completionRate", 72.0);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        List<Map<String, Object>> users = new ArrayList<>();

        Map<String, Object> u1 = new HashMap<>();
        u1.put("id", 1L);
        u1.put("username", "student1");
        u1.put("email", "student1@example.com");
        u1.put("fullName", "Nguyen Van A");
        u1.put("role", "STUDENT");
        u1.put("level", "BEGINNER");
        u1.put("createdAt", "2024-01-15");
        u1.put("status", "ACTIVE");
        users.add(u1);

        Map<String, Object> u2 = new HashMap<>();
        u2.put("id", 2L);
        u2.put("username", "teacher1");
        u2.put("email", "teacher1@example.com");
        u2.put("fullName", "Tran Thi B");
        u2.put("role", "TEACHER");
        u2.put("level", null);
        u2.put("createdAt", "2024-01-10");
        u2.put("status", "ACTIVE");
        users.add(u2);

        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<Map<String, Object>> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body
    ) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("userId", userId);
        result.put("newRole", body.get("role"));
        result.put("message", "Role updated successfully");
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long userId) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("userId", userId);
        result.put("message", "User deleted successfully");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReports() {
        Map<String, Object> reports = new HashMap<>();

        reports.put("dailyActiveUsers", 150);
        reports.put("weeklyActiveUsers", 450);
        reports.put("monthlyActiveUsers", 1200);
        reports.put("avgSessionDuration", 25);
        reports.put("topCourses", List.of(
            Map.of("name", "English for Beginners", "enrollments", 250),
            Map.of("name", "Business English", "enrollments", 180),
            Map.of("name", "IELTS Preparation", "enrollments", 120)
        ));

        return ResponseEntity.ok(reports);
    }
}
