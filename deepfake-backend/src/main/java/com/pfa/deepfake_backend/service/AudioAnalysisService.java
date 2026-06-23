package com.pfa.deepfake_backend.service;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class AudioAnalysisService {

    // L'URL de ton microservice Python
    private final String FASTAPI_URL = "http://localhost:8000/predict";

    public String analyzeAudioWithAI(MultipartFile file) throws IOException {
        RestTemplate restTemplate = new RestTemplate();
        
        // 1. Préparer les Headers pour envoyer un fichier (Multipart)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // 2. Transformer le fichier reçu en ressource lisible par Spring
        ByteArrayResource fileAsResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename(); // Conserve le nom (ex: audio.flac)
            }
        };

        // 3. Construire le corps de la requête
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileAsResource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // 4. Envoyer la requête POST au Python et récupérer le JSON
        ResponseEntity<String> response = restTemplate.postForEntity(FASTAPI_URL, requestEntity, String.class);
        
        return response.getBody();
    }
}