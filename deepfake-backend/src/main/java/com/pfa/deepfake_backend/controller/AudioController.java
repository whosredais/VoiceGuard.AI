package com.pfa.deepfake_backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pfa.deepfake_backend.entity.AudioHistory;
import com.pfa.deepfake_backend.repository.AudioHistoryRepository;
import com.pfa.deepfake_backend.service.AudioAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/audio")
@CrossOrigin(origins = "*") // Prêt pour Vite.js
public class AudioController {

    @Autowired
    private AudioAnalysisService audioService;

    @Autowired
    private AudioHistoryRepository historyRepository;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeAudio(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Le fichier est vide.\"}");
        }

        try {
            // 1. Appel du microservice IA (Python)
            String aiResultJson = audioService.analyzeAudioWithAI(file);
            
            // 2. Traitement du JSON (Extraction des données)
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResultJson);
            
            String filename = rootNode.path("filename").asText();
            Double score = rootNode.path("score").asDouble();
            String prediction = rootNode.path("prediction").asText();

            // 3. Sauvegarde dans MySQL
            AudioHistory historyRecord = new AudioHistory(filename, score, prediction);
            historyRepository.save(historyRecord);

            // 4. Renvoi du résultat intact à l'interface graphique
            return ResponseEntity.ok(aiResultJson);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Erreur système: " + e.getMessage() + "\"}");
        }
    }
}