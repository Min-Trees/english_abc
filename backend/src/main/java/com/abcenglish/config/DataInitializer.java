package com.abcenglish.config;

import com.abcenglish.entity.Course;
import com.abcenglish.entity.User;
import com.abcenglish.entity.VocabularyWord;
import com.abcenglish.repository.CourseRepository;
import com.abcenglish.repository.UserRepository;
import com.abcenglish.repository.VocabularyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            CourseRepository courseRepository,
            VocabularyRepository vocabularyRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User("admin", "admin@abc.com", passwordEncoder.encode("admin123"));
                admin.setFullName("Administrator");
                admin.setRole(User.Role.ADMIN);
                admin.setLevel(User.Level.C2);
                admin.setAgeGroup(User.AgeGroup.ADULT);
                admin.setEnabled(true);
                userRepository.save(admin);

                User teacher = new User("teacher", "teacher@abc.com", passwordEncoder.encode("teacher123"));
                teacher.setFullName("John Smith");
                teacher.setRole(User.Role.TEACHER);
                teacher.setLevel(User.Level.C2);
                teacher.setAgeGroup(User.AgeGroup.ADULT);
                teacher.setEnabled(true);
                userRepository.save(teacher);

                User student = new User("student", "student@abc.com", passwordEncoder.encode("student123"));
                student.setFullName("Student User");
                student.setRole(User.Role.STUDENT);
                student.setLevel(User.Level.A1);
                student.setAgeGroup(User.AgeGroup.TEEN);
                student.setEnabled(true);
                userRepository.save(student);
            }

            if (courseRepository.count() == 0) {
                Course c1 = new Course();
                c1.setTitle("English for Beginners");
                c1.setDescription("Learn the basics of English language including greetings, numbers, colors, and everyday vocabulary.");
                c1.setLevel(User.Level.A1);
                c1.setInstructor("John Smith");
                c1.setTotalLessons(10);
                c1.setRating(4.5);
                c1.setCategory("beginner");
                c1.setFeatured(true);
                c1.setEnrolledCount(150);
                courseRepository.save(c1);

                Course c2 = new Course();
                c2.setTitle("Conversational English");
                c2.setDescription("Improve your speaking skills with practical conversations for daily life.");
                c2.setLevel(User.Level.A2);
                c2.setInstructor("John Smith");
                c2.setTotalLessons(15);
                c2.setRating(4.7);
                c2.setCategory("conversation");
                c2.setFeatured(true);
                c2.setEnrolledCount(120);
                courseRepository.save(c2);

                Course c3 = new Course();
                c3.setTitle("Business English");
                c3.setDescription("Master professional English for the workplace, meetings, and negotiations.");
                c3.setLevel(User.Level.B1);
                c3.setInstructor("John Smith");
                c3.setTotalLessons(20);
                c3.setRating(4.8);
                c3.setCategory("business");
                c3.setFeatured(false);
                c3.setEnrolledCount(80);
                courseRepository.save(c3);

                Course c4 = new Course();
                c4.setTitle("Grammar Master");
                c4.setDescription("Deep dive into English grammar rules with examples and exercises.");
                c4.setLevel(User.Level.B2);
                c4.setInstructor("John Smith");
                c4.setTotalLessons(25);
                c4.setRating(4.6);
                c4.setCategory("grammar");
                c4.setFeatured(false);
                c4.setEnrolledCount(95);
                courseRepository.save(c4);
            }

            if (vocabularyRepository.count() == 0) {
                VocabularyWord[] words = {
                    mkWord("Hello", "/həˈloʊ/", "Xin chao", "A greeting used when meeting someone",
                           "Hello, how are you?", "Xin chao, ban khoe khong?", User.Level.A1, "greetings"),
                    mkWord("Goodbye", "/ɡʊdˈbaɪ/", "Tam biet", "Said when leaving",
                           "Goodbye, see you tomorrow!", "Tam biet, hen gap lai ngay mai!", User.Level.A1, "greetings"),
                    mkWord("Thank you", "/θæŋk juː/", "Cam on", "Expression of gratitude",
                           "Thank you for your help.", "Cam on ban da giup do.", User.Level.A1, "greetings"),
                    mkWord("Please", "/pliːz/", "Lam on / Xin vui long", "Used to make polite requests",
                           "Please pass me the salt.", "Lam on dua muoi cho toi.", User.Level.A1, "politeness"),
                    mkWord("Sorry", "/ˈsɒri/", "Xin loi", "Expression of apology",
                           "I'm sorry for being late.", "Xin loi vi den muon.", User.Level.A1, "politeness"),
                    mkWord("Water", "/ˈwɔːtər/", "Nuoc", "A clear liquid for drinking",
                           "I would like a glass of water.", "Toi muon mot ly nuoc.", User.Level.A1, "food"),
                    mkWord("Book", "/bʊk/", "Sach", "A written or printed work",
                           "I am reading a book.", "Toi dang doc mot cuon sach.", User.Level.A1, "objects"),
                    mkWord("House", "/haʊs/", "Nha", "A building for living",
                           "My house has three rooms.", "Nha toi co ba phong.", User.Level.A1, "places"),
                    mkWord("Beautiful", "/ˈbjuːtɪfəl/", "Dep", "Pleasing to look at",
                           "The sunset is beautiful.", "Hoang hon that dep.", User.Level.A1, "adjectives"),
                    mkWord("Happy", "/ˈhæpi/", "Vui/Hanh phuc", "Feeling pleasure or joy",
                           "I am happy today.", "Hom nay toi vui.", User.Level.A1, "adjectives"),
                };
                for (VocabularyWord w : words) {
                    vocabularyRepository.save(w);
                }
            }
        };
    }

    private VocabularyWord mkWord(String word, String pron, String trans, String def,
                                  String ex, String exTrans, User.Level lvl, String cat) {
        VocabularyWord w = new VocabularyWord();
        w.setWord(word);
        w.setPronunciation(pron);
        w.setTranslation(trans);
        w.setDefinition(def);
        w.setExample(ex);
        w.setExampleTranslation(exTrans);
        w.setLevel(lvl);
        w.setCategory(cat);
        return w;
    }
}
