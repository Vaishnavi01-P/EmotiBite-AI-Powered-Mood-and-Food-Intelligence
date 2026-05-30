# 🧠 EmotiBite – AI-Powered Mood & Food Intelligence

## 🌟 Overview

EmotiBite is an AI-powered Emotion-Aware Nutritional Intelligence platform that analyzes a user's emotional state through text and voice inputs and recommends personalized foods, nutrients, and recipes to support emotional well-being.

The application combines Natural Language Processing (NLP), Speech Analysis, Machine Learning, Neuro-Nutrition, and Full-Stack Web Development to create an intelligent system that helps users make healthier food choices based on their current mood.

Unlike traditional health applications that focus primarily on calorie tracking, EmotiBite focuses on the relationship between emotions, brain chemistry, and nutrition.

---

## 🎯 Problem Statement

Modern lifestyles often lead to emotional eating, stress-induced food choices, and poor nutritional habits. Existing health applications generally ignore the psychological factors that influence dietary decisions.

Key challenges include:

* Lack of real-time mood detection.
* Absence of emotion-based food recommendations.
* Limited integration of mental wellness and nutrition.
* Dependence on continuous backend availability.

EmotiBite addresses these challenges through intelligent mood analysis and scientifically informed nutritional recommendations.

---

# ✨ Features

### 🧠 AI-Based Mood Analysis

* Text sentiment analysis using DistilBERT.
* Emotion detection through natural language input.
* Confidence-based mood scoring.

### 🎤 Voice Emotion Recognition

* Speech-to-text processing.
* Acoustic feature extraction using Librosa.
* Voice-based mood prediction.

### 🍎 Personalized Nutrition Intelligence

* Mood-to-nutrient mapping.
* Neurotransmitter-focused food recommendations.
* Scientifically guided meal suggestions.

### 📸 FoodieSnap

* Food image recognition using TensorFlow.js MobileNet.
* Intelligent food identification and analysis.

### 🥗 Pantry Suggestion Engine

* Ingredient-based recipe generation.
* “Cook With What You Have” recommendations.

### 🎮 Gamification

* MoodCoins reward system.
* Achievement badges.
* User engagement tracking.

### ☁️ Hybrid Offline Support

* LocalStorage persistence.
* Offline fallback recommendations.
* MongoDB synchronization when online.

---

# 🏗️ System Architecture

User Input (Text / Voice / Image)

⬇

Mood Detection Engine

⬇

Emotion Classification

⬇

Nutritional Intelligence Engine

⬇

Recipe Recommendation Engine

⬇

Personalized Food Suggestions

---

# 🛠️ Technology Stack

## Frontend

* React 18
* TypeScript
* Tailwind CSS
* Framer Motion
* React Context API
* Web Speech API
* Recharts

## Backend

* Node.js
* Express.js
* Flask
* MongoDB
* JWT Authentication
* BcryptJS

## AI & Machine Learning

* DistilBERT
* Hugging Face Transformers
* Librosa
* TensorFlow.js MobileNet
* Custom NLP Heuristics

---

# 🔬 Mood-to-Nutrient Mapping

| Mood     | Nutrients                      | Purpose               |
| -------- | ------------------------------ | --------------------- |
| Stressed | Magnesium, Omega-3, Vitamin B6 | Cortisol Reduction    |
| Sad      | Tryptophan, Vitamin D          | Serotonin Enhancement |
| Tired    | Iron, Vitamin C, CoQ10         | Energy Support        |
| Happy    | Antioxidants, Flavonoids       | Dopamine Support      |

---

# 📂 Project Structure

```bash
MoodFood/
│
├── client/          # React Frontend
├── server/          # Express Backend
├── ai-service/      # Flask AI Services
│
├── README.md
├── package.json
└── setup.sh
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/Vaishnavi01-P/EmotiBite-AI-Powered-Mood-and-Food-Intelligence.git
cd MoodFood
```

## Install Frontend Dependencies

```bash
cd client
npm install
```

## Install Backend Dependencies

```bash
cd ../server
npm install
```

## Install AI Service Dependencies

```bash
cd ../ai-service
pip install -r requirements.txt
```

---

# ▶️ Running the Application

## Start Backend

```bash
cd server
npm start
```

## Start Frontend

```bash
cd client
npm start
```

## Start AI Service

```bash
cd ai-service
python app.py
```

---

# 📊 AI Workflow

1. User provides text or voice input.
2. DistilBERT analyzes sentiment and emotional context.
3. Voice features are extracted using Librosa.
4. Mood category is identified.
5. Nutritional intelligence engine maps emotions to nutrients.
6. Personalized food and recipe recommendations are generated.
7. Results are presented through an interactive dashboard.

---

# 📈 Future Enhancements

* Wearable device integration.
* Personalized recommendation models.
* Advanced emotion recognition.
* Community wellness features.
* AI-powered diet planning assistant.
* Mobile application deployment.

---

# 👩‍💻 Developed By

### Vaishnavi Padmashali

Full Stack Developer | AI Enthusiast

### Contributions

* System Architecture Design
* Frontend Development (React + TypeScript)
* Backend Development (Node.js + Express.js)
* AI Service Development (Python + Flask)
* NLP Integration using DistilBERT
* Voice Analysis Pipeline
* Nutritional Recommendation Engine
* MongoDB Database Integration
* Authentication & Security Implementation
