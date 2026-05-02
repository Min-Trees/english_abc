package com.abcenglish.service;

import com.abcenglish.dto.VocabDTO;
import com.abcenglish.entity.User;
import com.abcenglish.entity.VocabularyWord;
import com.abcenglish.repository.VocabularyRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VocabularyService {

    private final VocabularyRepository vocabRepository;

    public VocabularyService(VocabularyRepository vocabRepository) {
        this.vocabRepository = vocabRepository;
    }

    public List<VocabDTO> getAllVocabulary() {
        List<VocabularyWord> words = vocabRepository.findAll();
        List<VocabDTO> result = new ArrayList<VocabDTO>();
        for (VocabularyWord w : words) {
            result.add(VocabDTO.fromEntity(w));
        }
        return result;
    }

    public List<VocabDTO> getVocabularyByLevel(String level) {
        try {
            User.Level lvl = User.Level.valueOf(level.toUpperCase());
            List<VocabularyWord> words = vocabRepository.findByLevel(lvl);
            List<VocabDTO> result = new ArrayList<VocabDTO>();
            for (VocabularyWord w : words) {
                result.add(VocabDTO.fromEntity(w));
            }
            return result;
        } catch (Exception e) {
            return new ArrayList<VocabDTO>();
        }
    }

    public List<VocabDTO> getVocabularyByCategory(String category) {
        List<VocabularyWord> words = vocabRepository.findByCategory(category);
        List<VocabDTO> result = new ArrayList<VocabDTO>();
        for (VocabularyWord w : words) {
            result.add(VocabDTO.fromEntity(w));
        }
        return result;
    }

    public VocabDTO addVocabulary(VocabDTO dto) {
        VocabularyWord word = new VocabularyWord();
        word.setWord(dto.getWord());
        if (dto.getPronunciation() != null) word.setPronunciation(dto.getPronunciation());
        if (dto.getTranslation() != null) word.setTranslation(dto.getTranslation());
        if (dto.getDefinition() != null) word.setDefinition(dto.getDefinition());
        if (dto.getExample() != null) word.setExample(dto.getExample());
        if (dto.getExampleTranslation() != null) word.setExampleTranslation(dto.getExampleTranslation());
        if (dto.getLevel() != null) {
            try { word.setLevel(User.Level.valueOf(dto.getLevel())); } catch (Exception ignored) {}
        }
        if (dto.getCategory() != null) word.setCategory(dto.getCategory());
        if (dto.getAudioUrl() != null) word.setAudioUrl(dto.getAudioUrl());
        if (dto.getImageUrl() != null) word.setImageUrl(dto.getImageUrl());

        VocabularyWord saved = vocabRepository.save(word);
        return VocabDTO.fromEntity(saved);
    }

    public VocabDTO updateVocabulary(Long id, VocabDTO dto) {
        Optional<VocabularyWord> opt = vocabRepository.findById(id);
        if (opt.isEmpty()) return null;

        VocabularyWord word = opt.get();
        if (dto.getWord() != null) word.setWord(dto.getWord());
        if (dto.getPronunciation() != null) word.setPronunciation(dto.getPronunciation());
        if (dto.getTranslation() != null) word.setTranslation(dto.getTranslation());
        if (dto.getDefinition() != null) word.setDefinition(dto.getDefinition());
        if (dto.getExample() != null) word.setExample(dto.getExample());
        if (dto.getExampleTranslation() != null) word.setExampleTranslation(dto.getExampleTranslation());
        if (dto.getLevel() != null) {
            try { word.setLevel(User.Level.valueOf(dto.getLevel())); } catch (Exception ignored) {}
        }
        if (dto.getCategory() != null) word.setCategory(dto.getCategory());

        VocabularyWord saved = vocabRepository.save(word);
        return VocabDTO.fromEntity(saved);
    }

    public void deleteVocabulary(Long id) {
        vocabRepository.deleteById(id);
    }
}
