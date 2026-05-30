/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SuggestedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity: string;
}

export const FOOD_SUGGESTIONS: SuggestedFood[] = [
  // --- South Indian Tiffins (Breakfast) ---
  { name: 'Idli (2 pieces) with Sambar & Coconut Chutney', calories: 230, protein: 6, carbs: 45, fats: 4, quantity: '1 plate (2 idlis)' },
  { name: 'Masala Dosa with Sambar & Tomato Chutney', calories: 350, protein: 7, carbs: 55, fats: 11, quantity: '1 medium dosa' },
  { name: 'Medu Vada (2 pieces) with Sambar', calories: 320, protein: 8, carbs: 33, fats: 13, quantity: '1 plate (2 vadas)' },
  { name: 'Rava Upma with Roasted Cashews', calories: 270, protein: 6, carbs: 48, fats: 8, quantity: '1 bowl (200g)' },
  { name: 'Ven Pongal with Ghee & Coconut Chutney', calories: 360, protein: 8, carbs: 52, fats: 14, quantity: '1 bowl (250g)' },
  { name: 'Pesarattu (Green Gram Crepe) with Ginger Chutney', calories: 240, protein: 12, carbs: 34, fats: 6, quantity: '1 large crepe' },
  { name: 'Rava Dosa (Onion) with Sambar', calories: 310, protein: 5, carbs: 48, fats: 10, quantity: '1 medium dosa' },
  { name: 'Kerala Puttu with Kadala Curry', calories: 380, protein: 10, carbs: 60, fats: 11, quantity: '1 plate (Puttu & Curry)' },
  { name: 'Appam (2 pieces) with Sweet Coconut Milk', calories: 290, protein: 4, carbs: 48, fats: 9, quantity: '2 appams & sweet milk' },

  // --- North Indian & Popular Pan-Indian Dishes ---
  { name: 'Chicken Manchuria (Dry/Gravy)', calories: 440, protein: 28, carbs: 24, fats: 26, quantity: '1 medium plate (250g)' },
  { name: 'Veg Manchuria (Dry/Gravy)', calories: 310, protein: 6, carbs: 35, fats: 16, quantity: '1 medium plate (250g)' },
  { name: 'Tandoori Roti (Whole Wheat, plain)', calories: 110, protein: 4, carbs: 22, fats: 1, quantity: '1 plain roti' },
  { name: 'Tandoori Roti with Butter', calories: 150, protein: 4, carbs: 22, fats: 5, quantity: '1 butter roti' },
  { name: 'Butter Chicken (Murgh Makhani)', calories: 490, protein: 30, carbs: 14, fats: 35, quantity: '1 medium bowl (250g)' },
  { name: 'Paneer Tikka Masala (Cottage Cheese Curry)', calories: 380, protein: 15, carbs: 12, fats: 30, quantity: '1 medium bowl (250g)' },
  { name: 'Palak Paneer (Spinach and Cottage Cheese)', calories: 290, protein: 14, carbs: 10, fats: 22, quantity: '1 medium bowl (250g)' },
  { name: 'Dal Makhani (Slow-cooked black lentils & cream)', calories: 320, protein: 11, carbs: 38, fats: 14, quantity: '1 medium bowl (250g)' },
  { name: 'Chole Bhature (Chana Masala with fried flatbread)', calories: 580, protein: 14, carbs: 75, fats: 25, quantity: '1 plate (2 bhatures & chole)' },
  { name: 'Aloo Paratha with Butter & Pickle', calories: 390, protein: 7, carbs: 54, fats: 16, quantity: '1 large paratha' },
  { name: 'Garlic Naan (Clay-oven baked flatbread with garlic)', calories: 260, protein: 7, carbs: 48, fats: 4, quantity: '1 naan' },
  { name: 'Butter Naan', calories: 290, protein: 8, carbs: 48, fats: 8, quantity: '1 naan' },
  { name: 'Samosa (Potato & Peas filled pastry)', calories: 210, protein: 3, carbs: 24, fats: 12, quantity: '1 medium samosa' },
  { name: 'Tandoori Chicken (Roasted bone-in leg & breast)', calories: 270, protein: 35, carbs: 3, fats: 13, quantity: '2 pieces (half bird)' },
  { name: 'Paneer Tikka (Tandoor grilled skewered cottage cheese)', calories: 260, protein: 14, carbs: 8, fats: 19, quantity: '1 plate (6 cubes)' },
  { name: 'Jeera Rice (Cumin-tempered basmati rice)', calories: 220, protein: 4, carbs: 44, fats: 3, quantity: '1 plate (200g)' },
  { name: 'Steamed Basmati Rice', calories: 190, protein: 3, carbs: 41, fats: 0.5, quantity: '1 plate (200g)' },

  // --- South Indian Lunch & Dinner ---
  { name: 'Sambar Rice (Sambar Sadam) with Ghee', calories: 340, protein: 8, carbs: 62, fats: 6, quantity: '1 bowl (300g)' },
  { name: 'Curd Rice (Tayir Sadam) with Mustard Tempering', calories: 240, protein: 6, carbs: 38, fats: 7, quantity: '1 bowl (250g)' },
  { name: 'Steamed Ponni Rice, Pappu (Dal) & Dollop of Ghee', calories: 430, protein: 11, carbs: 68, fats: 12, quantity: '1 plate (350g)' },
  { name: 'Lemon Rice (Chitranna) with Roasted Peanuts', calories: 345, protein: 6, carbs: 54, fats: 12, quantity: '1 plate (250g)' },
  { name: 'Hyderabadi Veg Biryani with Mirchi ka Salan', calories: 410, protein: 9, carbs: 68, fats: 11, quantity: '1 plate (350g)' },
  { name: 'Malabar Parotta (2 pieces) with Veg Kurma', calories: 540, protein: 9, carbs: 78, fats: 21, quantity: '2 parottas & kurma' },
  { name: 'Rasam Rice (Rasam Sadam) with Roast Appalam', calories: 220, protein: 4, carbs: 44, fats: 3, quantity: '1 plate (300g)' },
  { name: 'Chicken Chettinad Curry with Steamed Rice', calories: 490, protein: 35, carbs: 45, fats: 18, quantity: '1 plate (400g)' },
  { name: 'Kerala Fish Moilee with Appam', calories: 450, protein: 26, carbs: 40, fats: 20, quantity: '1 portion (fish & appam)' },
  { name: 'Beetroot Poriyal / Cabbage Thoran (Coconut Stir-Fry)', calories: 110, protein: 2, carbs: 12, fats: 6, quantity: '1 cup (150g)' },

  // --- South Indian Snacks & Desserts ---
  { name: 'Banana Chips (Kerala Nendran Style)', calories: 155, protein: 1, carbs: 19, fats: 9, quantity: '1 small cup (30g)' },
  { name: 'Traditional Filter Coffee (with Milk & Jaggery/Sugar)', calories: 110, protein: 3, carbs: 14, fats: 4, quantity: '1 tumbler (150ml)' },
  { name: 'Elaneer Payasam (Tender Coconut Dessert)', calories: 210, protein: 3, carbs: 28, fats: 10, quantity: '1 cup (150ml)' },

  // --- Standard/General Fitness Foods ---
  { name: 'Boiled Egg (Large, brown or white)', calories: 75, protein: 6.5, carbs: 0.6, fats: 5, quantity: '1 egg' },
  { name: 'Whole Egg Omelette (Double egg cooked with drops of olive oil)', calories: 180, protein: 13, carbs: 1.5, fats: 14, quantity: '1 double egg omelette' },
  { name: 'Oatmeal with Almond Milk & Berries', calories: 290, protein: 9, carbs: 54, fats: 5, quantity: '1 bowl (300g)' },
  { name: 'Poached Eggs on Sourdough', calories: 310, protein: 16, carbs: 28, fats: 11, quantity: '2 slices & eggs' },
  { name: 'Greek Yogurt (Non-fat) with Berries', calories: 150, protein: 15, carbs: 18, fats: 1, quantity: '1 cup (200g)' },
  { name: 'Protein Shake (Whey Isolates & Water)', calories: 140, protein: 26, carbs: 3, fats: 2, quantity: '1 shake (300ml)' },
  { name: 'Smashed Avocado Toast with Chilli Flakes', calories: 260, protein: 6, carbs: 24, fats: 16, quantity: '1 slice (120g)' },
  { name: 'Grilled Salmon with Quinoa & Asparagus', calories: 480, protein: 36, carbs: 40, fats: 19, quantity: '1 plate (350g)' },
  { name: 'Glazed Teriyaki Chicken Breast & Rice', calories: 510, protein: 38, carbs: 62, fats: 8, quantity: '1 bowl (400g)' },
  { name: 'Mediteranean Tuna Salad with Olive Oil', calories: 340, protein: 28, carbs: 8, fats: 22, quantity: '1 portion (220g)' },
  { name: 'Lean Beef Sirloin Steak & Sweet Potato Mash', calories: 540, protein: 42, carbs: 38, fats: 14, quantity: '1 plate (380g)' },
  { name: 'Cottage Cheese with Pineapple chunks', calories: 180, protein: 13, carbs: 16, fats: 5, quantity: '1 cup (220g)' }
];
