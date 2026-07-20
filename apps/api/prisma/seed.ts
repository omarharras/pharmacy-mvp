import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: 'Medication',
    slug: 'medication',
    description: 'Everyday medicines and pharmacy essentials.',
    imageUrl: '/images/categories/medication.png',
    sortOrder: 1,
  },
  {
    name: 'Skin Care',
    slug: 'skin-care',
    description: 'Dermatology, cleansers, moisturizers, and sunscreen.',
    imageUrl: '/images/categories/skin-care.png',
    sortOrder: 2,
  },
  {
    name: 'Hair Care',
    slug: 'hair-care',
    description: 'Shampoo, treatments, oils, and scalp care.',
    imageUrl: '/images/categories/hair-care.png',
    sortOrder: 3,
  },
  {
    name: 'Cosmetics',
    slug: 'cosmetics',
    description: 'Makeup, lenses, beauty accessories, and cosmetics.',
    imageUrl: '/images/categories/cosmetics.png',
    sortOrder: 4,
  },
  {
    name: 'Mom & Baby care',
    slug: 'mom-baby-care',
    description: 'Baby feeding, diapers, bath care, and daily essentials.',
    imageUrl: '/images/categories/mom-baby-care.png',
    sortOrder: 5,
  },
  {
    name: 'Diet & Fitness',
    slug: 'diet-fitness',
    description: 'Nutrition, fitness support, and wellness essentials.',
    imageUrl: '/images/categories/diet-fitness.png',
    sortOrder: 6,
  },
  {
    name: 'Vitamins',
    slug: 'vitamins',
    description: 'Supplements for daily wellness and immunity.',
    imageUrl: '/images/categories/vitamins.png',
    sortOrder: 7,
  },
  {
    name: 'Daily-essentials',
    slug: 'daily-essentials',
    description: 'Everyday pharmacy and home health essentials.',
    imageUrl: '/images/categories/daily-essentials.png',
    sortOrder: 8,
  },
  {
    name: 'Dental-care',
    slug: 'dental-care',
    description: 'Toothpaste, brushes, mouthwash, and gum care.',
    imageUrl: '/images/categories/dental-care.png',
    sortOrder: 9,
  },
  {
    name: 'Men - care',
    slug: 'men-care',
    description: 'Men grooming, shaving, and personal care.',
    imageUrl: '/images/categories/men-care.png',
    sortOrder: 10,
  },
  {
    name: 'Personal-care',
    slug: 'personal-care',
    description: 'Personal hygiene, body care, and feminine care.',
    imageUrl: '/images/categories/personal-care.png',
    sortOrder: 11,
  },
  {
    name: 'Sexual Health',
    slug: 'sexual-health',
    description: 'Sexual wellness and family planning essentials.',
    imageUrl: '/images/categories/sexual-health.png',
    sortOrder: 12,
  },
  {
    name: 'Women Care',
    slug: 'women-care',
    description: 'Feminine care, period care, and women wellness essentials.',
    imageUrl: '/images/categories/women-care.png',
    sortOrder: 13,
  },
  {
    name: 'Medical Devices',
    slug: 'medical-devices',
    description: 'Home monitoring devices and practical health tools.',
    imageUrl: '/images/categories/medical-devices.png',
    sortOrder: 14,
  },
];

const productImagesByCategorySlug: Record<string, string> = {
  medication: '/images/products/medicines.jpg',
  'skin-care': '/images/products/skin-care.jpg',
  'hair-care': '/images/products/hair-care.jpg',
  cosmetics: '/images/products/personal-care.jpg',
  'mom-baby-care': '/images/products/baby-care.jpg',
  'diet-fitness': '/images/products/vitamins.jpg',
  vitamins: '/images/products/vitamins.jpg',
  'daily-essentials': '/images/products/medical-devices.jpg',
  'dental-care': '/images/products/oral-care.jpg',
  'men-care': '/images/products/personal-care.jpg',
  'personal-care': '/images/products/personal-care.jpg',
  'sexual-health': '/images/products/personal-care.jpg',
  'women-care': '/images/products/personal-care.jpg',
  'medical-devices': '/images/products/medical-devices.jpg',
};

