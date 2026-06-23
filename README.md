# VoiceGuard.AI - PFA Deepfake App

Ce dépôt contient le code source de l'application **VoiceGuard.AI**, une solution conçue pour l'analyse et la détection d'audios deepfake. L'architecture est divisée en trois composants principaux :

1. **Backend** (Java Spring Boot 3)
2. **Frontend** (React / Vite.js)
3. **Microservice IA** (Python / FastAPI)

---

## 📋 Prérequis

Pour faire tourner ce projet sur votre machine, vous aurez besoin de :
- **Java 17** (pour Spring Boot)
- **Node.js & npm** (pour React/Vite)
- **Python 3.10** (idéalement via Conda)
- **MySQL Server** (XAMPP, WAMP ou service local)

---

## 🚀 Comment lancer le projet en local

### 1. Démarrer la Base de Données (MySQL)
Avant de lancer les services, assurez-vous que votre serveur MySQL est en cours d'exécution.
- Si vous utilisez **XAMPP** ou **WAMP**, démarrez le service MySQL. S'il s'agit d'un service local, vérifiez qu'il tourne bien en arrière-plan.
- Le projet Spring Boot va automatiquement créer la base de données nommée `deepfake_pfa` au démarrage grâce à sa configuration (identifiant par défaut : `root`, sans mot de passe).

### 2. Lancer le Microservice IA (FastAPI)
Ouvrez un **premier terminal** et naviguez vers le dossier contenant le code Python.

```bash
cd "service-ia-python/SSL_Anti-spoofing"
```

Activez votre environnement Conda (Python 3.10) :
```bash
conda activate deepfake_api
```

Installez les dépendances nécessaires (si ce n'est pas déjà fait) :
```bash
pip install -r requirements.txt
# Et assurez-vous d'avoir fastapi et uvicorn d'installés :
pip install fastapi uvicorn
```

Lancez le serveur FastAPI via Uvicorn (qui tournera sur le port `8000`) :
```bash
uvicorn app:app --reload --port 8000
```

### 3. Lancer le Backend (Java Spring Boot 3)
Ouvrez un **deuxième terminal** et placez-vous dans le dossier du projet Spring Boot :

```bash
cd deepfake-backend
```

Utilisez Maven pour lancer l'application :
```bash
mvn spring-boot:run
```
*Alternative :* Vous pouvez ouvrir ce dossier dans votre IDE préféré (IntelliJ, Eclipse, VS Code) et exécuter la classe principale annotée `@SpringBootApplication`.

### 4. Lancer le Frontend (React / Vite.js)
Ouvrez un **troisième terminal** et placez-vous dans le dossier frontend :

```bash
cd "ClonageVocal nv"
```

Installez les dépendances si vous venez de cloner le projet :
```bash
npm install
```

Lancez le serveur de développement :
```bash
npm run dev
```

Une fois cette commande exécutée, le terminal affichera un lien local (généralement `http://localhost:5173/`). Cliquez dessus pour ouvrir l'interface de **VoiceGuard.AI** et commencer vos analyses !
