import os
import torch
import librosa
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

# 🔴 ÉTAPE CLÉ : Importer l'architecture du modèle depuis le code source des chercheurs
# Note: Ce nom d'import dépend de comment ils ont nommé leur fichier. 
# Si tu regardes le fichier main_SSL_LA.py, tu verras comment ils importent le modèle.
# Souvent c'est quelque chose comme :
import argparse
from model import Model # <-- Vérifie bien que ce fichier 'model.py' existe dans le dossier !

# --- Patch de sécurité PyTorch ---
_original_load = torch.load
def _patched_load(*args, **kwargs):
    kwargs['weights_only'] = False
    return _original_load(*args, **kwargs)
torch.load = _patched_load

app = FastAPI(title="Deepfake Audio Detection API", version="1.0")

model = None
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

@app.on_event("startup")
def load_model():
    global model
    print(f"⏳ Démarrage du serveur... Chargement du modèle sur {DEVICE}...")
    
    model_path = "LA_model.pth" 
    
    if not os.path.exists(model_path):
        print(f"❌ ERREUR : Le fichier {model_path} est introuvable !")
        return

    try:
        # 1. On prépare la configuration "vide" de l'architecture (comme dans main_SSL_LA.py)
        # On simule les arguments que le script de base attendait
        parser = argparse.ArgumentParser()
        parser.add_argument('--algo', type=int, default=5) # L'algo utilisé pour 2019/2021
        parser.add_argument('--loss', type=str, default='WCE')
        parser.add_argument('--lr', type=float, default=0.000001)
        parser.add_argument('--weight_decay', type=float, default=0.0001)
        args, _ = parser.parse_known_args()

        # 2. On crée le "cerveau" vide
        model = Model(args, DEVICE)
        
        # 3. On injecte les "souvenirs" (le state_dict / les poids) dans le cerveau
        state_dict = torch.load(model_path, map_location=DEVICE)
        
        # Parfois, les chercheurs stockent le state_dict dans une clé spécifique (ex: 'model_state_dict')
        if isinstance(state_dict, dict) and 'model_state_dict' in state_dict:
             model.load_state_dict(state_dict['model_state_dict'])
        else:
             # S'ils l'ont sauvegardé directement
             model.load_state_dict(state_dict)

        model = model.to(DEVICE)
        model.eval() # Maintenant ça marchera, car 'model' est une vraie classe PyTorch !
        print("✅ Modèle chargé avec succès et prêt pour l'inférence !")
        
    except Exception as e:
        print(f"❌ Erreur lors du chargement du modèle : {e}")

@app.post("/predict")
async def predict_audio(file: UploadFile = File(...)):
    if not file.filename.endswith(('.flac', '.wav', '.mp3')):
        return JSONResponse(status_code=400, content={"error": "Format non supporté."})

    temp_file_path = f"temp_{file.filename}"
    
    try:
        with open(temp_file_path, "wb") as buffer:
            buffer.write(await file.read())
            
        print(f"🎵 Analyse en cours pour : {file.filename}")
        audio, sr = librosa.load(temp_file_path, sr=16000)
        
        # Pad ou Truncate l'audio pour qu'il ait la taille exacte attendue (souvent 64600 frames = ~4s)
        target_length = 64600 
        if len(audio) > target_length:
            audio = audio[:target_length]
        else:
            audio = np.pad(audio, (0, max(0, target_length - len(audio))), "constant")

        audio_tensor = torch.tensor(audio, dtype=torch.float32).unsqueeze(0).to(DEVICE)
        
        with torch.no_grad():
            output = model(audio_tensor)
            
            # Extraction du logit. Dans cette architecture précise, output est souvent un tuple (features, score)
            if isinstance(output, tuple):
                 score = output[1][0][1].item() 
            else:
                 score = output[0][1].item()

        is_spoof = bool(score < 0) 
        
        print(f"📊 Résultat : {score:.4f} -> {'SPOOF' if is_spoof else 'BONAFIDE'}")
        
        return {
            "filename": file.filename,
            "score": score,
            "prediction": "SPOOF" if is_spoof else "BONAFIDE"
        }

    except Exception as e:
        print(f"❌ Erreur d'inférence : {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})
    
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@app.get("/")
def read_root():
    return {"status": "L'API IA est en ligne et fonctionnelle."}