const subcategoryImagesBySlug: Record<string, string> = {
  'pain-relief': '/images/categories/pain-relief.png',
  'cold-flu': '/images/categories/cold-flu.png',
  'throat-care': '/images/categories/throat-care.png',
  'nasal-care': '/images/categories/nasal-care.png',
  cleansers: '/images/categories/cleansers.png',
  moisturizers: '/images/categories/moisturizers.png',
  sunscreen: '/images/categories/sunscreen.png',
  'skin-treatments': '/images/categories/skin-treatments.png',
  shampoo: '/images/categories/shampoo.png',
  'hair-oils': '/images/categories/hair-oils.png',
  'hair-treatments': '/images/categories/hair-treatments.png',
  'scalp-care': '/images/categories/scalp-care.png',
  'all-cosmetics': '/images/categories/all-cosmetics.png',
  'beauty-accessories': '/images/categories/beauty-accessories.png',
  lenses: '/images/categories/lenses.png',
  'make-up': '/images/categories/make-up.png',
  diapers: '/images/categories/diapers.png',
  'baby-bath': '/images/categories/baby-bath.png',
  'diaper-rash': '/images/categories/diaper-rash.png',
  feeding: '/images/categories/feeding.png',
  'diet-support': '/images/categories/diet-support.png',
  'fitness-care': '/images/categories/fitness-care.png',
  'protein-nutrition': '/images/categories/protein-nutrition.png',
  'weight-control': '/images/categories/weight-control.png',
};

