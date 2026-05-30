require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/moodfood';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for seeding');

  const now = new Date();

  const data = [
    // Breakfast
    {
      title: 'Aloo Paratha',
      description: 'Stuffed potato paratha served with curd/butter',
      time: 35, servings: 2, difficulty: 'Medium', rating: 4.8,
      ingredients: [
        { name: 'Whole wheat flour', amount: '2 cups' },
        { name: 'Potatoes (boiled & mashed)', amount: '2' },
        { name: 'Onion (finely chopped)', amount: '1' },
        { name: 'Green chilli, coriander, spices', amount: 'to taste' }
      ],
      instructions: [
        { step: 1, instruction: 'Knead dough with flour, water, pinch of salt.' },
        { step: 2, instruction: 'Mix mashed potato with onion, chilli, coriander, spices.' },
        { step: 3, instruction: 'Stuff, roll and roast on tawa with ghee until golden.' }
      ],
      nutrients: ['COMPLEX_CARBS', 'IRON'],
      moodTags: ['stressed', 'tired'],
      mealType: 'breakfast',
      cuisine: 'indian'
    },
    {
      title: 'Idli with Sambar',
      description: 'Fermented rice cakes served with lentil sambar',
      time: 30, servings: 2, difficulty: 'Medium', rating: 4.9,
      ingredients: [
        { name: 'Idli batter', amount: '2 cups' },
        { name: 'Toor dal', amount: '1/2 cup' },
        { name: 'Tamarind, veggies, spices', amount: 'to taste' }
      ],
      instructions: [
        { step: 1, instruction: 'Steam idlis for 10-12 minutes.' },
        { step: 2, instruction: 'Cook dal until soft; add veggies and tamarind.' },
        { step: 3, instruction: 'Temper with mustard seeds, curry leaves; simmer.' }
      ],
      nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
      moodTags: ['stressed', 'calm'],
      mealType: 'breakfast',
      cuisine: 'indian'
    },
    {
      title: 'Poha',
      description: 'Light flattened rice with peanuts & spices',
      time: 15, servings: 2, difficulty: 'Easy', rating: 4.6,
      ingredients: [
        { name: 'Flattened rice (poha)', amount: '2 cups' },
        { name: 'Peanuts', amount: '2 tbsp' },
        { name: 'Onion, curry leaves, mustard, turmeric' }
      ],
      instructions: [
        { step: 1, instruction: 'Rinse poha and drain well.' },
        { step: 2, instruction: 'Tempering with mustard, curry leaves, onion & peanuts.' },
        { step: 3, instruction: 'Add poha, turmeric, salt; toss and steam 2 minutes.' }
      ],
      nutrients: ['IRON', 'COMPLEX_CARBS'],
      moodTags: ['tired', 'calm'],
      mealType: 'breakfast',
      cuisine: 'indian'
    },

    // Lunch
    {
      title: 'Rajma Chawal',
      description: 'Kidney beans curry with rice',
      time: 45, servings: 3, difficulty: 'Medium', rating: 4.8,
      ingredients: [
        { name: 'Rajma (soaked)', amount: '1 cup' },
        { name: 'Onion, tomato, ginger-garlic' },
        { name: 'Spices, rice' }
      ],
      instructions: [
        { step: 1, instruction: 'Pressure cook soaked rajma until soft.' },
        { step: 2, instruction: 'Make masala with onion, tomato, spices; add rajma.' },
        { step: 3, instruction: 'Simmer to thicken; serve with steamed rice.' }
      ],
      nutrients: ['PROTEIN', 'COMPLEX_CARBS', 'FIBER'],
      moodTags: ['stressed', 'tired'],
      mealType: 'lunch',
      cuisine: 'indian'
    },
    {
      title: 'Dal Makhani',
      description: 'Creamy black lentils, slow cooked',
      time: 60, servings: 4, difficulty: 'Medium', rating: 4.7,
      ingredients: [
        { name: 'Whole urad dal', amount: '3/4 cup' },
        { name: 'Rajma', amount: '2 tbsp' },
        { name: 'Onion, tomato, butter/cream, spices' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook lentils until very soft.' },
        { step: 2, instruction: 'Make masala; combine and simmer long with butter/cream.' },
        { step: 3, instruction: 'Finish with kasuri methi and butter.' }
      ],
      nutrients: ['PROTEIN', 'HEALTHY_FATS'],
      moodTags: ['calm', 'happy'],
      mealType: 'lunch',
      cuisine: 'indian'
    },
    {
      title: 'Palak Paneer',
      description: 'Spinach and paneer curry rich in iron and protein',
      time: 35, servings: 3, difficulty: 'Medium', rating: 4.8,
      ingredients: [
        { name: 'Spinach', amount: '300 g' },
        { name: 'Paneer', amount: '200 g' },
        { name: 'Onion, tomato, spices, cream (optional)' }
      ],
      instructions: [
        { step: 1, instruction: 'Blanch spinach, blend to puree.' },
        { step: 2, instruction: 'Saute onion-tomato masala; add puree & spices.' },
        { step: 3, instruction: 'Add paneer cubes and simmer briefly.' }
      ],
      nutrients: ['IRON', 'PROTEIN'],
      moodTags: ['tired', 'stressed'],
      mealType: 'lunch',
      cuisine: 'indian'
    },
    {
      title: 'Kadhi Pakora',
      description: 'Yogurt gram flour curry with fritters',
      time: 40, servings: 3, difficulty: 'Medium', rating: 4.6,
      ingredients: [
        { name: 'Curd', amount: '1 cup' },
        { name: 'Besan', amount: '1/2 cup' },
        { name: 'Onion, spices, herbs' }
      ],
      instructions: [
        { step: 1, instruction: 'Make kadhi mixture with curd, besan, spices; simmer.' },
        { step: 2, instruction: 'Fry pakoras from besan batter.' },
        { step: 3, instruction: 'Add pakoras to kadhi; finish with tempering.' }
      ],
      nutrients: ['PROTEIN'],
      moodTags: ['calm'],
      mealType: 'dinner',
      cuisine: 'indian'
    },
    {
      title: 'Sarson da Saag & Makki di Roti',
      description: 'Mustard greens curry with corn flatbread',
      time: 60, servings: 3, difficulty: 'Hard', rating: 4.7,
      ingredients: [
        { name: 'Mustard greens', amount: '400 g' },
        { name: 'Spinach', amount: '200 g' },
        { name: 'Makki flour, onion, ginger, garlic, spices' }
      ],
      instructions: [
        { step: 1, instruction: 'Boil greens; blend coarsely; cook with masala and makki flour slurry.' },
        { step: 2, instruction: 'Knead makki dough; pat rotis; cook on tawa.' },
        { step: 3, instruction: 'Serve hot with butter.' }
      ],
      nutrients: ['IRON', 'COMPLEX_CARBS'],
      moodTags: ['tired'],
      mealType: 'dinner',
      cuisine: 'indian'
    },

    // Snacks
    {
      title: 'Sprouts Chaat',
      description: 'Healthy chaat with mixed sprouts',
      time: 10, servings: 2, difficulty: 'Easy', rating: 4.6,
      ingredients: [
        { name: 'Mixed sprouts', amount: '2 cups' },
        { name: 'Onion, tomato, lemon, chutneys, spices' }
      ],
      instructions: [
        { step: 1, instruction: 'Mix all ingredients; season and serve fresh.' }
      ],
      nutrients: ['PROTEIN', 'FIBER'],
      moodTags: ['stressed', 'anxious'],
      mealType: 'snacks',
      cuisine: 'indian'
    },
    {
      title: 'Roasted Chana',
      description: 'Crisp roasted chickpeas snack',
      time: 5, servings: 2, difficulty: 'Easy', rating: 4.4,
      ingredients: [
        { name: 'Roasted chana', amount: '1 cup' },
        { name: 'Chaat masala, lemon' }
      ],
      instructions: [
        { step: 1, instruction: 'Season roasted chana with spices and lemon.' }
      ],
      nutrients: ['PROTEIN', 'FIBER'],
      moodTags: ['anxious', 'calm'],
      mealType: 'snacks',
      cuisine: 'indian'
    },
    {
      title: 'Dhokla',
      description: 'Steamed gram flour cake',
      time: 25, servings: 4, difficulty: 'Easy', rating: 4.5,
      ingredients: [
        { name: 'Besan', amount: '1 cup' },
        { name: 'Yogurt, eno, spices' }
      ],
      instructions: [
        { step: 1, instruction: 'Make batter; steam until set.' },
        { step: 2, instruction: 'Temper with mustard, curry leaves, green chilli.' }
      ],
      nutrients: ['PROTEIN'],
      moodTags: ['happy'],
      mealType: 'snacks',
      cuisine: 'indian'
    },
    {
      title: 'Samosa',
      description: 'Crispy pastry with spiced potato filling',
      time: 45, servings: 4, difficulty: 'Medium', rating: 4.6,
      ingredients: [
        { name: 'Maida', amount: '2 cups' },
        { name: 'Potato (boiled)', amount: '3' },
        { name: 'Spices, peas (optional)' }
      ],
      instructions: [
        { step: 1, instruction: 'Prepare dough and potato filling.' },
        { step: 2, instruction: 'Shape samosas; fry until golden.' }
      ],
      nutrients: ['COMPLEX_CARBS'],
      moodTags: ['happy'],
      mealType: 'snacks',
      cuisine: 'indian'
    },

    // Dinner / Light
    {
      title: 'Veg Khichdi',
      description: 'Comforting rice and moong dal with veggies',
      time: 25, servings: 2, difficulty: 'Easy', rating: 4.7,
      ingredients: [
        { name: 'Rice', amount: '1/2 cup' },
        { name: 'Moong dal', amount: '1/2 cup' },
        { name: 'Veggies, spices' }
      ],
      instructions: [
        { step: 1, instruction: 'Wash rice & dal; pressure cook with veggies and spices.' },
        { step: 2, instruction: 'Finish with ghee tempering.' }
      ],
      nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
      moodTags: ['tired', 'stressed'],
      mealType: 'dinner',
      cuisine: 'indian'
    },

    // Parathas
    {
      title: 'Paneer Paratha',
      description: 'Paratha stuffed with spiced grated paneer',
      time: 30, servings: 2, difficulty: 'Medium', rating: 4.6,
      ingredients: [
        { name: 'Whole wheat flour', amount: '2 cups' },
        { name: 'Paneer (grated)', amount: '200 g' },
        { name: 'Spices, herbs' }
      ],
      instructions: [
        { step: 1, instruction: 'Knead dough; prepare paneer stuffing.' },
        { step: 2, instruction: 'Stuff, roll and roast on tawa with ghee.' }
      ],
      nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
      moodTags: ['tired'],
      mealType: 'breakfast',
      cuisine: 'indian'
    },

    // Punjabi mains
    {
      title: 'Butter Chicken',
      description: 'Creamy tomato-based chicken curry',
      time: 50, servings: 4, difficulty: 'Medium', rating: 4.8,
      ingredients: [
        { name: 'Chicken', amount: '500 g' },
        { name: 'Tomato, butter/cream, spices' }
      ],
      instructions: [
        { step: 1, instruction: 'Marinate and cook chicken.' },
        { step: 2, instruction: 'Make makhani gravy; combine and simmer.' }
      ],
      nutrients: ['PROTEIN', 'HEALTHY_FATS'],
      moodTags: ['happy'],
      mealType: 'lunch',
      cuisine: 'indian'
    },
    {
      title: 'Shahi Paneer',
      description: 'Rich paneer curry with nuts & cream',
      time: 40, servings: 3, difficulty: 'Medium', rating: 4.7,
      ingredients: [
        { name: 'Paneer', amount: '250 g' },
        { name: 'Onion, tomato, nuts, cream, spices' }
      ],
      instructions: [
        { step: 1, instruction: 'Prepare shahi gravy with nuts and onions.' },
        { step: 2, instruction: 'Add paneer and simmer briefly.' }
      ],
      nutrients: ['PROTEIN', 'HEALTHY_FATS'],
      moodTags: ['happy'],
      mealType: 'dinner',
      cuisine: 'indian'
    }
  ];

  // Upsert by title to avoid duplicates
  for (const r of data) {
    await Recipe.findOneAndUpdate(
      { title: r.title },
      { $set: { ...r, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    );
    console.log(`Upserted: ${r.title}`);
  }

  await mongoose.disconnect();
  console.log('Seeding completed and disconnected');
  process.exit(0);
})();
