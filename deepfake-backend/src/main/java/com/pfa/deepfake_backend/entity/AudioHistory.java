package com.pfa.deepfake_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audio_history")
public class AudioHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    
    private Double score;
    
    private String prediction;

    @Column(name = "analysis_date")
    private LocalDateTime analysisDate;

    // Constructeur par défaut requis par JPA
    public AudioHistory() {}

    public AudioHistory(String filename, Double score, String prediction) {
        this.filename = filename;
        this.score = score;
        this.prediction = prediction;
        this.analysisDate = LocalDateTime.now(); // Date automatique
    }

    // --- Génère les Getters et Setters ici (ou utilise @Data de Lombok) ---
    public Long getId() { return id; }
    public String getFilename() { return filename; }
    public Double getScore() { return score; }
    public String getPrediction() { return prediction; }
    public LocalDateTime getAnalysisDate() { return analysisDate; }
}