const subcategories = [
  { categorySlug: 'medication', name: 'Pain Relief', slug: 'pain-relief', sortOrder: 1 },
  { categorySlug: 'medication', name: 'Cold & Flu', slug: 'cold-flu', sortOrder: 2 },
  { categorySlug: 'medication', name: 'Throat Care', slug: 'throat-care', sortOrder: 3 },
  { categorySlug: 'medication', name: 'Nasal Care', slug: 'nasal-care', sortOrder: 4 },
  { categorySlug: 'skin-care', name: 'Cleansers', slug: 'cleansers', sortOrder: 1 },
  { categorySlug: 'skin-care', name: 'Moisturizers', slug: 'moisturizers', sortOrder: 2 },
  { categorySlug: 'skin-care', name: 'Sunscreen', slug: 'sunscreen', sortOrder: 3 },
  { categorySlug: 'skin-care', name: 'Treatments', slug: 'skin-treatments', sortOrder: 4 },
  { categorySlug: 'hair-care', name: 'Shampoo', slug: 'shampoo', sortOrder: 1 },
  { categorySlug: 'hair-care', name: 'Hair Oils', slug: 'hair-oils', sortOrder: 2 },
  { categorySlug: 'hair-care', name: 'Treatments', slug: 'hair-treatments', sortOrder: 3 },
  { categorySlug: 'hair-care', name: 'Scalp Care', slug: 'scalp-care', sortOrder: 4 },
  { categorySlug: 'cosmetics', name: 'All Cosmetics', slug: 'all-cosmetics', sortOrder: 1 },
  { categorySlug: 'cosmetics', name: 'Beauty accessories', slug: 'beauty-accessories', sortOrder: 2 },
  { categorySlug: 'cosmetics', name: 'Lenses', slug: 'lenses', sortOrder: 3 },
  { categorySlug: 'cosmetics', name: 'Make Up', slug: 'make-up', sortOrder: 4 },
  { categorySlug: 'mom-baby-care', name: 'Diapers', slug: 'diapers', sortOrder: 1 },
  { categorySlug: 'mom-baby-care', name: 'Baby Bath', slug: 'baby-bath', sortOrder: 2 },
  { categorySlug: 'mom-baby-care', name: 'Diaper Rash', slug: 'diaper-rash', sortOrder: 3 },
  { categorySlug: 'mom-baby-care', name: 'Feeding', slug: 'feeding', sortOrder: 4 },
  { categorySlug: 'diet-fitness', name: 'Diet Support', slug: 'diet-support', sortOrder: 1 },
  { categorySlug: 'diet-fitness', name: 'Fitness Care', slug: 'fitness-care', sortOrder: 2 },
  { categorySlug: 'diet-fitness', name: 'Protein & Nutrition', slug: 'protein-nutrition', sortOrder: 3 },
  { categorySlug: 'diet-fitness', name: 'Weight Control', slug: 'weight-control', sortOrder: 4 },
  { categorySlug: 'vitamins', name: 'Multivitamins', slug: 'multivitamins', sortOrder: 1 },
  { categorySlug: 'vitamins', name: 'Immunity', slug: 'immunity', sortOrder: 2 },
  { categorySlug: 'vitamins', name: 'Omega', slug: 'omega', sortOrder: 3 },
  { categorySlug: 'vitamins', name: 'Bone Health', slug: 'bone-health', sortOrder: 4 },
  { categorySlug: 'daily-essentials', name: 'Home Health', slug: 'home-health', sortOrder: 1 },
  { categorySlug: 'daily-essentials', name: 'First Aid', slug: 'first-aid', sortOrder: 2 },
  { categorySlug: 'daily-essentials', name: 'Sanitizers', slug: 'sanitizers', sortOrder: 3 },
  { categorySlug: 'daily-essentials', name: 'Masks & Gloves', slug: 'masks-gloves', sortOrder: 4 },
  { categorySlug: 'dental-care', name: 'Toothpaste', slug: 'toothpaste', sortOrder: 1 },
  { categorySlug: 'dental-care', name: 'Toothbrushes', slug: 'toothbrushes', sortOrder: 2 },
  { categorySlug: 'dental-care', name: 'Mouthwash', slug: 'mouthwash', sortOrder: 3 },
  { categorySlug: 'dental-care', name: 'Sensitive Teeth', slug: 'sensitive-teeth', sortOrder: 4 },
  { categorySlug: 'men-care', name: 'Shaving', slug: 'shaving', sortOrder: 1 },
  { categorySlug: 'men-care', name: 'Deodorants', slug: 'deodorants', sortOrder: 2 },
  { categorySlug: 'men-care', name: 'Men Grooming', slug: 'men-grooming', sortOrder: 3 },
  { categorySlug: 'men-care', name: 'Men Skin Care', slug: 'men-skin-care', sortOrder: 4 },
  { categorySlug: 'personal-care', name: 'Hygiene', slug: 'hygiene', sortOrder: 1 },
  { categorySlug: 'personal-care', name: 'Body Care', slug: 'body-care', sortOrder: 2 },
  { categorySlug: 'personal-care', name: 'Hand Care', slug: 'hand-care', sortOrder: 3 },
  { categorySlug: 'personal-care', name: 'Bath Care', slug: 'bath-care', sortOrder: 4 },
  { categorySlug: 'sexual-health', name: 'Condoms', slug: 'condoms', sortOrder: 1 },
  { categorySlug: 'sexual-health', name: 'Lubricants', slug: 'lubricants', sortOrder: 2 },
  { categorySlug: 'sexual-health', name: 'Pregnancy Tests', slug: 'pregnancy-tests', sortOrder: 3 },
  { categorySlug: 'sexual-health', name: 'Family Planning', slug: 'family-planning', sortOrder: 4 },
  { categorySlug: 'women-care', name: 'Feminine Care', slug: 'feminine-care', sortOrder: 1 },
  { categorySlug: 'women-care', name: 'Period Care', slug: 'period-care', sortOrder: 2 },
  { categorySlug: 'women-care', name: 'Intimate Care', slug: 'intimate-care', sortOrder: 3 },
  { categorySlug: 'women-care', name: 'Women Wellness', slug: 'women-wellness', sortOrder: 4 },
  { categorySlug: 'medical-devices', name: 'Blood Pressure', slug: 'blood-pressure', sortOrder: 1 },
  { categorySlug: 'medical-devices', name: 'Diabetes Care', slug: 'diabetes-care', sortOrder: 2 },
  { categorySlug: 'medical-devices', name: 'Oximeters', slug: 'oximeters', sortOrder: 3 },
  { categorySlug: 'medical-devices', name: 'Thermometers', slug: 'thermometers', sortOrder: 4 },
];

