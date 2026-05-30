import logging

logger = logging.getLogger(__name__)

class NutritionRecommender:
    """Recommends nutrients based on mood analysis"""
    
    def __init__(self):
        # Mood-nutrient mapping based on scientific research
        self.mood_nutrients = {
            'stressed': {
                'nutrients': ['MAGNESIUM', 'VITAMIN_B', 'OMEGA_3', 'POTASSIUM'],
                'foods': {
                    'breakfast': [
                        {'name': 'Dark chocolate', 'description': 'Rich in magnesium', 'rating': 5},
                        {'name': 'Oatmeal', 'description': 'Complex carbs for energy', 'rating': 4},
                        {'name': 'Berries', 'description': 'Antioxidants & vitamins', 'rating': 5}
                    ],
                    'lunch': [
                        {'name': 'Salmon', 'description': 'High in omega-3', 'rating': 5},
                        {'name': 'Quinoa salad', 'description': 'Complete protein', 'rating': 4},
                        {'name': 'Leafy greens', 'description': 'Iron & folate', 'rating': 5}
                    ],
                    'dinner': [
                        {'name': 'Spinach', 'description': 'Packed with iron and magnesium', 'rating': 5},
                        {'name': 'Sweet potato', 'description': 'Beta-carotene & potassium', 'rating': 4},
                        {'name': 'Turkey', 'description': 'Tryptophan for sleep', 'rating': 4}
                    ],
                    'snacks': [
                        {'name': 'Almonds', 'description': 'Great source of magnesium', 'rating': 5},
                        {'name': 'Banana', 'description': 'Potassium & B6', 'rating': 4},
                        {'name': 'Greek yogurt', 'description': 'Probiotics & protein', 'rating': 4}
                    ]
                }
            },
            'happy': {
                'nutrients': ['VITAMIN_B', 'ANTIOXIDANTS', 'COMPLEX_CARBS', 'HEALTHY_FATS'],
                'foods': {
                    'breakfast': [
                        {'name': 'Avocado toast', 'description': 'Healthy fats & B vitamins', 'rating': 5},
                        {'name': 'Whole grain cereal', 'description': 'Complex carbohydrates', 'rating': 4},
                        {'name': 'Orange juice', 'description': 'Vitamin C & folate', 'rating': 4}
                    ],
                    'lunch': [
                        {'name': 'Grilled chicken', 'description': 'Lean protein & B vitamins', 'rating': 5},
                        {'name': 'Brown rice', 'description': 'Complex carbs for energy', 'rating': 4},
                        {'name': 'Colorful vegetables', 'description': 'Antioxidants & vitamins', 'rating': 5}
                    ],
                    'dinner': [
                        {'name': 'Wild-caught fish', 'description': 'Omega-3 & protein', 'rating': 5},
                        {'name': 'Sweet potato', 'description': 'Beta-carotene & fiber', 'rating': 4},
                        {'name': 'Broccoli', 'description': 'Vitamin C & folate', 'rating': 5}
                    ],
                    'snacks': [
                        {'name': 'Mixed nuts', 'description': 'Healthy fats & protein', 'rating': 5},
                        {'name': 'Dark berries', 'description': 'Antioxidants', 'rating': 5},
                        {'name': 'Hummus', 'description': 'Protein & healthy fats', 'rating': 4}
                    ]
                }
            },
            'anxious': {
                'nutrients': ['MAGNESIUM', 'OMEGA_3', 'VITAMIN_B', 'ANTIOXIDANTS'],
                'foods': {
                    'breakfast': [
                        {'name': 'Chamomile tea', 'description': 'Natural calming properties', 'rating': 5},
                        {'name': 'Banana', 'description': 'Potassium & B6', 'rating': 4},
                        {'name': 'Oatmeal', 'description': 'Complex carbs for stability', 'rating': 4}
                    ],
                    'lunch': [
                        {'name': 'Fatty fish', 'description': 'Omega-3 for brain health', 'rating': 5},
                        {'name': 'Leafy greens', 'description': 'Magnesium & folate', 'rating': 5},
                        {'name': 'Quinoa', 'description': 'Complete protein', 'rating': 4}
                    ],
                    'dinner': [
                        {'name': 'Turkey', 'description': 'Tryptophan for relaxation', 'rating': 4},
                        {'name': 'Spinach', 'description': 'Magnesium & iron', 'rating': 5},
                        {'name': 'Brown rice', 'description': 'Complex carbs', 'rating': 4}
                    ],
                    'snacks': [
                        {'name': 'Pumpkin seeds', 'description': 'Magnesium & zinc', 'rating': 5},
                        {'name': 'Dark chocolate', 'description': 'Magnesium & antioxidants', 'rating': 4},
                        {'name': 'Herbal tea', 'description': 'Calming properties', 'rating': 5}
                    ]
                }
            },
            'tired': {
                'nutrients': ['IRON', 'VITAMIN_B', 'COMPLEX_CARBS', 'PROTEIN'],
                'foods': {
                    'breakfast': [
                        {'name': 'Iron-fortified cereal', 'description': 'Iron & B vitamins', 'rating': 5},
                        {'name': 'Eggs', 'description': 'Complete protein & B12', 'rating': 5},
                        {'name': 'Orange juice', 'description': 'Vitamin C for iron absorption', 'rating': 4}
                    ],
                    'lunch': [
                        {'name': 'Lean beef', 'description': 'High iron content', 'rating': 5},
                        {'name': 'Whole grain bread', 'description': 'Complex carbs & B vitamins', 'rating': 4},
                        {'name': 'Dark leafy greens', 'description': 'Iron & folate', 'rating': 5}
                    ],
                    'dinner': [
                        {'name': 'Chicken breast', 'description': 'Lean protein & B vitamins', 'rating': 5},
                        {'name': 'Sweet potato', 'description': 'Complex carbs & beta-carotene', 'rating': 4},
                        {'name': 'Lentils', 'description': 'Iron & protein', 'rating': 5}
                    ],
                    'snacks': [
                        {'name': 'Nuts', 'description': 'Protein & healthy fats', 'rating': 4},
                        {'name': 'Dried fruits', 'description': 'Iron & natural sugars', 'rating': 4},
                        {'name': 'Greek yogurt', 'description': 'Protein & probiotics', 'rating': 4}
                    ]
                }
            },
            'calm': {
                'nutrients': ['MAGNESIUM', 'OMEGA_3', 'ANTIOXIDANTS', 'HEALTHY_FATS'],
                'foods': {
                    'breakfast': [
                        {'name': 'Oatmeal', 'description': 'Complex carbs for stability', 'rating': 5},
                        {'name': 'Berries', 'description': 'Antioxidants', 'rating': 5},
                        {'name': 'Almonds', 'description': 'Magnesium & healthy fats', 'rating': 5}
                    ],
                    'lunch': [
                        {'name': 'Salmon', 'description': 'Omega-3 fatty acids', 'rating': 5},
                        {'name': 'Avocado', 'description': 'Healthy fats & potassium', 'rating': 5},
                        {'name': 'Quinoa', 'description': 'Complete protein', 'rating': 4}
                    ],
                    'dinner': [
                        {'name': 'Grilled fish', 'description': 'Omega-3 & protein', 'rating': 5},
                        {'name': 'Steamed vegetables', 'description': 'Antioxidants & vitamins', 'rating': 5},
                        {'name': 'Brown rice', 'description': 'Complex carbohydrates', 'rating': 4}
                    ],
                    'snacks': [
                        {'name': 'Walnuts', 'description': 'Omega-3 & antioxidants', 'rating': 5},
                        {'name': 'Herbal tea', 'description': 'Calming properties', 'rating': 5},
                        {'name': 'Dark chocolate', 'description': 'Magnesium & antioxidants', 'rating': 4}
                    ]
                }
            },
            'sad': {
                'nutrients': ['VITAMIN_B', 'OMEGA_3', 'ANTIOXIDANTS', 'FOLATE'],
                'foods': {
                    'breakfast': [
                        {'name': 'Fortified cereal', 'description': 'B vitamins & folate', 'rating': 5},
                        {'name': 'Eggs', 'description': 'Protein & B12', 'rating': 5},
                        {'name': 'Orange juice', 'description': 'Vitamin C & folate', 'rating': 4}
                    ],
                    'lunch': [
                        {'name': 'Fatty fish', 'description': 'Omega-3 for mood', 'rating': 5},
                        {'name': 'Dark leafy greens', 'description': 'Folate & iron', 'rating': 5},
                        {'name': 'Whole grains', 'description': 'B vitamins', 'rating': 4}
                    ],
                    'dinner': [
                        {'name': 'Turkey', 'description': 'Tryptophan & protein', 'rating': 4},
                        {'name': 'Broccoli', 'description': 'Folate & vitamin C', 'rating': 5},
                        {'name': 'Brown rice', 'description': 'Complex carbs & B vitamins', 'rating': 4}
                    ],
                    'snacks': [
                        {'name': 'Dark berries', 'description': 'Antioxidants', 'rating': 5},
                        {'name': 'Nuts', 'description': 'Healthy fats & protein', 'rating': 4},
                        {'name': 'Yogurt', 'description': 'Probiotics & protein', 'rating': 4}
                    ]
                }
            }
        }

    def get_recommendations(self, mood, intensity=50):
        """Get nutrition recommendations for a specific mood"""
        try:
            # Get base recommendations for the mood
            mood_data = self.mood_nutrients.get(mood, self.mood_nutrients['calm'])
            
            # Adjust recommendations based on intensity
            adjusted_foods = self._adjust_for_intensity(mood_data['foods'], intensity)
            
            return {
                'nutrients': mood_data['nutrients'],
                'recommendations': adjusted_foods,
                'mood': mood,
                'intensity': intensity
            }
            
        except Exception as e:
            logger.error(f"Error in nutrition recommendation: {str(e)}")
            # Return default recommendations
            return {
                'nutrients': ['MAGNESIUM', 'VITAMIN_B', 'ANTIOXIDANTS'],
                'recommendations': self.mood_nutrients['calm']['foods'],
                'mood': mood,
                'intensity': intensity
            }

    def _adjust_for_intensity(self, foods, intensity):
        """Adjust food recommendations based on mood intensity"""
        adjusted_foods = {}
        
        for meal, meal_foods in foods.items():
            adjusted_foods[meal] = []
            
            # Higher intensity = more foods recommended
            num_foods = min(len(meal_foods), max(2, int(3 * intensity / 100)))
            
            for i, food in enumerate(meal_foods[:num_foods]):
                # Adjust rating based on intensity
                adjusted_rating = min(5, food['rating'] + (intensity - 50) / 50)
                adjusted_foods[meal].append({
                    'name': food['name'],
                    'description': food['description'],
                    'rating': max(1, int(adjusted_rating))
                })
        
        return adjusted_foods
