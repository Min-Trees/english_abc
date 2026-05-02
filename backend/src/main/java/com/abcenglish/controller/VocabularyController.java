package com.abcenglish.controller;

import com.abcenglish.dto.VocabDTO;
import com.abcenglish.service.VocabularyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocabulary")
@CrossOrigin(origins = "*")
public class VocabularyController {

    private final VocabularyService vocabularyService;

    public VocabularyController(VocabularyService vocabularyService) {
        this.vocabularyService = vocabularyService;
    }

    @GetMapping
    public ResponseEntity<List<VocabDTO>> getAllVocabulary(
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String category
    ) {
        if (level != null) {
            return ResponseEntity.ok(vocabularyService.getVocabularyByLevel(level));
        }
        if (category != null) {
            return ResponseEntity.ok(vocabularyService.getVocabularyByCategory(category));
        }
        return ResponseEntity.ok(vocabularyService.getAllVocabulary());
    }

    @PostMapping
    public ResponseEntity<VocabDTO> addVocabulary(@RequestBody VocabDTO dto) {
        return ResponseEntity.ok(vocabularyService.addVocabulary(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VocabDTO> updateVocabulary(@PathVariable Long id, @RequestBody VocabDTO dto) {
        VocabDTO updated = vocabularyService.updateVocabulary(id, dto);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVocabulary(@PathVariable Long id) {
        vocabularyService.deleteVocabulary(id);
        return ResponseEntity.noContent().build();
    }
}
