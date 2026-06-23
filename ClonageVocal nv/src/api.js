// ============================================
// Service API – Connexion au Backend Spring Boot
// ============================================

const API_BASE_URL = '/api/v1';

/**
 * Envoie un fichier audio au backend Spring Boot pour analyse deepfake.
 * Le backend transmet ensuite le fichier au microservice IA Python (FastAPI).
 *
 * @param {File} audioFile - Le fichier audio à analyser (.wav, .flac, .mp3)
 * @returns {Promise<Object>} - Le résultat de l'analyse { filename, score, prediction }
 */
export async function analyzeAudio(audioFile) {
  const formData = new FormData();
  formData.append('file', audioFile);

  const response = await fetch(`${API_BASE_URL}/audio/analyze`, {
    method: 'POST',
    body: formData,
    // Ne PAS mettre Content-Type : le navigateur le gère automatiquement avec le boundary multipart
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = `Erreur serveur (${response.status})`;
    try {
      const errorJson = JSON.parse(errorBody);
      if (errorJson.error) {
        errorMessage = errorJson.error;
      }
    } catch {
      // Le body n'est pas du JSON, on garde le message générique
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}