const productSubcategoryBySlug: Record<string, string> = {
  'panadol-extra': 'pain-relief',
  'brufen-400-mg': 'pain-relief',
  congestal: 'cold-flu',
  'strepsils-honey-lemon': 'throat-care',
  'otrivin-nasal-spray': 'nasal-care',
  'cerave-moisturizing-cream': 'moisturizers',
  'la-roche-posay-anthelios-spf-50': 'sunscreen',
  'bioderma-sensibio-h2o': 'cleansers',
  'eva-b-white-day-cream': 'skin-treatments',
  'the-ordinary-niacinamide-10': 'skin-treatments',
  'vitamin-c-1000-mg': 'immunity',
  'centrum-advance': 'multivitamins',
  'omega-3-plus': 'omega',
  'calcium-d3f': 'bone-health',
  'digital-thermometer': 'thermometers',
  'dettol-antiseptic-liquid': 'hygiene',
  'nivea-soft-cream': 'body-care',
  'always-ultra-normal': 'feminine-care',
  'pampers-premium-care': 'diapers',
  'johnson-baby-shampoo': 'baby-bath',
  sudocrem: 'diaper-rash',
  'blood-pressure-monitor': 'blood-pressure',
  'accu-chek-active-glucose-meter': 'diabetes-care',
  'pulse-oximeter': 'oximeters',
  'sensodyne-repair-protect': 'sensitive-teeth',
  'listerine-cool-mint': 'mouthwash',
  'oral-b-pro-expert-toothbrush': 'toothbrushes',
  'vichy-dercos-anti-dandruff-shampoo': 'scalp-care',
  'pantene-pro-v-shampoo': 'shampoo',
  'mielle-rosemary-mint-oil': 'hair-oils',
};

const brands = [
  { name: 'Panadol', slug: 'panadol', sortOrder: 1, isFeatured: true },
  { name: 'CeraVe', slug: 'cerave', sortOrder: 2, isFeatured: true },
  { name: 'Mustela', slug: 'mustela', sortOrder: 3, isFeatured: true },
  { name: 'Vichy', slug: 'vichy', sortOrder: 4, isFeatured: true },
  { name: 'La Roche-Posay', slug: 'la-roche-posay', sortOrder: 5, isFeatured: true },
  { name: 'Strepsils', slug: 'strepsils', sortOrder: 6, isFeatured: true },
  { name: 'Brufen', slug: 'brufen', sortOrder: 7, isFeatured: false },
  { name: 'Congestal', slug: 'congestal', sortOrder: 8, isFeatured: false },
  { name: 'Otrivin', slug: 'otrivin', sortOrder: 9, isFeatured: false },
  { name: 'Bioderma', slug: 'bioderma', sortOrder: 10, isFeatured: false },
  { name: 'Eva', slug: 'eva', sortOrder: 11, isFeatured: false },
  { name: 'The Ordinary', slug: 'the-ordinary', sortOrder: 12, isFeatured: false },
  { name: 'Centrum', slug: 'centrum', sortOrder: 13, isFeatured: false },
  { name: 'Dettol', slug: 'dettol', sortOrder: 14, isFeatured: false },
  { name: 'Nivea', slug: 'nivea', sortOrder: 15, isFeatured: false },
  { name: 'Pampers', slug: 'pampers', sortOrder: 16, isFeatured: false },
  { name: "Johnson's", slug: 'johnsons', sortOrder: 17, isFeatured: false },
  { name: 'Sudocrem', slug: 'sudocrem', sortOrder: 18, isFeatured: false },
  { name: 'Accu-Chek', slug: 'accu-chek', sortOrder: 19, isFeatured: false },
  { name: 'Sensodyne', slug: 'sensodyne', sortOrder: 20, isFeatured: false },
  { name: 'Listerine', slug: 'listerine', sortOrder: 21, isFeatured: false },
  { name: 'Oral-B', slug: 'oral-b', sortOrder: 22, isFeatured: false },
  { name: 'Pantene', slug: 'pantene', sortOrder: 23, isFeatured: false },
  { name: 'Mielle', slug: 'mielle', sortOrder: 24, isFeatured: false },
  { name: 'Health Essentials', slug: 'health-essentials', sortOrder: 25, isFeatured: false },
];

