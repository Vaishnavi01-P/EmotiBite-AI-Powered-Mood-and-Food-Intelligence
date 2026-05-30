// Recipe interface defined locally below

export interface Recipe {
    id: string;
    title: string;
    description: string;
    image: string;
    time: number;
    servings: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    rating: number;
    ingredients: string[];
    instructions: string[];
    nutrients: string[];
    moodTags?: string[];
    saved?: boolean;
}

export const recipes: Record<'breakfast' | 'lunch' | 'snacks' | 'dinner', { veg: Recipe[]; nonveg: Recipe[] }> = {
    breakfast: {
        veg: [
            {
                id: 'idli-sambar',
                title: 'Idli with Sambar and Chutney',
                description: 'Fermented rice cakes with lentil stew and coconut chutney',
                image: '',
                time: 30,
                servings: 2,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '2 cups Parboiled Rice (Idli Rice)',
                    '1/2 cup Urad Dal (Black Gram)',
                    '1/2 cup Toor Dal (for Sambar)',
                    '1 cup Mixed Vegetables (Carrot, Drumstick, Beans)',
                    '2 tbsp Sambar Powder',
                    '1 small ball Tamarind (soaked)',
                    '1/2 cup Fresh Coconut (grated)',
                    '2 Green Chilies',
                    'Salt to taste'
                ],
                instructions: [
                    'Soak rice and urad dal separately for 4-6 hours. Grind to a smooth batter and ferment overnight.',
                    'Grease idli molds and pour the batter. Steam for 10-12 minutes until cooked through.',
                    'For Sambar: Cook toor dal until soft. Boil vegetables with tamarind water, salt, and sambar powder.',
                    'Add cooked dal to the vegetables and simmer for 5 minutes. Temper with mustard seeds and curry leaves.',
                    'For Chutney: Blend coconut, green chilies, roasted gram, and salt with a little water.',
                    'Serve hot idlis with generous amounts of sambar and chutney.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS', 'IRON', 'VITAMIN_B'],
                moodTags: ['calm', 'peaceful']
            },
            {
                id: 'masala-dosa',
                title: 'Masala Dosa',
                description: 'Crispy dosa stuffed with spiced potato',
                image: '',
                time: 40,
                servings: 2,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '2 cups Dosa Batter (fermented Rice & Urad Dal)',
                    '3 large Potatoes, boiled and mashed',
                    '2 medium Onions, sliced',
                    '2-3 Green chilies, chopped',
                    '1/2 tsp Turmeric powder',
                    '1 tsp Mustard seeds',
                    '1 tsp Chana dal',
                    'A sprig of Curry leaves',
                    'Oil or Ghee for cooking',
                    'Salt to taste'
                ],
                instructions: [
                    'To make the filling: Heat 1 tbsp oil in a pan. Add mustard seeds, chana dal, and curry leaves.',
                    'Add sliced onions and green chilies. Sauté until onions are translucent.',
                    'Add turmeric and salt. Mix in the mashed potatoes and cook for 2-3 minutes. Set aside.',
                    'Heat a flat non-stick tawa. Wipe with a damp cloth if too hot.',
                    'Pour a ladle of batter and spread it in a thin, circular motion from the center outwards.',
                    'Drizzle 1 tsp oil or ghee around the edges and on top. Cook until bottom is golden and crispy.',
                    'Place a heap of the potato filling in the center and fold the dosa over it.',
                    'Serve hot with sambar and coconut chutney.'
                ],
                nutrients: ['COMPLEX_CARBS'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'poha',
                title: 'Poha',
                description: 'Flattened rice tempered with spices and peanuts',
                image: '',
                time: 15,
                servings: 2,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '2 cups Thick Poha (Flattened Rice)',
                    '1 large Onion (finely chopped)',
                    '1 Potato (cubed and boiled)',
                    '2-3 Green Chilies (slit)',
                    '1/4 cup Peanuts',
                    '1/2 tsp Turmeric Powder',
                    '1 tsp Mustard Seeds',
                    'Fresh Coriander leaves',
                    'Lemon juice'
                ],
                instructions: [
                    'Rinse poha in a colander under running water for a minute. Drain and set aside.',
                    'Heat oil in a pan. Fry peanuts until crunchy and set aside.',
                    'In the same oil, add mustard seeds, curry leaves, green chilies, and onions. Sauté until onions are soft.',
                    'Add turmeric and salt. Add the boiled potatoes and mix.',
                    'Add the softened poha and roasted peanuts. Gently mix everything together.',
                    'Cover and steam on low heat for 2 minutes.',
                    'Garnish with fresh coriander and a squeeze of lemon juice before serving.'
                ],
                nutrients: ['IRON', 'COMPLEX_CARBS', 'MAGNESIUM'],
                moodTags: ['tired', 'stressed']
            },
            {
                id: 'upma',
                title: 'Upma',
                description: 'Semolina porridge with vegetables',
                image: '',
                time: 20,
                servings: 2,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '1 cup Semolina (Rava/Sooji)',
                    '1 Onion (chopped)',
                    '1/2 cup Mixed Vegetables (Carrots, Peas, Beans)',
                    '2 Green Chilies',
                    '1 inch Ginger (grated)',
                    '1 tsp Mustard Seeds',
                    '1 tsp Chana Dal',
                    '2.5 cups Water',
                    'Cashews (optional)'
                ],
                instructions: [
                    'Dry roast semolina in a pan until fragrant (do not brown). Set aside.',
                    'Heat oil/ghee in the pan. Add mustard seeds, chana dal, and cashews.',
                    'Add onions, ginger, and green chilies. Sauté until onions turn pink.',
                    'Add the mixed vegetables and sauté for a couple of minutes.',
                    'Pour in water and add salt. Bring it to a rolling boil.',
                    'Lower the heat and slowly add roasted semolina while stirring continuously to prevent lumps.',
                    'Cover and cook on low heat for 3-4 minutes until water is absorbed.',
                    'Fluff with a fork and serve hot.'
                ],
                nutrients: ['COMPLEX_CARBS', 'MAGNESIUM'],
                moodTags: ['calm', 'peaceful']
            },
            {
                id: 'aloo-paratha-curd',
                title: 'Aloo Paratha with Curd',
                description: 'Stuffed potato paratha with curd',
                image: '',
                time: 30,
                servings: 2,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '2 cups Whole Wheat Flour',
                    '4 large Potatoes (boiled and peeled)',
                    '2 Green Chilies (finely chopped)',
                    '1 tsp Cumin Powder',
                    '1 tsp Garam Masala',
                    '1/2 tsp Red Chili Powder',
                    'Fresh Coriander',
                    'Butter or Ghee',
                    '1 cup Fresh Curd/Yogurt'
                ],
                instructions: [
                    'Mash the boiled potatoes well. Add chopped chilies, spices, salt, and coriander. Mix to form the filling.',
                    'Knead wheat flour with water and pinch of salt to make a soft dough.',
                    'Divide dough into balls. Roll out a small circle, place potato filling in the center.',
                    'Seal the edges and roll out gently into a thick flatbread.',
                    'Heat a tawa (griddle). Cook the paratha on both sides using ghee/oil until golden brown spots appear.',
                    'Serve hot with a dollop of butter and a bowl of fresh curd.'
                ],
                nutrients: ['COMPLEX_CARBS'],
                moodTags: ['sad', 'anxious']
            },
            {
                id: 'poori-bhaji',
                title: 'Poori Bhaji',
                description: 'Fried bread with spiced potato curry',
                image: '',
                time: 35,
                servings: 2,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '2 cups Whole Wheat Flour',
                    '4 Potatoes (boiled and cubed)',
                    '2 Onions (sliced)',
                    '2 Green Chilies',
                    '1 tsp Mustard Seeds',
                    '1/2 tsp Turmeric Powder',
                    '1 tbsp Oil (for curry) + Oil for frying',
                    'Salt to taste'
                ],
                instructions: [
                    'Mix flour, salt, and water to knead a stiff dough. Rest for 10 mins.',
                    'For Bhaji: Heat oil, add mustard seeds, chilies, and onions. Sauté until soft.',
                    'Add turmeric and salt. Add boiled potatoes and mash slightly. Add a little water for gravy.',
                    'Simmer for 5 minutes. Garnish with coriander.',
                    'Divide dough into balls, roll into small circles.',
                    'Deep fry pooris in hot oil until they puff up.',
                    'Serve hot pooris with potato bhaji.'
                ],
                nutrients: ['COMPLEX_CARBS'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'veg-sandwich',
                title: 'Veg Sandwich',
                description: 'Fresh vegetable sandwich',
                image: '',
                time: 10,
                servings: 1,
                difficulty: 'Easy',
                rating: 3,
                ingredients: [
                    '4 slices Bread',
                    '1 Cucumber (sliced)',
                    '1 Tomato (sliced)',
                    '1 Onion (sliced)',
                    '2 tbsp Green Chutney',
                    'Butter',
                    'Chaat Masala'
                ],
                instructions: [
                    'Butter the bread slices on one side.',
                    'Spread green chutney on the buttered side.',
                    'Place slices of cucumber, tomato, and onion on one slice.',
                    'Sprinkle chaat masala and salt.',
                    'Cover with the other slice.',
                    'Serve fresh or grill if desired.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'dhokla',
                title: 'Dhokla',
                description: 'Steamed gram flour spongy cake',
                image: '',
                time: 25,
                servings: 4,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '1.5 cups Gram Flour (Besan)',
                    '1 tbsp Semolina (Rava)',
                    '1 tsp Ginger-Green Chili Paste',
                    '1 tsp Eno/Fruit Salt',
                    '1 tbsp Lemon Juice',
                    '1 tsp Sugar',
                    'For Tempering: Mustard seeds, Curry leaves, Green Chilies'
                ],
                instructions: [
                    'Mix besan, rava, sugar, ginger-chili paste, lemon juice, salt, and water to make a smooth batter.',
                    'Just before steaming, add Eno and mix gently. The batter will froth.',
                    'Pour immediately into a greased thali.',
                    'Steam for 15-20 minutes until a knife comes out clean.',
                    'For Tempering: Heat oil, crackle mustard seeds, add curry leaves and chilies with a little water/sugar mix.',
                    'Pour tempering over the cut dhokla pieces. Serve.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'stuffed-paratha',
                title: 'Stuffed Paratha (Paneer / Gobi / Mooli)',
                description: 'Paratha stuffed with paneer or veggies',
                image: '',
                time: 30,
                servings: 2,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '2 cups Wheat Flour Dough',
                    '1 cup Grated Stuffing (Paneer OR Cauliflower OR Radish)',
                    '1 tsp Ginger (grated)',
                    '1 Green Chili (chopped)',
                    '1 tsp Carom Seeds (Ajwain)',
                    'Salt and Spices to taste',
                    'Ghee/Oil'
                ],
                instructions: [
                    'Prepare the stuffing by mixing grated ingredient with spices, ginger, and chili.',
                    'Squeeze out excess water if using radish or cauliflower.',
                    'Take a ball of dough, roll slightly, place stuffing in center, and seal.',
                    'Roll out gently into a paratha.',
                    'Cook on a hot tawa with ghee until golden brown on both sides.',
                    'Serve hot with pickle and curd.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['tired', 'stressed']
            },
            {
                id: 'veg-uttapam',
                title: 'Veg Uttapam',
                description: 'Thick dosa topped with vegetables',
                image: '',
                time: 25,
                servings: 2,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '2 cups Dosa Batter',
                    '1 Onion (finely chopped)',
                    '1 Tomato (finely chopped)',
                    '1 Green Chili (chopped)',
                    'Coriander leaves',
                    'Oil for cooking'
                ],
                instructions: [
                    'Heat a tawa and grease with oil.',
                    'Pour a ladle of batter but do not spread it thin like dosa. Keep it thick.',
                    'Sprinkle chopped onions, tomatoes, chilies, and coriander on top.',
                    'Drizzle oil around the edges. Cover and cook for 2 minutes.',
                    'Flip carefully and cook the other side until roasted.',
                    'Serve hot with chutney.'
                ],
                nutrients: ['COMPLEX_CARBS'],
                moodTags: ['calm', 'peaceful']
            },
        ],
        nonveg: [
            {
                id: 'egg-omelette-bread',
                title: 'Egg Omelette with Bread',
                description: 'Masala omelette served with bread',
                image: '',
                time: 10,
                servings: 1,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '2 Eggs',
                    '1 Onion (chopped)',
                    '1 Green Chili',
                    '2 slices Bread',
                    'Salt, Pepper, Oil'
                ],
                instructions: [
                    'Beat eggs with onion, chili, salt, and pepper.',
                    'Pour onto a hot greased pan.',
                    'Cook until set, flip and cook the other side.',
                    'Serve with toasted bread.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'egg-bhurji',
                title: 'Egg Bhurji',
                description: 'Scrambled eggs with spices',
                image: '',
                time: 12,
                servings: 1,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '3 Eggs',
                    '1 Onion (chopped)',
                    '1 Tomato (chopped)',
                    '1 tsp Pav Bhaji Masala',
                    'Coriander'
                ],
                instructions: [
                    'Sauté onions and tomatoes in oil.',
                    'Add spices and mix.',
                    'Crack eggs into the pan and scramble until cooked.',
                    'Garnish with coriander.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'chicken-sandwich-bf',
                title: 'Chicken Sandwich',
                description: 'Shredded chicken sandwich',
                image: '',
                time: 15,
                servings: 1,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '1 cup Boiled Chicken (shredded)',
                    '2 slices Bread',
                    'Mayo/Yogurt',
                    'Pepper, Salt',
                    'Lettuce'
                ],
                instructions: [
                    'Mix chicken with mayo and seasoning.',
                    'Place lettuce on bread.',
                    'Add chicken mix and cover with second slice.',
                    'Serve.'
                ],
                nutrients: ['PROTEIN', 'HEALTHY_FATS'],
                moodTags: ['tired', 'stressed']
            },
            {
                id: 'egg-paratha',
                title: 'Egg Paratha',
                description: 'Paratha layered with egg',
                image: '',
                time: 20,
                servings: 1,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '1 Wheat Paratha (semi-cooked)',
                    '1 Egg',
                    'Salt, Pepper',
                    'Oil'
                ],
                instructions: [
                    'Beat egg with salt and pepper.',
                    'Heat oil on a tawa, place paratha.',
                    'Pour egg over paratha or cook egg and place paratha on top.',
                    'Cook until egg is set and paratha is crisp.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['calm', 'peaceful']
            },
            {
                id: 'chicken-stuffed-dosa',
                title: 'Chicken Stuffed Dosa',
                description: 'Dosa stuffed with spiced chicken',
                image: '',
                time: 35,
                servings: 2,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    'Dosa Batter',
                    '1 cup Minced Chicken (cooked with spices)',
                    'Onion, Coriander',
                    'Oil'
                ],
                instructions: [
                    'Prepare spicy chicken mince (keema).',
                    'Spread dosa batter on hot tawa.',
                    'Add chicken filling in the center.',
                    'Drizzle oil, cook until crisp, and fold.',
                    'Serve hot.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'egg-curry-paratha',
                title: 'Egg Curry with Paratha',
                description: 'Egg curry with paratha',
                image: '',
                time: 35,
                servings: 2,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '4 Boiled Eggs',
                    'Onion-Tomato Masala',
                    'Spices (Turmeric, Chili, Garam Masala)',
                    '2 Parathas'
                ],
                instructions: [
                    'Prepare gravy by sautéing onion-tomato paste with spices.',
                    'Add water and simmer.',
                    'Add boiled eggs (slit) and cook for 5 mins.',
                    'Serve hot with parathas.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['tired', 'stressed']
            }
        ]
    },
    lunch: {
        veg: [
            {
                id: 'dal-tadka-jeera-rice',
                title: 'Dal Tadka with Jeera Rice',
                description: 'Tempered dal with cumin rice',
                image: '',
                time: 35,
                servings: 2,
                difficulty: 'Easy',
                rating: 5,
                ingredients: [
                    '1 cup Toor Dal (Pigeon Peas)',
                    '1 tsp Turmeric powder',
                    '2 tbsp Ghee (for tempering)',
                    '1 tsp Cumin seeds',
                    '4-5 cloves Garlic, finely chopped',
                    '2 Dried Red chilies',
                    '1 cup Basmati Rice',
                    '1 tsp Cumin seeds (for Rice)',
                    'Fresh Coriander'
                ],
                instructions: [
                    'Wash and pressure cook toor dal with turmeric and salt until soft.',
                    'For Jeera Rice: Cook washed rice with cumin seeds and a pinch of salt until fluffy.',
                    'For Tadka: Heat ghee in a small pan. Add cumin seeds and let them splutter.',
                    'Add chopped garlic and sauté until golden brown. Add dried red chilies and a pinch of asafoetida (hing).',
                    'Pour this sizzling tempering over the cooked dal.',
                    'Garnish with fresh coriander and serve hot with jeera rice.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['calm', 'peaceful']
            },
            {
                id: 'rajma-chawal',
                title: 'Rajma Chawal',
                description: 'Kidney beans curry with rice',
                image: '',
                time: 45,
                servings: 3,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '1 cup Rajma (Kidney beans), soaked overnight',
                    '2 medium Onions, finely chopped',
                    '2 large Tomatoes, pureed',
                    '1 tbsp Ginger-Garlic paste',
                    '2 Green chilies, slit',
                    '1 tsp Cumin seeds',
                    '1 tsp Turmeric powder',
                    '1 tbsp Kashmiri Red chili powder',
                    '1 tbsp Rajma Masala or Garam masala',
                    '2 tbsp Oil or Ghee',
                    'Fresh coriander for garnish',
                    '2 cups Basmati Rice'
                ],
                instructions: [
                    'Pressure cook the soaked rajma with 4 cups of water and salt for 5-6 whistles until soft.',
                    'Heat oil in a heavy-bottomed pan. Add cumin seeds and let them crackle.',
                    'Add chopped onions and sauté until golden brown. Stir in the ginger-garlic paste and green chilies.',
                    'Add tomato puree and cook until the oil starts separating from the masala.',
                    'Add turmeric, red chili powder, and rajma masala. Mix well.',
                    'Add the cooked rajma along with its water. Simmer on low heat for 15-20 minutes until the gravy thickens.',
                    'Lightly mash some beans with the back of a spoon to make the gravy creamier.',
                    'Garnish with fresh coriander and serve hot with steamed basmati rice.'
                ],
                nutrients: ['PROTEIN', 'FIBER', 'IRON', 'MAGNESIUM'],
                moodTags: ['sad', 'anxious']
            },
            {
                id: 'chole-bhature',
                title: 'Chole Bhature',
                description: 'Chickpea curry with fried bread',
                image: '',
                time: 50,
                servings: 3,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '2 cups Kabuli Chana (Chickpeas), soaked 8 hours',
                    '2 tea bags (for dark color)',
                    '2 Onions, finely chopped',
                    '1 tbsp Ginger-Garlic paste',
                    '2 tbsp Chole Masala',
                    'For Bhature: 2 cups Maida (All-purpose flour)',
                    '1/2 cup Curd',
                    '1/4 tsp Baking soda',
                    'Oil for deep frying'
                ],
                instructions: [
                    'Pressure cook chickpeas with tea bags, salt, and water until tender. Discard tea bags.',
                    'For Bhature: Mix maida, curd, baking soda, and salt. Knead into a soft dough and rest for 2 hours.',
                    'In a pan, heat oil and sauté onions until dark brown. Add ginger-garlic paste.',
                    'Add spice powders and chole masala. Cook with a splash of water to prevent burning.',
                    'Add the chickpeas and some of the boiling water. Simmer until the sauce is thick.',
                    'Heat oil in a deep x-kadai. Roll out bhature and fry until puffed and golden.',
                    'Serve hot with sliced onions, green chilies, and pickle.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'paneer-butter-masala-naan',
                title: 'Paneer Butter Masala with Naan',
                description: 'Rich paneer curry with naan',
                image: '',
                time: 45,
                servings: 3,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '250g Paneer cubes',
                    '3 large Tomatoes, chopped',
                    '10-12 Cashews, soaked',
                    '2 tbsp Butter',
                    '1 tsp Ginger-Garlic paste',
                    '1 tsp Kashmiri Red chili powder',
                    '1/2 tsp Garam masala',
                    '1 tsp Kasuri Methi (Dried fenugreek)',
                    '2 tbsp Fresh cream',
                    'Wheat flour for Naan'
                ],
                instructions: [
                    'Blanch tomatoes and cashews, then blend into a smooth paste.',
                    'Heat butter in a pan. Add ginger-garlic paste and sauté.',
                    'Add the tomato-cashew puree and cook until butter starts to leave the sides.',
                    'Add red chili powder, salt, and garam masala. Mix in the paneer cubes.',
                    'Simmer for 5 minutes. Crush kasuri methi between your palms and add it.',
                    'Stir in fresh cream and turn off the heat.',
                    'Prepare naan on a tawa or in an oven. Brush with butter.',
                    'Serve the rich paneer curry with hot butter naan.'
                ],
                nutrients: ['PROTEIN', 'HEALTHY_FATS']
            },
            {
                id: 'veg-pulao-raita',
                title: 'Veg Pulao with Raita',
                description: 'Aromatic rice with yogurt',
                image: '',
                time: 30,
                servings: 3,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '1 cup Basmati Rice, washed and soaked',
                    '1 cup Mixed Vegetables (Carrots, Peas, Beans)',
                    'Whole Spices (Cinnamon, Cardamom, Cloves, Bay leaf)',
                    '1 Onion, sliced',
                    '1 tsp Ginger-Garlic paste',
                    '2 cups Water',
                    '1 cup fresh Yogurt (for Raita)',
                    '1/2 cup Cucumber, finely chopped'
                ],
                instructions: [
                    'Heat oil/ghee in a pot. Add whole spices and let them release their aroma.',
                    'Add sliced onions and sauté until translucent. Add ginger-garlic paste.',
                    'Add mixed vegetables and sauté for 2-3 minutes.',
                    'Add soaked rice and water. Bring to a boil, then cover and simmer on low heat for 12-15 minutes until rice is cooked.',
                    'For Raita: Whisk yogurt with salt, roasted cumin powder, and chopped cucumber.',
                    'Fluff the pulao gently with a fork and serve hot with raita.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'mixed-veg-curry-chapati',
                title: 'Mixed Veg Curry with Chapati',
                description: 'Assorted veggie curry with chapati',
                image: '',
                time: 35,
                servings: 3,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '2 cups Mixed Vegetables (Potatoes, Cauliflower, Beans, Carrots)',
                    '1 large Onion, finely chopped',
                    '2 small Tomatoes, pureed',
                    '1 tbsp Ginger-Garlic paste',
                    '1 tsp Turmeric, 1 tsp Chili powder, 1 tsp Garam masala',
                    'Fresh Coriander',
                    '2 cups Whole Wheat flour (for Chapati)'
                ],
                instructions: [
                    'Heat oil in a pan. Add cumin seeds and chopped onions. Sauté until golden.',
                    'Stir in ginger-garlic paste followed by tomato puree.',
                    'Add all the spice powders and sauté until oil separates.',
                    'Add the mixed vegetables and a small splash of water. Cover and cook until tender.',
                    'Prepare soft chapatis on a tawa.',
                    'Garnish the curry with coriander and serve hot with chapatis.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'palak-paneer-rice',
                title: 'Palak Paneer with Rice',
                description: 'Spinach and paneer curry with rice',
                image: '',
                time: 35,
                servings: 2,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '250g Spinach, blanched and pureed',
                    '200g Paneer cubes',
                    '1 large Onion, finely chopped',
                    '1 tsp Ginger-Garlic paste',
                    '1 tsp Garam masala',
                    '2 tbsp Fresh cream',
                    '1.5 cups Rice'
                ],
                instructions: [
                    'Heat oil in a pan. Sauté onions and ginger-garlic paste.',
                    'Add the spinach puree and cook for 5 minutes. Stir in the paneer cubes.',
                    'Add garam masala and salt. Simmer for 3 minutes.',
                    'Stir in fresh cream and turn off the heat.',
                    'Cook rice separately until fluffy.',
                    'Serve the creamy palak paneer with hot steamed rice.'
                ],
                nutrients: ['IRON', 'PROTEIN', 'MAGNESIUM', 'VITAMIN_B'],
                moodTags: ['tired', 'stressed']
            },
            {
                id: 'curd-rice',
                title: 'Curd Rice with Pickle',
                description: 'Cooling curd rice with pickle',
                image: '',
                time: 20,
                servings: 2,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '2 cups cooked Mushy Rice',
                    '1 cup fresh Yogurt',
                    'Tempering: Mustard seeds, Curry leaves, 1 Dried Red chili',
                    '1/4 cup Pomegranate pearls (optional)',
                    'Mango or Lime Pickle'
                ],
                instructions: [
                    'Mix the cooled, mushy rice with yogurt and salt. Consistency should be semi-thick.',
                    'Heat oil for tempering. Add mustard seeds and let them splutter.',
                    'Add curry leaves and red chili. Sauté for 30 seconds.',
                    'Pour the tempering over the rice-yogurt mix and stir well.',
                    'Top with pomegranate pearls for crunch and sweetness.',
                    'Serve chilled or at room temperature with spicy pickle.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS']
            },
            {
                id: 'veg-thali-lunch',
                title: 'Veg Thali',
                description: 'Dal, rice, sabzi, roti, salad, dessert',
                image: '',
                time: 50,
                servings: 1,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    'Toor Dal', 'Basmati Rice', 'Jeera Aloo (Dry Sabzi)', '2 soft Rotis',
                    'Salad (Cucumber, Tomato, Onion)', 'Small bowl of Kheer (Dessert)'
                ],
                instructions: [
                    'Prepare small portions of each dish: thin dal, steamed rice, and sautéed potatoes with cumin.',
                    'Make fresh, soft whole wheat rotis.',
                    'Slice fresh vegetables for the salad.',
                    'Arrange all items in small bowls (katoris) inside a large round plate (thali).',
                    'Serve as a wholesome, balanced lunch.'
                ],
                nutrients: ['COMPLEX_CARBS', 'PROTEIN'],
                moodTags: ['tired', 'stressed']
            },
        ],
        nonveg: [
            {
                id: 'chicken-curry-rice',
                title: 'Chicken Curry with Rice',
                description: 'Spiced chicken curry with rice',
                image: '',
                time: 45,
                servings: 3,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '500g Chicken, cut into medium pieces',
                    '3 large Onions, finely chopped',
                    '2 large Tomatoes, chopped',
                    '1 tbsp Ginger-Garlic paste',
                    '2 tbsp Chicken Masala',
                    '1 tsp Turmeric powder',
                    '1 tbsp Red chili powder',
                    '4 cloves, 1 inch Cinnamon, 2 Green cardamoms',
                    '3 tbsp Oil',
                    'Fresh coriander for garnish',
                    '2 cups Basmati Rice'
                ],
                instructions: [
                    'Marinate chicken with turmeric, half the chili powder, and salt for 20 minutes.',
                    'Heat oil in a heavy pot. Add whole spices (cloves, cinnamon, cardamom) and let them splutter.',
                    'Add chopped onions and sauté until deep golden brown.',
                    'Add ginger-garlic paste and sauté for a minute until the raw smell goes away.',
                    'Add tomatoes and cook until they soften and oil starts to separate.',
                    'Add chicken masala and the remaining red chili powder. Add chicken pieces and sauté for 5 minutes on high heat.',
                    'Add 1.5 cups of water, cover, and cook on medium-low heat for 15-20 minutes until chicken is tender.',
                    'Garnish with coriander and serve hot with steamed rice.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['tired', 'stressed']
            },
            {
                id: 'butter-chicken-naan',
                title: 'Butter Chicken with Naan',
                description: 'Creamy butter chicken with naan',
                image: '',
                time: 50,
                servings: 3,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '300g Chicken Tikkas (grilled or pan-seared)',
                    'For Makhani Gravy: 3 large Tomatoes, 10-12 Cashews, 2 tbsp Butter',
                    '1 tsp Ginger-Garlic paste',
                    '2 tbsp Fresh cream, 1 tsp Kasuri Methi',
                    '2-3 soft Naans'
                ],
                instructions: [
                    'Blend tomatoes and cashews to a smooth puree. Sauté ginger-garlic paste in butter.',
                    'Add the puree and cook until oil separates. Stir in the chicken tikkas.',
                    'Add salt, red chili powder, and half a cup of water. Simmer for 5 minutes.',
                    'Add kasuri methi and fresh cream. Mix well and turn off the heat.',
                    'Brush naans with butter and serve hot with the creamy chicken.'
                ],
                nutrients: ['PROTEIN', 'HEALTHY_FATS'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'mutton-curry-rice',
                title: 'Mutton Curry with Rice',
                description: 'Rich mutton curry with rice',
                image: '',
                time: 60,
                servings: 3,
                difficulty: 'Hard',
                rating: 5,
                ingredients: [
                    '500g Mutton (Goat meat), cut into pieces',
                    '3 large Onions, sliced',
                    '1/2 cup thick Yogurt',
                    '1 tbsp Ginger-Garlic paste',
                    'Spices: Turmeric, Chili powder, Garam masala, Bay leaf',
                    '2 cups Basmati Rice'
                ],
                instructions: [
                    'Marinate mutton with yogurt and half the ginger-garlic paste for 1 hour.',
                    'In a pressure cooker, sauté onions with bay leaf until deep brown.',
                    'Add marinated mutton and sauté on high heat for 10 minutes.',
                    'Add spices and 2 cups of water. Pressure cook for 5-6 whistles until meat is tender.',
                    'Cook steamed basmati rice separately.',
                    'Serve the rich mutton curry with hot rice.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['sad', 'anxious']
            },
            {
                id: 'chicken-biryani',
                title: 'Chicken Biryani',
                description: 'Aromatic chicken biryani',
                image: '',
                time: 60,
                servings: 4,
                difficulty: 'Hard',
                rating: 5,
                ingredients: [
                    '500g Chicken, marinated in yogurt and biryani spices',
                    '2 cups Basmati Rice, par-boiled with cinnamon and cloves',
                    '2 large Onions, fried until crispy (Birista)',
                    'Saffron strands soaked in milk',
                    'Fresh Mint and Coriander'
                ],
                instructions: [
                    'Heat a heavy pot and cook the marinated chicken until half-done.',
                    'Layer the par-boiled rice over the chicken.',
                    'Sprinkle fried onions, mint, and saffron milk on top.',
                    'Cover tightly and cook on low steam (dum) for 20 minutes.',
                    'Mix gently from the sides and serve hot.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'fish-curry-rice',
                title: 'Fish Curry with Steamed Rice',
                description: 'Tangy fish curry',
                image: '',
                time: 40,
                servings: 3,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '500g Fish fillets (e.g., Kingfish or Pomfret)',
                    '1 cup Coconut milk or grated Coconut paste',
                    '1 tbsp Tamarind pulp',
                    '1 large Onion, chopped',
                    '2 large Tomatoes, chopped',
                    '2 cups Steamed Rice'
                ],
                instructions: [
                    'Heat oil, sauté onions and ginger-garlic paste. Add tomatoes and cook until soft.',
                    'Add turmeric, chili powder, and coriander powder.',
                    'Stir in the coconut milk and tamarind pulp. Bring to a light boil.',
                    'Add fish fillets and simmer for 5-7 minutes until cooked. Do not overcook.',
                    'Serve hot with plain steamed rice.'
                ],
                nutrients: ['PROTEIN', 'OMEGA_3', 'VITAMIN_D'],
                moodTags: ['calm', 'peaceful']
            },
            {
                id: 'egg-curry-chapati',
                title: 'Egg Curry with Chapati',
                description: 'Egg curry with chapati',
                image: '',
                time: 35,
                servings: 2,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '4 large Eggs, hard-boiled and peeled',
                    '2 medium Onions, finely chopped',
                    '2 large Tomatoes, pureed',
                    '1 tbsp Ginger-Garlic paste',
                    '2 Green chilies, slit',
                    '1 tsp Mustard seeds',
                    '1/2 tsp Turmeric powder',
                    '1 tbsp Egg Curry Masala or Garam masala',
                    '2-3 soft Chapatis'
                ],
                instructions: [
                    'Slightly slit the boiled eggs or prick with a fork. Sauté them with a pinch of turmeric and salt in a little oil until golden. Set aside.',
                    'In the same pan, heat more oil and add mustard seeds.',
                    'Add onions and sauté until dark pink. Stir in the ginger-garlic paste.',
                    'Add tomato puree and cook until oil separates. Add turmeric, chili powder, and egg curry masala.',
                    'Add 1 cup of water and bring to a simmer. Add the eggs into the gravy.',
                    'Cook for 5-7 minutes on low heat until the gravy thickens to your liking.',
                    'Serve hot with fresh chapatis.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['tired', 'stressed']
            },
            {
                id: 'prawn-curry',
                title: 'Prawn Curry',
                description: 'Coastal style prawn curry',
                image: '',
                time: 35,
                servings: 2,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '400g Prawns, cleaned and deveined',
                    '1 cup Coconut Milk',
                    '1 tbsp Tamarind paste',
                    'Malvani or Goan Curry Masala',
                    'Fresh Curry leaves',
                    '2 cups Steamed Rice'
                ],
                instructions: [
                    'Marinate prawns with turmeric and salt for 10 minutes.',
                    'Heat oil, add curry leaves and onions. Sauté until translucent.',
                    'Add the curry masala and tamarind paste. Pour in coconut milk.',
                    'Bring to a simmer and add prawns. Cook for 3-4 minutes until they curl.',
                    'Serve hot with steamed rice.'
                ],
                nutrients: ['PROTEIN', 'HEALTHY_FATS'],
                moodTags: ['calm', 'peaceful']
            },
            {
                id: 'chicken-thali',
                title: 'Chicken Thali',
                description: 'Rice, roti, chicken curry, salad, pickle',
                image: '',
                time: 55,
                servings: 1,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    'Chicken Curry (Home-style)',
                    'Steamed Rice',
                    '2 soft Whole Wheat Rotis',
                    'Kachumber Salad (Onion, Tomato, Cucumber)',
                    'Lemon wedge and Green chili'
                ],
                instructions: [
                    'Prepare a simple chicken curry with onion-tomato gravy.',
                    'Cook fresh rice and rotis.',
                    'Assemble the meal in a thali with a portion of each item.',
                    'Garnish with fresh coriander and serve as a complete nutritious lunch.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['stressed', 'tired']
            }
        ]
    },
    snacks: {
        veg: [
            {
                id: 'samosa',
                title: 'Samosa',
                description: 'Crispy pastry with spiced potato filling',
                image: '',
                time: 40,
                servings: 4,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '2 cups Whole Wheat Flour (for crust)',
                    '4 medium Potatoes, boiled and mashed',
                    '1/2 cup Green peas',
                    '1 tsp Cumin seeds',
                    '1 tsp Coriander powder',
                    '1/2 tsp Garam masala',
                    '1/2 tsp Dry mango powder (Amchur)',
                    '2 Green chilies, chopped',
                    'Oil for deep frying'
                ],
                instructions: [
                    'For the dough: Knead flour with salt, oil, and water into a stiff dough. Rest for 30 minutes.',
                    'For the filling: Heat 2 tsp oil, add cumin, chilies, mashed potatoes, peas, and all spices. Sauté for 5 minutes.',
                    'Divide dough into balls. Roll into a circle, cut in half to make two semi-circles.',
                    'Fold each semi-circle into a cone, fill with potato mixture, and seal the edges with a little water.',
                    'Deep fry on low-medium heat until the crust is golden and crispy.',
                    'Serve hot with tamarind and mint chutney.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'pakora',
                title: 'Pakora',
                description: 'Onion, potato, or paneer fritters',
                image: '',
                time: 25,
                servings: 4,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '1 cup Gram Flour (Besan)',
                    '2 medium Onions (sliced) or 1 large Potato (sliced)',
                    '2 Green chilies, chopped',
                    '1/4 tsp Turmeric, 1/2 tsp Carom seeds (Ajwain)',
                    'Fresh Coriander',
                    'Oil for deep frying'
                ],
                instructions: [
                    'In a bowl, mix besan, spices, chilies, and coriander. Add a little water to make a thick batter.',
                    'Add onion or potato slices to the batter and coat them well.',
                    'Heat oil in a kadai on medium heat.',
                    'Drop small portions of the coated veggies into the hot oil.',
                    'Deep fry until golden brown and crispy on all sides.',
                    'Serve hot with green chutney or masala tea.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'bhel-puri',
                title: 'Bhel Puri',
                description: 'Tangy puffed rice chaat',
                image: '',
                time: 10,
                servings: 2,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '2 cups Puffed Rice (Kurmura)',
                    '1/2 cup Finely chopped Onions and Tomatoes',
                    '1/4 cup Boiled and cubed Potatoes',
                    '2 tbsp Tamarind Chutney, 1 tbsp Green Chutney',
                    'Fine Sev and Papdi for crunch',
                    'Fresh Coriander and Lemon juice'
                ],
                instructions: [
                    'In a large mixing bowl, add puffed rice and all the chopped vegetables.',
                    'Drizzle tamarind and green chutneys according to your taste (sweet and spicy).',
                    'Add a handful of papdis crushed with your hands and half of the sev.',
                    'Give it a very quick toss so the puffed rice doesn\'t get soggy.',
                    'Garnish with plenty of coriander, remaining sev, and a squeeze of lemon.',
                    'Serve immediately for the best crunch.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'sev-puri',
                title: 'Sev Puri',
                description: 'Crispy puris with chutneys and veggies',
                image: '',
                time: 15,
                servings: 2,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '12-15 Flat Crispy Puris (Papdi)',
                    '1 cup Boiled and mashed Potatoes (seasoned with salt)',
                    'Sweet Tamarind, Spicy Green and Garlic Chutneys',
                    'Fine Sev (Nylon Sev)',
                    'Chaat masala and Masala Peanuts'
                ],
                instructions: [
                    'Arrange the flat puris on a plate.',
                    'Place a small portion of seasoned mashed potatoes on each puri.',
                    'Add a drop of green, tamarind, and garlic chutney on top of the potatoes.',
                    'Generously cover each puri with fine sev.',
                    'Sprinkle chaat masala and garnish with coriander and a few peanuts.',
                    'Serve immediately as a refreshing street snack.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'pav-bhaji',
                title: 'Pav Bhaji',
                description: 'Buttered buns with spicy mashed veg',
                image: '',
                time: 30,
                servings: 2,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '3 large Potatoes, 1 cup Cauliflower, 1/2 cup Peas (boiled and mashed)',
                    '2 medium Onions, finely chopped',
                    '2 large Tomatoes, chopped',
                    '1/2 cup Capsicum, finely chopped',
                    '2 tbsp Butter',
                    '2 tbsp Pav Bhaji Masala',
                    '1 tsp Red chili powder',
                    '4-6 Pav buns'
                ],
                instructions: [
                    'Heat butter in a large flat pan. Sauté onions and ginger-garlic paste.',
                    'Add tomatoes and capsicum; cook until soft. Stir in pav bhaji masala and chili powder.',
                    'Add the boiled and mashed vegetables. Mix well and add a splash of water.',
                    'Use a masher to mash everything together on the pan until smooth and well blended.',
                    'Simmer for 10 minutes, adding more butter and coriander on top.',
                    'Slit pav buns, butter them, and toast on the same pan.',
                    'Serve hot bhaji with toasted pav, a slice of lemon, and chopped onions.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'veg-puff-roll',
                title: 'Veg Puff / Veg Roll',
                description: 'Flaky pastry or roll with veg filling',
                image: '',
                time: 30,
                servings: 2,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '2 Puff Pastry sheets (store-bought or homemade)',
                    '1 cup Mixed Veggie filling (Potato, Peas, Carrot sautéed with spices)',
                    '1 Egg or Milk (for wash/glaze)',
                    'Butter for greasing'
                ],
                instructions: [
                    'Preheat oven to 200°C (400°F).',
                    'Cut the pastry sheets into squares. Place a spoonful of the veggie filling in the center.',
                    'Fold the pastry over the filling and seal the edges by pressing with a fork.',
                    'Place on a greased baking tray and brush the tops with egg or milk wash.',
                    'Bake for 15-20 minutes until the puffs are golden brown and flaky.',
                    'Serve hot with tomato ketchup.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'vada-pav',
                title: 'Vada Pav',
                description: 'Potato fritter slider',
                image: '',
                time: 25,
                servings: 2,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '4 Batata Vadas (Spiced Potato fritters)',
                    '4 fresh Pav buns',
                    'Dry Garlic Chutney (Lehsun Chutney)',
                    'Green Mint-Cilantro Chutney',
                    'Salted Fried Green chilies'
                ],
                instructions: [
                    'Slit the pav buns horizontally, keeping one side attached.',
                    'Spread green chutney on one side and a generous amount of dry garlic chutney on the other.',
                    'Place a hot, freshly fried batata vada in the center of each pav.',
                    'Press the pav slightly to flatten the vada.',
                    'Serve immediately with a fried green chili on the side.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'veg-momos',
                title: 'Veg Momos',
                description: 'Steamed vegetable dumplings',
                image: '',
                time: 35,
                servings: 3,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '1 cup All-purpose flour (for dough)',
                    '1 cup Finely chopped Cabbage, Carrots, and Spring onions',
                    '1 tsp Ginger-Garlic paste',
                    '1 tsp Soy sauce',
                    'Black pepper and Salt'
                ],
                instructions: [
                    'Knead a soft dough with flour, water, and salt. Rest for 30 minutes.',
                    'Sauté the vegetables with ginger-garlic paste, soy sauce, and pepper for 2 minutes on high heat. Let it cool.',
                    'Roll out small, thin circles from the dough.',
                    'Place a spoonful of filling in the center and fold/pleat the edges to seal.',
                    'Steam in a greased steamer for 10-12 minutes until the skin looks translucent.',
                    'Serve hot with a spicy red chili momo chutney.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'aloo-tikki',
                title: 'Aloo Tikki',
                description: 'Crispy potato patties',
                image: '',
                time: 25,
                servings: 3,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '3 large Potatoes, boiled and mashed',
                    '1/4 cup Cornflour or Breadcrumbs (for binding)',
                    '1 tsp Cumin powder, 1/2 tsp Amchur',
                    '2 Green chilies, finely chopped',
                    'Oil for shallow frying'
                ],
                instructions: [
                    'In a large bowl, mix mashed potatoes with all the spices, chilies, and cornflour.',
                    'Divide the mixture and shape into flat, round patties.',
                    'Heat a little oil in a non-stick pan.',
                    'Place the tikkis on the pan and cook on medium heat.',
                    'Flip and cook until both sides are golden brown and very crispy.',
                    'Serve as is with chutney or as a base for Aloo Tikki Chaat.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'dabeli',
                title: 'Dabeli',
                description: 'Kutchi street food slider',
                image: '',
                time: 25,
                servings: 2,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '4 Pav buns',
                    '1.5 cups Spiced Potato filling (prepared with Dabeli masala)',
                    '1/2 cup Masala Peanuts',
                    '1/2 cup Pomegranate pearls',
                    'Tamarind and Garlic chutneys'
                ],
                instructions: [
                    'Prepare the dabeli potato filling by mixing boiled potatoes with dabeli masala and a little water.',
                    'Slit the pav and spread tamarind chutney inside.',
                    'Stuff with a thick layer of the potato mixture.',
                    'Top with masala peanuts, pomegranate pearls, and sev.',
                    'Toast the stuffed pav on a tawa with a little butter until slightly crisp.',
                    'Serve hot, garnished with more peanuts and sev on the edges.'
                ],
                nutrients: ['COMPLEX_CARBS']
            }
        ],
        nonveg: [
            {
                id: 'chicken-pakora',
                title: 'Chicken Pakora',
                description: 'Crispy chicken fritters',
                image: '',
                time: 25,
                servings: 2,
                difficulty: 'Easy',
                rating: 5,
                ingredients: [
                    '300g Chicken breast, cut into small cubes',
                    '1 cup Besan (Gram flour)',
                    '2 tbsp Rice flour (for extra crunch)',
                    '1 tsp Ginger-Garlic paste, 1 tsp Chili powder',
                    'Oil for deep frying'
                ],
                instructions: [
                    'Marinate chicken cubes with ginger-garlic paste, chili powder, and salt for 15 minutes.',
                    'Add besan, rice flour, and a splash of water to the marinated chicken to create a thick coating.',
                    'Heat oil in a kadai. Once hot, drop the chicken pieces one by one.',
                    'Fry on medium heat until the chicken is cooked through and the outer layer is golden brown.',
                    'Drain on paper towels and serve hot with mint chutney.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'chicken-roll',
                title: 'Chicken Roll',
                description: 'Kathi-style chicken roll',
                image: '',
                time: 25,
                servings: 2,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '2 soft Parathas (Lachha or plain)',
                    '1 cup Bhuna Chicken (boneless pieces cooked in spices)',
                    '1 small Red Onion, thinly sliced',
                    '2 tbsp Mint Chutney and 1 tsp Chaat masala',
                    'Lemon wedges'
                ],
                instructions: [
                    'Heat the parathas on a tawa until warm and slightly crisp.',
                    'Place a generous portion of bhuna chicken in the middle of each paratha.',
                    'Top with sliced onions, mint chutney, and a sprinkle of chaat masala.',
                    'Squeeze some lemon juice over the filling.',
                    'Roll the paratha tightly and wrap the bottom half in foil or kitchen paper.',
                    'Serve hot and fresh.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['stressed', 'tired']
            },
            {
                id: 'chicken-momos',
                title: 'Chicken Momos',
                description: 'Steamed chicken dumplings',
                image: '',
                time: 35,
                servings: 3,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '1.5 cups All-purpose flour (for dough)',
                    '200g Chicken mince, finely ground',
                    '1 Onion, finely chopped, 1 tsp Ginger-Garlic paste',
                    '1 tbsp Soy sauce, 1 tsp Sesame oil',
                    'Black pepper and Salt'
                ],
                instructions: [
                    'Knead the flour with water and a pinch of salt into a smooth dough. Rest for 30 minutes.',
                    'Mix chicken mince with onion, ginger-garlic paste, soy sauce, sesame oil, and seasoning.',
                    'Roll out very thin small circles from the dough.',
                    'Place the chicken filling in the center and fold/pleat the edges to seal into momo shapes.',
                    'Steam in a greased steamer for 12-15 minutes until the chicken is fully cooked.',
                    'Serve hot with a spicy red chili dipping sauce.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['calm', 'peaceful']
            },
            {
                id: 'chicken-puff',
                title: 'Chicken Puff',
                description: 'Flaky chicken pastry',
                image: '',
                time: 30,
                servings: 2,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '2 Puff Pastry sheets',
                    '1 cup Spiced Chicken filling (cooked minced chicken with onions and garam masala)',
                    '1 Egg for wash (glaze)',
                    'Butter'
                ],
                instructions: [
                    'Preheat oven to 200°C (400°F).',
                    'Cut pastry sheets into rectangles or squares.',
                    'Place a spoonful of chicken filling on one half, and fold the other half over.',
                    'Seal the edges by pressing with a fork and brush with egg wash.',
                    'Bake for 15-20 minutes until the puffs are golden and crispy.',
                    'Serve hot with mint chutney.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['tired', 'stressed']
            },
            {
                id: 'egg-puff',
                title: 'Egg Puff',
                description: 'Flaky pastry with egg filling',
                image: '',
                time: 30,
                servings: 2,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '2 Puff Pastry sheets',
                    '2 Hard-boiled Eggs, halved',
                    '1 Onion, sautéed with turmeric, chili powder, and salt',
                    '1 Egg for wash'
                ],
                instructions: [
                    'Preheat oven to 200°C (400°F).',
                    'Divide the pastry into squares.',
                    'Place a small amount of the sautéed onion masala and half a boiled egg in the center of each square.',
                    'Bring the corners of the square to the center and seal them together.',
                    'Brush with egg wash and bake for 18-20 minutes until puffed and golden.',
                    'Serve as a warm savory snack.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['calm', 'peaceful']
            },
            {
                id: 'chicken-cutlet',
                title: 'Chicken Cutlet',
                description: 'Crispy chicken patties',
                image: '',
                time: 25,
                servings: 2,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '250g Minced Chicken',
                    '1 large Potato, boiled and mashed',
                    '1 tsp Ginger-Garlic paste, 1 Green chili (chopped)',
                    '1/2 tsp Garam masala, 1/2 tsp Pepper',
                    'Egg white and Breadcrumbs for coating',
                    'Oil for frying'
                ],
                instructions: [
                    'Mix minced chicken, mashed potato, ginger-garlic paste, chili, and spices well.',
                    'Shape the mixture into flat oval or round patties (cutlets).',
                    'Dip each cutlet into egg white and then coat thoroughly with breadcrumbs.',
                    'Heat oil in a pan and shallow fry the cutlets on both sides on medium heat.',
                    'Cook until they turn deep golden brown and crispy.',
                    'Serve hot with tomato sauce or onion rings.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'fish-fry',
                title: 'Fish Fry',
                description: 'Spiced shallow-fried fish',
                image: '',
                time: 20,
                servings: 2,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '4 Fish fillets (Tilapia, Pomfret or Surmai)',
                    '1 tbsp Kashmiri Red chili paste',
                    '1/2 tsp Turmeric, 1 tsp Ginger-Garlic paste',
                    '1 tbsp Semolina (Rava) or Rice flour (for coating)',
                    'Lemon wedges',
                    'Oil for frying'
                ],
                instructions: [
                    'Make a paste of chili powder, turmeric, ginger-garlic paste, lemon juice, and salt.',
                    'Apply the marinade evenly to the fish fillets and let them sit for 20 minutes.',
                    'Press each fillet onto the semolina/rice flour mix to coat both sides.',
                    'Heat oil on a shallow frying pan.',
                    'Fry the fish for 4-5 minutes on each side until the exterior is crisp and the fish is flaky.',
                    'Serve hot with a squeeze of lemon.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'chicken-65',
                title: 'Chicken 65',
                description: 'Spicy crispy chicken starter',
                image: '',
                time: 30,
                servings: 2,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '300g boneless Chicken cubes',
                    '1 tbsp Rice flour, 1 tbsp Cornflour',
                    '1 tbsp Yogurt, 1 tbsp Ginger-Garlic paste',
                    'Fresh Curry leaves and 2-3 slit Green chilies',
                    'Red Chili powder, Turmeric, Pepper',
                    'Oil for deep frying'
                ],
                instructions: [
                    'Marinate chicken with yogurt, ginger-garlic paste, and all spices for 30 minutes.',
                    'Mix in rice flour and cornflour to the marinated chicken.',
                    'Deep fry the chicken pieces in hot oil until they are red and crispy. Drain and set aside.',
                    'In a separate pan, heat 1 tsp oil, add curry leaves and slit green chilies.',
                    'Toss the fried chicken in this tempering for a minute to infuse the aroma.',
                    'Serve hot as a spicy starter.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'chicken-kebab',
                title: 'Chicken Kebab',
                description: 'Skewered grilled chicken',
                image: '',
                time: 35,
                servings: 3,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '400g Tandoori Chicken chunks (boneless)',
                    '1 cup Yogurt (thick)',
                    '1 tbsp Mustard oil',
                    '1 tsp Ginger-Garlic paste',
                    '1 tsp Red Chili powder, 1 tsp Garam masala, 1 tsp Kasuri Methi',
                    'Skewers'
                ],
                instructions: [
                    'Whisk yogurt with mustard oil and all spices/pastes to make the marinade.',
                    'Thoroughly coat the chicken chunks in the marinade and rest for at least 2 hours (preferably overnight).',
                    'Thread the marinated chicken onto skewers.',
                    'Grill in a preheated oven at 200°C or over a charcoal grill for 15-20 minutes, basting with butter/oil.',
                    'Ensure the chicken is slightly charred and tender.',
                    'Serve hot with mint-yogurt chutney and onion rings.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'chicken-sandwich-snack',
                title: 'Chicken Sandwich',
                description: 'Chicken sandwich snack',
                image: '',
                time: 15,
                servings: 1,
                difficulty: 'Easy',
                rating: 3,
                ingredients: [
                    '4 slices of Bread',
                    '1 cup shredded boiled Chicken',
                    '2 tbsp Mayonnaise or Greek Yogurt',
                    '1/2 tsp Black pepper and Salt',
                    'Butter'
                ],
                instructions: [
                    'In a small bowl, mix the shredded chicken with mayonnaise/yogurt, salt, and pepper.',
                    'Butter the bread slices on one side.',
                    'Spread the chicken mixture evenly on two slices of bread.',
                    'Cover with the other slices of bread.',
                    'Toast on a tawa with a little butter until golden brown on both sides.',
                    'Cut into triangles and serve warm.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['tired', 'stressed']
            }
        ]
    },
    dinner: {
        veg: [
            {
                id: 'paneer-butter-masala-naan-din',
                title: 'Paneer Butter Masala with Butter Naan',
                description: 'Rich paneer curry with buttery naan',
                image: '',
                time: 45,
                servings: 3,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '250g Paneer cubes',
                    '3 large Tomatoes, blended into a puree',
                    '2 tbsp Butter, 2 tbsp Fresh cream',
                    '1 tsp Ginger-Garlic paste, 1 tsp Kasuri Methi',
                    '1 tsp Garam masala, 1 tsp Chili powder',
                    '2 soft Butter Naans'
                ],
                instructions: [
                    'Sauté ginger-garlic paste in butter. Add tomato puree and cook until butter separates.',
                    'Add all the spices and salt. Stir in the paneer cubes.',
                    'Add a little water if needed and simmer for 5 minutes.',
                    'Crush kasuri methi and add it along with fresh cream.',
                    'Mix well and turn off the heat.',
                    'Serve hot with buttery warm naans.'
                ],
                nutrients: ['PROTEIN', 'HEALTHY_FATS'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'dal-makhani-rice',
                title: 'Dal Makhani with Rice',
                description: 'Slow-cooked black lentils with rice',
                image: '',
                time: 60,
                servings: 3,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '1 cup Black Urad Dal (soaked overnight)',
                    '1/4 cup Kidney beans (Rajma)',
                    '3 tbsp Butter, 2 tbsp Cream',
                    '1 large Onion, chopped, 1 tsp Ginger-Garlic paste',
                    '1 tsp Kashmiri Red chili powder, 1 tsp Garam masala',
                    '2 cups cooked Basmati Rice'
                ],
                instructions: [
                    'Pressure cook soaked dal and rajma with salt and a pinch of turmeric until very soft (8-10 whistles).',
                    'Heat butter in a pan, sauté onions and ginger-garlic paste.',
                    'Add chili powder and garam masala. Pour in the cooked dal and mash a few lentils with a spatula.',
                    'Simmer on very low heat for 20-30 minutes, adding more butter and cream as it thickens.',
                    'Adjust salt and finish with a little more cream.',
                    'Serve the rich, creamy dal with hot steamed rice.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'veg-biryani-raita',
                title: 'Veg Biryani with Raita',
                description: 'Aromatic veg biryani with raita',
                image: '',
                time: 60,
                servings: 4,
                difficulty: 'Hard',
                rating: 5,
                ingredients: [
                    '2 cups Basmati Rice, par-boiled with whole spices',
                    '2 cups Mixed Vegetables (Carrot, Beans, Peas, Cauliflower)',
                    '1 cup Curd (thick)',
                    '2 medium Onions, thinly sliced and fried until brown (Birista)',
                    '1 tbsp Ginger-Garlic paste',
                    '2 tbsp Biryani Masala',
                    '1 tsp Turmeric powder',
                    'A pinch of Saffron soaked in warm milk',
                    'Fresh Mint and Coriander leaves'
                ],
                instructions: [
                    'Marinate the vegetables in curd, biryani masala, ginger-garlic paste, turmeric, and half the fried onions for 30 minutes.',
                    'In a heavy-bottomed pot, cook the marinated vegetables until 80% done.',
                    'Layer the par-boiled rice over the vegetable mix.',
                    'Top with remaining fried onions, mint, coriander, and the saffron milk.',
                    'Seal the pot with dough or a tight lid (Dum process).',
                    'Cook on very low heat for 15-20 minutes until the flavors are locked in.',
                    'Serve hot with cucumber raita.'
                ],
                nutrients: ['COMPLEX_CARBS'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'kadai-paneer-roti',
                title: 'Kadai Paneer with Tandoori Roti',
                description: 'Spicy kadai paneer with roti',
                image: '',
                time: 40,
                servings: 3,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '250g Paneer cubes',
                    '1 medium Capsicum (Bell pepper), cubed',
                    '1 small Onion, cubed',
                    '2 tbsp Kadai Masala (coarsely ground coriander and red chilies)',
                    '1 tsp Ginger-Garlic paste',
                    '2 soft Tandoori Rotis'
                ],
                instructions: [
                    'Heat oil in a kadai. Sauté the cubed capsicum and onions for 2 minutes and set aside.',
                    'In the same oil, add ginger-garlic paste and Kadai masala.',
                    'Add tomato puree and cook until oil separates. Stir in the paneer cubes and sautéed veggies.',
                    'Add salt and a little water. Cover and cook for 5 minutes.',
                    'Garnish with fresh ginger juliennes and coriander.',
                    'Serve hot with tandoori rotis.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'veg-fried-rice-manchurian',
                title: 'Vegetable Fried Rice with Manchurian',
                description: 'Indo-Chinese combo',
                image: '',
                time: 40,
                servings: 3,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '2 cups cooked Rice (leftover works best)',
                    '1/2 cup Finely chopped Cabbage, Carrots, and Beans',
                    'For Manchurian: Mixed veggie balls fried and cooked in soy-chili gravy',
                    '1 tbsp Soy sauce, 1 tsp Vinegar',
                    'Spring onion greens'
                ],
                instructions: [
                    'Heat oil in a wok. Toss the chopped vegetables on high heat for 2 minutes.',
                    'Add cooked rice, soy sauce, vinegar, salt, and pepper.',
                    'Stir fry constantly on high heat for 3-4 minutes.',
                    'Prepare the Manchurian balls in a savory, slightly thick soy-based gravy.',
                    'Garnish the rice with spring onions.',
                    'Serve hot with the Manchurian gravy on the side.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'aloo-gobi-chapati',
                title: 'Aloo Gobi with Chapati',
                description: 'Potato-cauliflower curry with chapati',
                image: '',
                time: 30,
                servings: 2,
                difficulty: 'Easy',
                rating: 4,
                ingredients: [
                    '1 small Cauliflower, cut into florets',
                    '2 medium Potatoes, cubed',
                    '1 large Onion, chopped',
                    '1 tsp Ginger-Garlic paste',
                    '1 tsp Turmeric, 1 tsp Chili powder, 1 tsp Garam masala',
                    '2-3 soft Chapatis'
                ],
                instructions: [
                    'Heat oil, add cumin seeds and onions. Sauté until lightly browned.',
                    'Add ginger-garlic paste and chopped tomatoes. Cook until soft.',
                    'Add the potatoes, cauliflower florets, and all the dry spices.',
                    'Mix well, cover, and cook on low heat for 15-20 minutes until veggies are tender.',
                    'Avoid adding water; let it cook in its own steam.',
                    'Serve hot with fresh whole wheat chapatis.'
                ],
                nutrients: ['COMPLEX_CARBS']
            },
            {
                id: 'palak-paneer-rice-din',
                title: 'Palak Paneer with Rice',
                description: 'Spinach paneer with rice',
                image: '',
                time: 35,
                servings: 2,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '250g Spinach, washed and blanched',
                    '200g Paneer cubes',
                    '1 large Onion, chopped',
                    '1 tsp Ginger-Garlic paste',
                    '1 tsp Garam masala',
                    '2 cups cooked Basmati Rice'
                ],
                instructions: [
                    'Puree the blanched spinach. Sauté onions and ginger-garlic paste in a pan.',
                    'Add the spinach puree and spices. Cook for 5 minutes.',
                    'Gently stir in the paneer cubes. Simmer for 2-3 minutes.',
                    'Ensure the consistency is thick and creamy.',
                    'Garnish with a little cream or butter.',
                    'Serve with light and fluffy steamed rice.'
                ],
                nutrients: ['IRON', 'PROTEIN']
            },
            {
                id: 'malai-kofta-naan',
                title: 'Malai Kofta with Naan',
                description: 'Creamy kofta curry',
                image: '',
                time: 50,
                servings: 4,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    'For Koftas: 100g Paneer, 1 boiled Potato, 2 tbsp Cornflour, Raisins',
                    'For Gravy: 2 Onions, 10-12 Cashews, 1/4 cup Cream',
                    '1 tsp Ginger-Garlic paste',
                    '1 tsp Garam masala, 1 tsp Kasuri Methi',
                    '2 soft Naans'
                ],
                instructions: [
                    'Mash paneer and potato together. Add cornflour and raisins. Shape into balls and deep fry until golden.',
                    'To make gravy: Boil onions and cashews, then blend into a smooth white paste.',
                    'Cook the paste with spices, then stir in cream and kasuri methi.',
                    'Just before serving, place the koftas in the warm gravy.',
                    'Do not boil the koftas in gravy as they might break.',
                    'Serve immediately with warm buttered naans.'
                ],
                nutrients: ['HEALTHY_FATS']
            },
            {
                id: 'veg-thali-dinner',
                title: 'Veg Thali',
                description: 'Variety platter (veg)',
                image: '',
                time: 55,
                servings: 1,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    'Small bowl of Dal Makhani',
                    'Small portion of Mix Veg Sabzi',
                    '1 cup Jeera Rice',
                    '2 soft Whole Wheat Rotis',
                    'Fresh Salad and a helping of Pickle'
                ],
                instructions: [
                    'Prepare small, fresh portions of all the mentioned dishes.',
                    'Ensure the dal is creamy and the sabzi is aromatic.',
                    'Assemble each dish in small bowls on a traditional thali plate.',
                    'Garnish with fresh coriander and lemon slices.',
                    'Serve as a comprehensive and celebratory dinner thali.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS']
            }
        ],
        nonveg: [
            {
                id: 'chicken-biryani-raita',
                title: 'Chicken Biryani with Raita',
                description: 'Fragrant chicken biryani',
                image: '',
                time: 60,
                servings: 4,
                difficulty: 'Hard',
                rating: 5,
                ingredients: [
                    '500g Chicken, marinated in biryani spices and yogurt',
                    '2 cups long-grain Basmati Rice (par-boiled)',
                    '2 large Onions, sliced and fried crisp (Birista)',
                    'Saffron strands in warm milk',
                    '1 cup Mint-Cilantro Yogurt Raita'
                ],
                instructions: [
                    'Cook the marinated chicken until semi-tender in a heavy-bottomed pot.',
                    'Apply a layer of fried onions and mint over the chicken.',
                    'Spread the par-boiled rice evenly on top. Drizzle saffron milk and ghee.',
                    'Seal the pot with dough or a heavy lid and cook on dum for 20-25 minutes.',
                    'In a bowl, mix whisked yogurt with chopped mint, coriander, and salt for the raita.',
                    'Serve the aromatic biryani hot with the cooling raita.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'tandoori-chicken-naan',
                title: 'Tandoori Chicken with Naan',
                description: 'Grilled chicken with naan',
                image: '',
                time: 50,
                servings: 3,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '4 Chicken drumsticks or whole legs',
                    '1 cup thick Yogurt, 1 tbsp Tandoori Masala',
                    '1 tsp Red Chili powder, 1 tsp Ginger-Garlic paste',
                    '1 tbsp Mustard oil',
                    '2-3 soft Naans'
                ],
                instructions: [
                    'Make deep slits in the chicken legs. Marinate with lemon and salt for 15 minutes.',
                    'Apply the second marinade of yogurt, tandoori masala, and mustard oil. Rest for 3-4 hours.',
                    'Roast in an oven at 220°C or grill until charred and fully cooked through.',
                    'Brush with butter as it cooks.',
                    'Serve hot on a bed of onions with soft buttered naans.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'chicken-curry-rice-din',
                title: 'Chicken Curry with Rice',
                description: 'Classic chicken curry with rice',
                image: '',
                time: 45,
                servings: 3,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '500g Chicken, cut into cubes',
                    '1 large Onion, 2 Tomatoes, chopped',
                    '1 tsp Ginger-Garlic paste, 2 tbsp Chicken Masala',
                    '1 tsp Turmeric, 1 tsp Chili powder',
                    '2 cups cooked Basmati Rice'
                ],
                instructions: [
                    'Heat oil in a pot. Sauté onions until golden, then add ginger-garlic paste.',
                    'Add tomatoes and spices. Cook until the gravy base thickens and oil separates.',
                    'Add chicken cubes and sauté on high heat for 5 minutes.',
                    'Add a cup of water, cover, and simmer for 15 minutes until chicken is tender.',
                    'Adjust salt and garnish with fresh coriander.',
                    'Serve hot with steamed basmati rice.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['tired', 'stressed']
            },
            {
                id: 'mutton-rogan-josh-roti',
                title: 'Mutton Rogan Josh with Roti',
                description: 'Kashmiri mutton curry with roti',
                image: '',
                time: 60,
                servings: 3,
                difficulty: 'Hard',
                rating: 5,
                ingredients: [
                    '500g Mutton (Goat meat), cut into small pieces',
                    '1 cup Yogurt, 2 tsp Kashmiri Red chili powder',
                    '1 tsp Ginger powder (Sonth), 1 tsp Fennel powder (Saunf)',
                    'Whole Spices: Black cardamom, Cinnamon, Cloves',
                    '2 soft Rotis'
                ],
                instructions: [
                    'Heat oil in a pressure cooker. Add whole spices and the mutton. Sauté until lightly browned.',
                    'Add ginger and fennel powders. Stir well.',
                    'Mix red chili powder with a little water and add to the meat. Cook until it turns deep red.',
                    'Whisk yogurt and add it slowly while stirring continuously.',
                    'Add enough water and pressure cook for 6-7 whistles until the meat is melt-in-the-mouth tender.',
                    'Serve hot with soft, fresh rotis.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['sad', 'anxious']
            },
            {
                id: 'fish-curry-rice-din',
                title: 'Fish Curry with Steamed Rice',
                description: 'Coastal fish curry',
                image: '',
                time: 40,
                servings: 3,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '500g Fish fillets (Pomfret or Sear fish)',
                    '1 cup freshly grated Coconut, blended with 2 dry Red chilies',
                    '1 tbsp Tamarind pulp',
                    '1 tbsp Ginger-Garlic paste, 1 Green chili (slit)',
                    '1 tsp Turmeric, 1 tsp Coriander powder',
                    '2 cups Steamed Rice'
                ],
                instructions: [
                    'Sauté ginger-garlic paste and green chili in oil. Add the coconut-chili paste.',
                    'Add turmeric and coriander powder. Add a cup of water and bring to a simmer.',
                    'Stir in the tamarind pulp and salt.',
                    'Gently add the fish fillets. Cover and cook for 6-8 minutes on low heat.',
                    'Be careful not to over-stir as the fish might break.',
                    'Serve hot with plain steamed basmati rice.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['calm', 'peaceful']
            },
            {
                id: 'chicken-fried-rice-manchurian',
                title: 'Chicken Fried Rice with Manchurian',
                description: 'Indo-Chinese combo',
                image: '',
                time: 40,
                servings: 3,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '2 cups leftover Rice',
                    '1 cup shredded boiled Chicken',
                    '1/2 cup Finely chopped Carrots, Beans, and Spring onions',
                    '1 tbsp Soy sauce, 1 tsp Chili sauce',
                    'For Manchurian: 200g Chicken cubes fried in starch batter and cooked in soy-chili gravy'
                ],
                instructions: [
                    'Stir fry the vegetables and shredded chicken in a wok on high heat.',
                    'Add rice and all the sauces. Toss vigorously for 3 minutes.',
                    'Prepare the chicken manchurian by sautéing fried chicken cubes in a tangy soy-based gravy with ginger and garlic.',
                    'Season well with black pepper.',
                    'Garnish with spring onion greens.',
                    'Serve hot with the spicy manchurian gravy.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['happy', 'excited']
            },
            {
                id: 'chicken-tikka-masala-naan',
                title: 'Chicken Tikka Masala with Butter Naan',
                description: 'Creamy spiced chicken with naan',
                image: '',
                time: 50,
                servings: 3,
                difficulty: 'Medium',
                rating: 5,
                ingredients: [
                    '300g Chicken breast, cut into tikka-sized pieces',
                    'For Gravy: 3 Tomatoes, 1 Onion, 2 tbsp Butter, 2 tbsp Cream',
                    '1 tbsp Tandoori Masala, 1 tsp Ginger-Garlic paste',
                    '1 tsp Kasuri Methi, 1 tsp Honey',
                    '2 soft Butter Naans'
                ],
                instructions: [
                    'Marinate and grill chicken tikka pieces in an oven first.',
                    'Prepare the creamy masala gravy by sautéing onion-tomato paste in butter with all spices.',
                    'Stir in the grilled chicken tikkas and simmer for 5 minutes.',
                    'Add cream, honey, and kasuri methi. Mix well until the gravy is smooth and luscious.',
                    'Serve hot with warm butter naans.'
                ],
                nutrients: ['PROTEIN', 'HEALTHY_FATS'],
                moodTags: ['calm', 'peaceful']
            },
            {
                id: 'egg-curry-chapati-din',
                title: 'Egg Curry with Chapati',
                description: 'Egg curry with chapati',
                image: '',
                time: 35,
                servings: 2,
                difficulty: 'Medium',
                rating: 4,
                ingredients: [
                    '3 Boiled Eggs, halved',
                    '1 large Onion, 2 Tomatoes, chopped into a base masala',
                    '1 tsp Turmeric, 1 tsp Garam masala, 1 tsp Chili powder',
                    '2-3 soft Chapatis'
                ],
                instructions: [
                    'Prepare a thick onion-tomato masala by sautéing until oil separates.',
                    'Add all the dry spices and salt. Sauté for a minute.',
                    'Add half a cup of water and bring to a simmer.',
                    'Gently place the boiled egg halves in the gravy.',
                    'Cook on low heat for 5 minutes until the eggs absorb the flavors.',
                    'Serve hot with fresh chapatis.'
                ],
                nutrients: ['PROTEIN'],
                moodTags: ['tired', 'stressed']
            },
            {
                id: 'prawn-biryani',
                title: 'Prawn Biryani',
                description: 'Aromatic prawn biryani',
                image: '',
                time: 55,
                servings: 3,
                difficulty: 'Hard',
                rating: 5,
                ingredients: [
                    '500g large Prawns, cleaned and deveined',
                    '2 cups Basmati Rice, par-boiled with cinnamon and cloves',
                    '2 large Onions, fried crisp (Birista)',
                    '1 cup Mint and Cilantro, 1 tsp Ginger-Garlic paste',
                    'Biryani Masala'
                ],
                instructions: [
                    'Marinate prawns with ginger-garlic paste and biryani masala for 20 minutes.',
                    'Sauté the prawns in a heavy pot until half cooked.',
                    'Layer the par-boiled rice over the prawns. Add fried onions and fresh herbs.',
                    'Drizzle 1 tsp of oil or ghee over the rice.',
                    'Cover and cook on low steam (dum) for 15 minutes. Be careful not to overcook the prawns.',
                    'Mix gently and serve hot.'
                ],
                nutrients: ['PROTEIN', 'COMPLEX_CARBS'],
                moodTags: ['happy', 'excited']
            }
        ],
    },
};
