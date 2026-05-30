# 🧠 EmotiBite – AI-Powered Mood & Food Intelligence

## 📝 Abstract
EmotiBite is a pioneering **Emotion-Aware Nutritional Intelligence** system that bridges the gap between mental well-being and dietary habits. By utilizing advanced **Natural Language Processing (NLP)** and **Acoustic Feature Extraction**, the system analyzes a user's emotional state through text and voice inputs. Based on the detected mood (e.g., Stressed, Sad, Happy), the application employs a **Scientific Nutrition Mapping Algorithm** to recommend specific nutrients and recipes designed to regulate neurochemicals like Serotonin, Dopamine, and Cortisol. The project features a unique **Hybrid Architecture** that ensures 100% availability through client-side heuristic fallbacks when backend AI services are offline.

## 🎯 Problem Statement
In the modern, fast-paced world, mental health is often neglected, and dietary choices are frequently influenced by emotional triggers (emotional eating) without nutritional logic. Existing health apps focus on calorie counting but ignore the **psychological drivers** of food choice. There is a lack of integrated solutions that:
1.  Quantify emotional state in real-time.
2.  Provide actionable, scientifically-backed nutritional interventions for emotional balance.
3.  Offer a seamless user experience that works across varying network conditions (Offline/Online).

---

## 🛠️ Complete Technical Stack

### **Frontend (Client)**
- **Framework**: React 18 (TypeScript)
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 12.0
- **State Management**: React Context API
- **Voice Intelligence**: Web Speech API / `react-speech-recognition`
- **Charts**: Recharts (for mood trends)

### **Backend (Microservices)**
- **API Server**: Node.js & Express.js
- **AI Service**: Python 3.9 & Flask
- **Database**: MongoDB (MERN Stack)
- **Authentication**: JWT & Bcryptjs

### **AI & Machine Learning (The "Brain")**
- **Text Analysis**: DistilBERT (`distilbert-base-uncased-finetuned-sst-2-english`) via Hugging Face Transformers.
- **Audio Processing**: Librosa (Pitch, RMS Energy, Spectral Centroid analysis).
- **In-Browser Heuristics**: Custom Regex-based Keyword Density Algorithm (for 0-latency fallback).

---

## 🔬 Methodology & Core Logic

### 1. Mood Detection Pipeline
1.  **Input Acquisition**: User provides Text ("I feel overwhelmed") or Voice sample.
2.  **Multimodal Analysis**:
    *   **Text Processing**: The DistilBERT model classifies sentiment into Positive/Negative clusters, then further refined into specific categories (Stressed, Tired, etc.).
    *   **Voice Processing**: Extracting acoustic markers (High Pitch + High Energy = Excited/Anxious).
3.  **Intensity Scoring**: A confidence-weighted score (0-100%) determines the "strength" of the emotion.

### 2. The Recommendation Engine
The system uses a **Mood-to-Nutrient Mapping Table**:
| Detected Mood | Suggested Nutrients | Target Neurotransmitter |
| :--- | :--- | :--- |
| **Stressed** | Magnesium, Vitamin B6, Omega-3 | Reduces Cortisol |
| **Sad / Low** | Tryptophan, Vitamin D, Complex Carbs | Boosts Serotonin |
| **Tired** | Iron, Coenzyme Q10, Vitamin C | Enhances ATP Production |
| **Happy** | Antioxidants, Flavonoids | Sustains Dopamine |

---

## 🧬 Nutritional Science (Neuro-Nutrition Logic)
A common question arises: *"Why does the app suggest comfort foods like 'Chole Bhature' or 'Rice'?"* 

EmotiBite operates on the principles of **Neuro-Nutrition**—the study of how nutrients influence brain chemistry and emotional regulation.

1.  **The Serotonin Link (Complex Carbs)**: When feeling **Sad or Anxious**, the brain requires insulin-stimulating carbohydrates to allow **Tryptophan** (an amino acid) to enter the brain and convert into **Serotonin**, the hormone responsible for stabilization and happiness.
2.  **The Cortisol Counter (Magnesium)**: During **Stress**, the body rapidly depletes magnesium. Suggestions like *Spinach (Palak Paneer)* or *Dark Chocolate* are selected specifically for their high magnesium density to dampen the nervous system's stress response.
3.  **The Dopamine Sustainer (Proteins)**: For a **Happy** mood, the system suggests proteins high in **Tyrosine**, which serves as the precursor to **Dopamine**, ensuring the positive energy is sustained naturally.
4.  **Mindful Comfort**: Unlike "junk food," the app's recommendations focus on **Traditional Balanced Meals** that provide these neuro-chemicals without the "sugar crash" associated with processed snacks.

---

## 🚀 Key Features
*   **Real-time Voice Analysis**: Logging moods via speech with instant acoustic feedback.
*   **FoodieSnap (Computer Vision)**: Integrated TensorFlow.js MobileNet to recognize food items from images and predict their emotional impact.
*   **Pantry Suggestion Engine**: "Cook with what you have" logic that filters recipes based on available ingredients and nutritional needs.
*   **Gamification**: Earn **MoodCoins** and unlock badges (e.g., "Calm Chef") to encourage healthy emotional-eating habits.
*   **Hybrid Sync**: Data persists to `localStorage` when offline and syncs to MongoDB when online.

## 📈 Future Scope
- **IoT Integration**: Syncing with wearable devices for heart-rate based stress detection.
- **Personalized ML**: Training customized models based on local user dietary preferences.
- **Social Support**: Community-based mood-sharing and group dietary challenges.

---

## 📄 License & Team
**Developed by**: MoodFood AI Team (Project EmotiBite)
**License**: MIT
