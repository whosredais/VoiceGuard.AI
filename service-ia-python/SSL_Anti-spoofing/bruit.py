import librosa
import soundfile as sf
import numpy as np

# 1. Charger l'audio propre (Cas 1 ou 2)
audio_path = "voix humain.flac"
y, sr = librosa.load(audio_path, sr=16000)

# 2. Générer un bruit blanc aléatoire (simulation d'interférence SSI)
bruit = np.random.randn(len(y))

# 3. Mélanger l'audio avec le bruit (Facteur 0.005 à ajuster selon la force du bruit voulue)
y_bruite = y + 0.01 * bruit

# 4. Sauvegarder le nouveau fichier dégradé
sf.write("voix humain_bruité1.wav", y_bruite, sr)
print("Fichier dégradé généré avec succès !")
