import logging
import random

logger = logging.getLogger(__name__)

class RecipeGenerator:
    """Generates recipe recommendations based on mood and nutrients"""
    
    def __init__(self):
        # Recipe database organized by mood and nutrients
        self.recipes = {
            'stressed': {
                'MAGNESIUM': [
                    {
                        'title': 'Stress-Relief Smoothie Bowl',
                        'description': 'A nutrient-packed smoothie bowl designed to combat stress and boost mood',
                        'time': 10,
                        'servings': 1,
                        'difficulty': 'Easy',
                        'rating': 4.8,
                        'ingredients': [
                            '1 banana',
                            '1 cup spinach',
                            '1/2 cup blueberries',
                            '1 tbsp almond butter',
                            '1 cup almond milk',
                            '1 tbsp chia seeds'
                        ],
                        'instructions': [
                            'Add all ingredients to a blender',
                            'Blend until smooth and creamy',
                            'Pour into a bowl',
                            'Top with additional berries and chia seeds',
                            'Enjoy immediately'
                        ],
                        'nutrients': ['MAGNESIUM', 'VITAMIN_B', 'ANTIOXIDANTS']
                    },
                    {
                        'title': 'Dark Chocolate Energy Balls',
                        'description': 'Healthy energy balls with dark chocolate and nuts for mood support',
                        'time': 15,
                        'servings': 12,
                        'difficulty': 'Easy',
                        'rating': 4.7,
                        'ingredients': [
                            '1 cup dates',
                            '1/2 cup almonds',
                            '1/4 cup dark chocolate chips',
                            '2 tbsp cocoa powder',
                            '1 tbsp coconut oil',
                            'Pinch of sea salt'
                        ],
                        'instructions': [
                            'Soak dates in warm water for 10 minutes',
                            'Process almonds in food processor',
                            'Add dates and process until combined',
                            'Add remaining ingredients and process',
                            'Roll into balls and refrigerate'
                        ],
                        'nutrients': ['MAGNESIUM', 'HEALTHY_FATS', 'ANTIOXIDANTS']
                    }
                ],
                'OMEGA_3': [
                    {
                        'title': 'Mediterranean Salmon Bowl',
                        'description': 'Omega-3 rich salmon with quinoa and vegetables for sustained energy',
                        'time': 25,
                        'servings': 2,
                        'difficulty': 'Medium',
                        'rating': 4.9,
                        'ingredients': [
                            '2 salmon fillets',
                            '1 cup quinoa',
                            '1 cucumber',
                            '1 tomato',
                            '1/4 red onion',
                            '2 tbsp olive oil',
                            'Lemon juice',
                            'Fresh herbs'
                        ],
                        'instructions': [
                            'Cook quinoa according to package instructions',
                            'Season salmon with herbs and lemon',
                            'Pan-sear salmon for 4-5 minutes per side',
                            'Dice vegetables and mix with olive oil',
                            'Serve salmon over quinoa with vegetables'
                        ],
                        'nutrients': ['OMEGA_3', 'PROTEIN', 'COMPLEX_CARBS']
                    }
                ]
            },
            'happy': {
                'ANTIOXIDANTS': [
                    {
                        'title': 'Rainbow Veggie Stir-Fry',
                        'description': 'Colorful vegetable stir-fry packed with antioxidants and vitamins',
                        'time': 20,
                        'servings': 4,
                        'difficulty': 'Easy',
                        'rating': 4.6,
                        'ingredients': [
                            '2 cups mixed vegetables',
                            '1 bell pepper',
                            '1 carrot',
                            '1 cup broccoli',
                            '2 tbsp sesame oil',
                            '2 cloves garlic',
                            '1 tbsp ginger',
                            'Soy sauce'
                        ],
                        'instructions': [
                            'Cut all vegetables into bite-sized pieces',
                            'Heat sesame oil in a large pan',
                            'Add garlic and ginger, cook for 1 minute',
                            'Add vegetables and stir-fry for 5-7 minutes',
                            'Season with soy sauce and serve'
                        ],
                        'nutrients': ['ANTIOXIDANTS', 'VITAMIN_C', 'FIBER']
                    }
                ]
            },
            'anxious': {
                'MAGNESIUM': [
                    {
                        'title': 'Calming Chamomile Oatmeal',
                        'description': 'Warm oatmeal with chamomile tea for a soothing breakfast',
                        'time': 15,
                        'servings': 1,
                        'difficulty': 'Easy',
                        'rating': 4.5,
                        'ingredients': [
                            '1/2 cup rolled oats',
                            '1 cup chamomile tea',
                            '1 tbsp honey',
                            '1 tbsp almond butter',
                            '1/4 cup berries',
                            '1 tbsp pumpkin seeds'
                        ],
                        'instructions': [
                            'Brew chamomile tea',
                            'Cook oats in chamomile tea for 5 minutes',
                            'Stir in honey and almond butter',
                            'Top with berries and pumpkin seeds',
                            'Enjoy warm'
                        ],
                        'nutrients': ['MAGNESIUM', 'COMPLEX_CARBS', 'ANTIOXIDANTS']
                    }
                ]
            },
            'tired': {
                'IRON': [
                    {
                        'title': 'Iron-Boost Power Bowl',
                        'description': 'Nutrient-dense bowl with iron-rich ingredients to combat fatigue',
                        'time': 20,
                        'servings': 2,
                        'difficulty': 'Easy',
                        'rating': 4.7,
                        'ingredients': [
                            '1 cup cooked quinoa',
                            '1 cup spinach',
                            '1/2 cup chickpeas',
                            '1/4 cup pumpkin seeds',
                            '1 avocado',
                            '2 tbsp tahini',
                            'Lemon juice',
                            'Salt and pepper'
                        ],
                        'instructions': [
                            'Cook quinoa according to package instructions',
                            'Massage spinach with lemon juice',
                            'Mix quinoa with chickpeas and seeds',
                            'Top with sliced avocado',
                            'Drizzle with tahini dressing'
                        ],
                        'nutrients': ['IRON', 'PROTEIN', 'HEALTHY_FATS']
                    }
                ]
            },
            'calm': {
                'OMEGA_3': [
                    {
                        'title': 'Peaceful Fish and Greens',
                        'description': 'Light and calming meal with omega-3 rich fish',
                        'time': 30,
                        'servings': 2,
                        'difficulty': 'Medium',
                        'rating': 4.8,
                        'ingredients': [
                            '2 white fish fillets',
                            '2 cups mixed greens',
                            '1/2 avocado',
                            '1/4 cup walnuts',
                            '2 tbsp olive oil',
                            'Lemon juice',
                            'Fresh herbs'
                        ],
                        'instructions': [
                            'Season fish with herbs and lemon',
                            'Bake fish for 15-20 minutes',
                            'Toss greens with olive oil and lemon',
                            'Top with sliced avocado and walnuts',
                            'Serve fish over greens'
                        ],
                        'nutrients': ['OMEGA_3', 'HEALTHY_FATS', 'ANTIOXIDANTS']
                    }
                ]
            }
        }

    def generate_recommendations(self, mood, nutrients):
        """Generate recipe recommendations based on mood and nutrients"""
        try:
            recommendations = []
            
            # Get recipes for the specific mood
            mood_recipes = self.recipes.get(mood, self.recipes['calm'])
            
            # Find recipes that match the required nutrients
            for nutrient in nutrients:
                if nutrient in mood_recipes:
                    nutrient_recipes = mood_recipes[nutrient]
                    # Select up to 2 recipes per nutrient
                    selected_recipes = random.sample(
                        nutrient_recipes, 
                        min(2, len(nutrient_recipes))
                    )
                    recommendations.extend(selected_recipes)
            
            # If no specific nutrient matches, get general mood recipes
            if not recommendations:
                all_mood_recipes = []
                for nutrient_recipes in mood_recipes.values():
                    all_mood_recipes.extend(nutrient_recipes)
                
                recommendations = random.sample(
                    all_mood_recipes, 
                    min(3, len(all_mood_recipes))
                )
            
            # Remove duplicates and limit to 6 recipes
            unique_recipes = []
            seen_titles = set()
            for recipe in recommendations:
                if recipe['title'] not in seen_titles:
                    unique_recipes.append(recipe)
                    seen_titles.add(recipe['title'])
                if len(unique_recipes) >= 6:
                    break
            
            return unique_recipes
            
        except Exception as e:
            logger.error(f"Error generating recipe recommendations: {str(e)}")
            # Return default recipes
            return [
                {
                    'title': 'Balanced Wellness Bowl',
                    'description': 'A nutritious bowl with a variety of mood-supporting ingredients',
                    'time': 20,
                    'servings': 2,
                    'difficulty': 'Easy',
                    'rating': 4.5,
                    'ingredients': [
                        '1 cup quinoa',
                        '1 cup mixed vegetables',
                        '1/2 avocado',
                        '2 tbsp nuts',
                        'Olive oil',
                        'Lemon juice'
                    ],
                    'instructions': [
                        'Cook quinoa according to package instructions',
                        'Steam or roast vegetables',
                        'Combine quinoa and vegetables',
                        'Top with avocado and nuts',
                        'Drizzle with olive oil and lemon'
                    ],
                    'nutrients': ['PROTEIN', 'HEALTHY_FATS', 'ANTIOXIDANTS']
                }
            ]