const products = [
  {
    categorySlug: 'medication',
    brandSlug: 'panadol',
    name: 'Panadol Extra',
    slug: 'panadol-extra',
    description: 'Pain relief tablets for headache and body aches.',
    packageSize: '24 tablets',
    pricePiasters: 7500,
    isPopular: true,
  },
  {
    categorySlug: 'medication',
    brandSlug: 'brufen',
    name: 'Brufen 400 mg',
    slug: 'brufen-400-mg',
    description: 'Anti-inflammatory tablets for short-term pain relief.',
    packageSize: '30 tablets',
    pricePiasters: 6200,
    isPopular: true,
  },
  {
    categorySlug: 'medication',
    brandSlug: 'congestal',
    name: 'Congestal',
    slug: 'congestal',
    description: 'Cold and flu tablets for congestion and common symptoms.',
    packageSize: '20 tablets',
    pricePiasters: 4300,
    isPopular: false,
  },
  {
    categorySlug: 'medication',
    brandSlug: 'strepsils',
    name: 'Strepsils Honey & Lemon',
    slug: 'strepsils-honey-lemon',
    description: 'Lozenges for sore throat comfort.',
    packageSize: '24 lozenges',
    pricePiasters: 5800,
    isPopular: false,
  },
  {
    categorySlug: 'medication',
    brandSlug: 'otrivin',
    name: 'Otrivin Nasal Spray',
    slug: 'otrivin-nasal-spray',
    description: 'Nasal decongestant spray for blocked nose relief.',
    packageSize: '10 ml',
    pricePiasters: 5200,
    isPopular: false,
  },
  {
    categorySlug: 'skin-care',
    brandSlug: 'cerave',
    name: 'CeraVe Moisturizing Cream',
    slug: 'cerave-moisturizing-cream',
    description: 'Daily moisturizing cream for dry to very dry skin.',
    packageSize: '340 g',
    pricePiasters: 54000,
    isPopular: true,
  },
  {
    categorySlug: 'skin-care',
    brandSlug: 'la-roche-posay',
    name: 'La Roche-Posay Anthelios SPF 50+',
    slug: 'la-roche-posay-anthelios-spf-50',
    description: 'Lightweight daily sunscreen for sensitive skin.',
    packageSize: '50 ml',
    pricePiasters: 69000,
    isPopular: false,
  },
  {
    categorySlug: 'skin-care',
    brandSlug: 'bioderma',
    name: 'Bioderma Sensibio H2O',
    slug: 'bioderma-sensibio-h2o',
    description: 'Micellar cleansing water for sensitive skin.',
    packageSize: '250 ml',
    pricePiasters: 48500,
    isPopular: false,
  },
  {
    categorySlug: 'skin-care',
    brandSlug: 'eva',
    name: 'Eva B-White Day Cream',
    slug: 'eva-b-white-day-cream',
    description: 'Daily face cream for a brighter-looking complexion.',
    packageSize: '50 ml',
    pricePiasters: 18500,
    isPopular: false,
  },
  {
    categorySlug: 'skin-care',
    brandSlug: 'the-ordinary',
    name: 'The Ordinary Niacinamide 10%',
    slug: 'the-ordinary-niacinamide-10',
    description: 'Serum for visible oil balance and skin texture support.',
    packageSize: '30 ml',
    pricePiasters: 62000,
    isPopular: true,
  },
  {
    categorySlug: 'vitamins',
    brandSlug: 'health-essentials',
    name: 'Vitamin C 1000 mg',
    slug: 'vitamin-c-1000-mg',
    description: 'Effervescent vitamin C support for daily wellness.',
    packageSize: '20 tablets',
    pricePiasters: 8900,
    isPopular: true,
  },
  {
    categorySlug: 'vitamins',
    brandSlug: 'centrum',
    name: 'Centrum Advance',
    slug: 'centrum-advance',
    description: 'Daily multivitamin and mineral supplement.',
    packageSize: '30 tablets',
    pricePiasters: 29500,
    isPopular: true,
  },
  {
    categorySlug: 'vitamins',
    brandSlug: 'health-essentials',
    name: 'Omega 3 Plus',
    slug: 'omega-3-plus',
    description: 'Omega-3 supplement for daily wellness support.',
    packageSize: '30 capsules',
    pricePiasters: 16500,
    isPopular: false,
  },
  {
    categorySlug: 'vitamins',
    brandSlug: 'health-essentials',
    name: 'Calcium D3F',
    slug: 'calcium-d3f',
    description: 'Calcium and vitamin D supplement for bone support.',
    packageSize: '30 tablets',
    pricePiasters: 9800,
    isPopular: false,
  },
  {
    categorySlug: 'medical-devices',
    brandSlug: 'health-essentials',
    name: 'Digital Thermometer',
    slug: 'digital-thermometer',
    description: 'Fast digital thermometer for home care.',
    packageSize: '1 device',
    pricePiasters: 12500,
    isPopular: false,
  },
  {
    categorySlug: 'women-care',
    brandSlug: 'dettol',
    name: 'Dettol Antiseptic Liquid',
    slug: 'dettol-antiseptic-liquid',
    description: 'Antiseptic liquid for personal and home hygiene.',
    packageSize: '500 ml',
    pricePiasters: 11800,
    isPopular: false,
  },
  {
    categorySlug: 'personal-care',
    brandSlug: 'nivea',
    name: 'Nivea Soft Cream',
    slug: 'nivea-soft-cream',
    description: 'Light moisturizing cream for face, hands, and body.',
    packageSize: '200 ml',
    pricePiasters: 14500,
    isPopular: false,
  },
  {
    categorySlug: 'personal-care',
    brandSlug: 'health-essentials',
    name: 'Always Ultra Normal',
    slug: 'always-ultra-normal',
    description: 'Sanitary pads for everyday comfort and protection.',
    packageSize: '16 pads',
    pricePiasters: 7400,
    isPopular: false,
  },
  {
    categorySlug: 'mom-baby-care',
    brandSlug: 'pampers',
    name: 'Pampers Premium Care',
    slug: 'pampers-premium-care',
    description: 'Soft diapers for sensitive baby skin.',
    packageSize: 'Size 3 - 60 diapers',
    pricePiasters: 48500,
    isPopular: true,
  },
  {
    categorySlug: 'mom-baby-care',
    brandSlug: 'johnsons',
    name: 'Johnson Baby Shampoo',
    slug: 'johnson-baby-shampoo',
    description: 'Gentle baby shampoo for daily bath care.',
    packageSize: '500 ml',
    pricePiasters: 13200,
    isPopular: false,
  },
  {
    categorySlug: 'mom-baby-care',
    brandSlug: 'sudocrem',
    name: 'Sudocrem',
    slug: 'sudocrem',
    description: 'Barrier cream for baby diaper care.',
    packageSize: '125 g',
    pricePiasters: 17600,
    isPopular: false,
  },
  {
    categorySlug: 'medical-devices',
    brandSlug: 'health-essentials',
    name: 'Blood Pressure Monitor',
    slug: 'blood-pressure-monitor',
    description: 'Digital upper-arm monitor for home blood pressure checks.',
    packageSize: '1 device',
    pricePiasters: 145000,
    isPopular: true,
  },
  {
    categorySlug: 'medical-devices',
    brandSlug: 'accu-chek',
    name: 'Accu-Chek Active Glucose Meter',
    slug: 'accu-chek-active-glucose-meter',
    description: 'Blood glucose monitoring starter device.',
    packageSize: '1 kit',
    pricePiasters: 132000,
    isPopular: false,
  },
  {
    categorySlug: 'medical-devices',
    brandSlug: 'health-essentials',
    name: 'Pulse Oximeter',
    slug: 'pulse-oximeter',
    description: 'Fingertip oxygen saturation and pulse monitor.',
    packageSize: '1 device',
    pricePiasters: 69000,
    isPopular: false,
  },
  {
    categorySlug: 'dental-care',
    brandSlug: 'sensodyne',
    name: 'Sensodyne Repair & Protect',
    slug: 'sensodyne-repair-protect',
    description: 'Toothpaste for sensitive teeth care.',
    packageSize: '75 ml',
    pricePiasters: 9400,
    isPopular: false,
  },
  {
    categorySlug: 'dental-care',
    brandSlug: 'listerine',
    name: 'Listerine Cool Mint',
    slug: 'listerine-cool-mint',
    description: 'Daily mouthwash for fresh breath and oral hygiene.',
    packageSize: '500 ml',
    pricePiasters: 16800,
    isPopular: false,
  },
  {
    categorySlug: 'dental-care',
    brandSlug: 'oral-b',
    name: 'Oral-B Pro-Expert Toothbrush',
    slug: 'oral-b-pro-expert-toothbrush',
    description: 'Manual toothbrush for complete oral cleaning.',
    packageSize: '1 brush',
    pricePiasters: 6200,
    isPopular: false,
  },
  {
    categorySlug: 'hair-care',
    brandSlug: 'vichy',
    name: 'Vichy Dercos Anti-Dandruff Shampoo',
    slug: 'vichy-dercos-anti-dandruff-shampoo',
    description: 'Anti-dandruff shampoo for scalp care.',
    packageSize: '200 ml',
    pricePiasters: 47500,
    isPopular: false,
  },
  {
    categorySlug: 'hair-care',
    brandSlug: 'pantene',
    name: 'Pantene Pro-V Shampoo',
    slug: 'pantene-pro-v-shampoo',
    description: 'Daily shampoo for smooth and healthy-looking hair.',
    packageSize: '400 ml',
    pricePiasters: 11600,
    isPopular: false,
  },
  {
    categorySlug: 'hair-care',
    brandSlug: 'mielle',
    name: 'Mielle Rosemary Mint Oil',
    slug: 'mielle-rosemary-mint-oil',
    description: 'Scalp and hair strengthening oil.',
    packageSize: '59 ml',
    pricePiasters: 42000,
    isPopular: true,
  },
];

