from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from services.mood_analyzer import MoodAnalyzer
from services.nutrition_recommender import NutritionRecommender
from services.recipe_generator import RecipeGenerator
import logging

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize AI services
mood_analyzer = MoodAnalyzer()
nutrition_recommender = NutritionRecommender()
recipe_generator = RecipeGenerator()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'service': 'MoodFood AI Service',
        'version': '1.0.0'
    })

@app.route('/analyze', methods=['POST'])
def analyze_mood():
    """Analyze mood from text and voice data"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        voice_data = data.get('voiceData', None)
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        logger.info(f"Analyzing mood for text: {text[:50]}...")
        
        # Analyze mood
        mood_result = mood_analyzer.analyze(text, voice_data)
        
        # Get nutrition recommendations
        nutrition_recommendations = nutrition_recommender.get_recommendations(
            mood_result['mood'], 
            mood_result['intensity']
        )
        
        # Generate recipe recommendations
        recipe_recommendations = recipe_generator.generate_recommendations(
            mood_result['mood'],
            nutrition_recommendations['nutrients']
        )
        
        response = {
            'mood': mood_result['mood'],
            'intensity': mood_result['intensity'],
            'confidence': mood_result['confidence'],
            'nutrients': nutrition_recommendations['nutrients'],
            'recommendations': recipe_recommendations
        }
        
        logger.info(f"Mood analysis completed: {mood_result['mood']} ({mood_result['intensity']}%)")
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in mood analysis: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/recommend/nutrition', methods=['POST'])
def recommend_nutrition():
    """Get nutrition recommendations for a mood"""
    try:
        data = request.get_json()
        mood = data.get('mood', '')
        intensity = data.get('intensity', 50)
        
        if not mood:
            return jsonify({'error': 'Mood is required'}), 400
        
        recommendations = nutrition_recommender.get_recommendations(mood, intensity)
        return jsonify(recommendations)
        
    except Exception as e:
        logger.error(f"Error in nutrition recommendation: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/recommend/recipes', methods=['POST'])
def recommend_recipes():
    """Get recipe recommendations for a mood and nutrients"""
    try:
        data = request.get_json()
        mood = data.get('mood', '')
        nutrients = data.get('nutrients', [])
        
        if not mood:
            return jsonify({'error': 'Mood is required'}), 400
        
        recommendations = recipe_generator.generate_recommendations(mood, nutrients)
        return jsonify(recommendations)
        
    except Exception as e:
        logger.error(f"Error in recipe recommendation: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/sentiment', methods=['POST'])
def analyze_sentiment():
    """Analyze sentiment of text"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        sentiment_result = mood_analyzer.analyze_sentiment(text)
        return jsonify(sentiment_result)
        
    except Exception as e:
        logger.error(f"Error in sentiment analysis: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting MoodFood AI Service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