const offers = [
  {
    id: 'premium-skin-care-picks',
    title: 'Premium skin care picks',
    description: 'Selected dermatology essentials for daily care.',
    badge: 'Up to 20%',
    discountPercent: 20,
    sortOrder: 1,
  },
  {
    id: 'monthly-wellness-support',
    title: 'Monthly wellness support',
    description: 'Vitamins and supplements for your routine.',
    badge: 'Bundle offer',
    discountPercent: 15,
    sortOrder: 2,
  },
  {
    id: 'prescription-delivery',
    title: 'Prescription delivery',
    description: 'Upload your prescription and our pharmacy team will review it.',
    badge: 'Fast review',
    sortOrder: 3,
  },
];

const branches = [
  {
    address: 'Makram Ebeid, Nasr City, Cairo',
    hours: 'Open 24 hours',
    name: 'Nasr City branch',
    phone: '01000000000',
    slug: 'nasr-city',
    sortOrder: 1,
  },
  {
    address: 'Road 9, Maadi, Cairo',
    hours: 'Open 9:00 AM - 12:00 AM',
    name: 'Maadi branch',
    phone: '01000000001',
    slug: 'maadi',
    sortOrder: 2,
  },
  {
    address: 'South 90 Street, New Cairo',
    hours: 'Open 9:00 AM - 1:00 AM',
    name: 'New Cairo branch',
    phone: '01000000002',
    slug: 'new-cairo',
    sortOrder: 3,
  },
];

async function main() {
  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const subcategory of subcategories) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: subcategory.categorySlug },
    });
    const { categorySlug: _categorySlug, ...subcategoryData } = subcategory;

    await prisma.subcategory.upsert({
      where: { slug: subcategory.slug },
      update: {
        ...subcategoryData,
        categoryId: category.id,
        imageUrl:
          subcategoryImagesBySlug[subcategory.slug] ??
          productImagesByCategorySlug[subcategory.categorySlug],
      },
      create: {
        ...subcategoryData,
        categoryId: category.id,
        imageUrl:
          subcategoryImagesBySlug[subcategory.slug] ??
          productImagesByCategorySlug[subcategory.categorySlug],
      },
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: product.categorySlug },
    });
    const brand = await prisma.brand.findUniqueOrThrow({
      where: { slug: product.brandSlug },
    });
    const subcategorySlug = productSubcategoryBySlug[product.slug];
    const subcategory = subcategorySlug
      ? await prisma.subcategory.findUniqueOrThrow({
          where: { slug: subcategorySlug },
        })
      : null;

    const { categorySlug: _categorySlug, brandSlug: _brandSlug, ...productData } = product;
    const imageUrl = productImagesByCategorySlug[product.categorySlug];

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...productData,
        brandId: brand.id,
        categoryId: category.id,
        subcategoryId: subcategory?.id ?? null,
        imageUrl,
      },
      create: {
        ...productData,
        brandId: brand.id,
        categoryId: category.id,
        subcategoryId: subcategory?.id ?? null,
        imageUrl,
      },
    });
  }

  await prisma.subcategory.deleteMany({
    where: {
      slug: {
        notIn: subcategories.map((subcategory) => subcategory.slug),
      },
    },
  });

  await prisma.category.deleteMany({
    where: {
      slug: {
        notIn: categories.map((category) => category.slug),
      },
    },
  });

  for (const offer of offers) {
    await prisma.offer.upsert({
      where: { id: offer.id },
      update: offer,
      create: offer,
    });
  }

  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { slug: branch.slug },
      update: branch,
      create: branch,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
