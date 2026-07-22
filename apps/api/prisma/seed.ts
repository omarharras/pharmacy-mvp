import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import crypto from 'node:crypto';
import { promisify } from 'node:util';

import { PrismaClient } from '../src/generated/prisma/client';

const scrypt = promisify(crypto.scrypt);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed the database.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

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
  medication: '/images/categories/medication.png',
  'skin-care': '/images/categories/skin-care.png',
  'hair-care': '/images/categories/hair-care.png',
  cosmetics: '/images/categories/cosmetics.png',
  'mom-baby-care': '/images/categories/mom-baby-care.png',
  'diet-fitness': '/images/categories/diet-fitness.png',
  vitamins: '/images/categories/vitamins.png',
  'daily-essentials': '/images/categories/daily-essentials.png',
  'dental-care': '/images/categories/dental-care.png',
  'men-care': '/images/categories/men-care.png',
  'personal-care': '/images/categories/personal-care.png',
  'sexual-health': '/images/categories/sexual-health.png',
  'women-care': '/images/categories/women-care.png',
  'medical-devices': '/images/categories/medical-devices.png',
};

const productImagesBySlug: Record<string, string> = {
  'accu-chek-active-glucose-meter': '/images/products/accu-chek-active-glucose-meter.png',
  'bioderma-sensibio-h2o': '/images/products/bioderma-sensibio-h2o.png',
  'brufen-400-mg': '/images/products/brufen-400-mg.png',
  'centrum-advance': '/images/products/centrum-advance.png',
  'cerave-moisturizing-cream': '/images/products/cerave-moisturizing-cream.png',
  congestal: '/images/products/congestal.png',
  'dettol-antiseptic-liquid': '/images/products/dettol-antiseptic-liquid.png',
  'johnson-baby-shampoo': '/images/products/johnson-baby-shampoo.png',
  'la-roche-posay-anthelios-spf-50': '/images/products/la-roche-posay-anthelios-spf-50.png',
  'otrivin-nasal-spray': '/images/products/otrivin-nasal-spray.png',
  'pampers-premium-care': '/images/products/pampers-premium-care.png',
  'panadol-extra': '/images/products/panadol-extra.png',
  'sensodyne-repair-protect': '/images/products/sensodyne-repair-protect.png',
  'strepsils-honey-lemon': '/images/products/strepsils-honey-lemon.png',
  sudocrem: '/images/products/sudocrem.png',
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
  foundation: '/images/categories/make-up.png',
  mascara: '/images/categories/make-up.png',
  'liquid-foundation': '/images/categories/make-up.png',
  'powder-foundation': '/images/categories/make-up.png',
  'volume-mascara': '/images/categories/make-up.png',
  'waterproof-mascara': '/images/categories/make-up.png',
  'acne-care': '/images/categories/skin-treatments.png',
  brightening: '/images/categories/skin-treatments.png',
  'acne-cleansers': '/images/categories/skin-treatments.png',
  'spot-treatment': '/images/categories/skin-treatments.png',
  headache: '/images/categories/pain-relief.png',
  'muscle-pain': '/images/categories/pain-relief.png',
  migraine: '/images/categories/pain-relief.png',
  'tension-headache': '/images/categories/pain-relief.png',
  'flu-medicine': '/images/categories/cold-flu.png',
  'cough-care': '/images/categories/cold-flu.png',
  lozenges: '/images/categories/throat-care.png',
  'throat-sprays': '/images/categories/throat-care.png',
  'face-wash': '/images/categories/cleansers.png',
  'micellar-water': '/images/categories/cleansers.png',
  'face-cream': '/images/categories/moisturizers.png',
  'body-lotion': '/images/categories/moisturizers.png',
  'daily-sunscreen': '/images/categories/sunscreen.png',
  'kids-sunscreen': '/images/categories/sunscreen.png',
  'anti-dandruff': '/images/categories/shampoo.png',
  'daily-shampoo': '/images/categories/shampoo.png',
  'hair-masks': '/images/categories/hair-treatments.png',
  'leave-in-care': '/images/categories/hair-treatments.png',
  'contact-lenses': '/images/categories/lenses.png',
  'lens-solution': '/images/categories/lenses.png',
  'brushes-tools': '/images/categories/beauty-accessories.png',
  'makeup-removers': '/images/categories/beauty-accessories.png',
  'newborn-diapers': '/images/categories/diapers.png',
  'diaper-pants': '/images/categories/diapers.png',
  'baby-shampoo': '/images/categories/baby-bath.png',
  'baby-wash': '/images/categories/baby-bath.png',
  bottles: '/images/categories/feeding.png',
  pacifiers: '/images/categories/feeding.png',
  'meal-replacement': '/images/categories/diet-support.png',
  'slimming-support': '/images/categories/diet-support.png',
  'protein-powder': '/images/categories/protein-nutrition.png',
  'protein-bars': '/images/categories/protein-nutrition.png',
  'joint-support': '/images/categories/fitness-care.png',
  'sports-support': '/images/categories/fitness-care.png',
  'adult-multivitamins': '/images/categories/vitamins.png',
  'kids-vitamins': '/images/categories/vitamins.png',
  'vitamin-c': '/images/categories/vitamins.png',
  'immune-support': '/images/categories/vitamins.png',
  bandages: '/images/categories/daily-essentials.png',
  antiseptics: '/images/categories/daily-essentials.png',
  'gel-sanitizer': '/images/categories/daily-essentials.png',
  wipes: '/images/categories/daily-essentials.png',
  'manual-toothbrushes': '/images/categories/dental-care.png',
  'electric-toothbrushes': '/images/categories/dental-care.png',
  'sensitivity-toothpaste': '/images/categories/dental-care.png',
  'whitening-toothpaste': '/images/categories/dental-care.png',
  razors: '/images/categories/men-care.png',
  'shaving-foam': '/images/categories/men-care.png',
  'roll-on-deodorants': '/images/categories/men-care.png',
  'spray-deodorants': '/images/categories/men-care.png',
  'body-wash': '/images/categories/personal-care.png',
  'body-moisturizers': '/images/categories/personal-care.png',
  'hand-cream': '/images/categories/personal-care.png',
  'hand-soap': '/images/categories/personal-care.png',
  'sanitary-pads': '/images/categories/women-care.png',
  liners: '/images/categories/women-care.png',
  'intimate-wash': '/images/categories/women-care.png',
  'intimate-wipes': '/images/categories/women-care.png',
  'bp-monitors': '/images/categories/medical-devices.png',
  'bp-accessories': '/images/categories/medical-devices.png',
  glucometers: '/images/categories/medical-devices.png',
  'test-strips': '/images/categories/medical-devices.png',
};

type SeedSubcategory = {
  categorySlug: string;
  name: string;
  parentSlug?: string;
  slug: string;
  sortOrder: number;
};

const subcategories: SeedSubcategory[] = [
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
  { categorySlug: 'cosmetics', parentSlug: 'make-up', name: 'Foundation', slug: 'foundation', sortOrder: 1 },
  { categorySlug: 'cosmetics', parentSlug: 'make-up', name: 'Mascara', slug: 'mascara', sortOrder: 2 },
  { categorySlug: 'cosmetics', parentSlug: 'foundation', name: 'Liquid Foundation', slug: 'liquid-foundation', sortOrder: 1 },
  { categorySlug: 'cosmetics', parentSlug: 'foundation', name: 'Powder Foundation', slug: 'powder-foundation', sortOrder: 2 },
  { categorySlug: 'cosmetics', parentSlug: 'mascara', name: 'Volume Mascara', slug: 'volume-mascara', sortOrder: 1 },
  { categorySlug: 'cosmetics', parentSlug: 'mascara', name: 'Waterproof Mascara', slug: 'waterproof-mascara', sortOrder: 2 },
  { categorySlug: 'skin-care', parentSlug: 'skin-treatments', name: 'Acne Care', slug: 'acne-care', sortOrder: 1 },
  { categorySlug: 'skin-care', parentSlug: 'skin-treatments', name: 'Brightening', slug: 'brightening', sortOrder: 2 },
  { categorySlug: 'skin-care', parentSlug: 'acne-care', name: 'Acne Cleansers', slug: 'acne-cleansers', sortOrder: 1 },
  { categorySlug: 'skin-care', parentSlug: 'acne-care', name: 'Spot Treatment', slug: 'spot-treatment', sortOrder: 2 },
  { categorySlug: 'medication', parentSlug: 'pain-relief', name: 'Headache', slug: 'headache', sortOrder: 1 },
  { categorySlug: 'medication', parentSlug: 'pain-relief', name: 'Muscle Pain', slug: 'muscle-pain', sortOrder: 2 },
  { categorySlug: 'medication', parentSlug: 'headache', name: 'Migraine', slug: 'migraine', sortOrder: 1 },
  { categorySlug: 'medication', parentSlug: 'headache', name: 'Tension Headache', slug: 'tension-headache', sortOrder: 2 },
  { categorySlug: 'medication', parentSlug: 'cold-flu', name: 'Flu Medicine', slug: 'flu-medicine', sortOrder: 1 },
  { categorySlug: 'medication', parentSlug: 'cold-flu', name: 'Cough Care', slug: 'cough-care', sortOrder: 2 },
  { categorySlug: 'medication', parentSlug: 'throat-care', name: 'Lozenges', slug: 'lozenges', sortOrder: 1 },
  { categorySlug: 'medication', parentSlug: 'throat-care', name: 'Throat Sprays', slug: 'throat-sprays', sortOrder: 2 },
  { categorySlug: 'skin-care', parentSlug: 'cleansers', name: 'Face Wash', slug: 'face-wash', sortOrder: 1 },
  { categorySlug: 'skin-care', parentSlug: 'cleansers', name: 'Micellar Water', slug: 'micellar-water', sortOrder: 2 },
  { categorySlug: 'skin-care', parentSlug: 'moisturizers', name: 'Face Cream', slug: 'face-cream', sortOrder: 1 },
  { categorySlug: 'skin-care', parentSlug: 'moisturizers', name: 'Body Lotion', slug: 'body-lotion', sortOrder: 2 },
  { categorySlug: 'skin-care', parentSlug: 'sunscreen', name: 'Daily Sunscreen', slug: 'daily-sunscreen', sortOrder: 1 },
  { categorySlug: 'skin-care', parentSlug: 'sunscreen', name: 'Kids Sunscreen', slug: 'kids-sunscreen', sortOrder: 2 },
  { categorySlug: 'hair-care', parentSlug: 'shampoo', name: 'Anti-dandruff', slug: 'anti-dandruff', sortOrder: 1 },
  { categorySlug: 'hair-care', parentSlug: 'shampoo', name: 'Daily Shampoo', slug: 'daily-shampoo', sortOrder: 2 },
  { categorySlug: 'hair-care', parentSlug: 'hair-treatments', name: 'Hair Masks', slug: 'hair-masks', sortOrder: 1 },
  { categorySlug: 'hair-care', parentSlug: 'hair-treatments', name: 'Leave-in Care', slug: 'leave-in-care', sortOrder: 2 },
  { categorySlug: 'cosmetics', parentSlug: 'lenses', name: 'Contact Lenses', slug: 'contact-lenses', sortOrder: 1 },
  { categorySlug: 'cosmetics', parentSlug: 'lenses', name: 'Lens Solution', slug: 'lens-solution', sortOrder: 2 },
  { categorySlug: 'cosmetics', parentSlug: 'beauty-accessories', name: 'Brushes & Tools', slug: 'brushes-tools', sortOrder: 1 },
  { categorySlug: 'cosmetics', parentSlug: 'beauty-accessories', name: 'Makeup Removers', slug: 'makeup-removers', sortOrder: 2 },
  { categorySlug: 'mom-baby-care', name: 'Diapers', slug: 'diapers', sortOrder: 1 },
  { categorySlug: 'mom-baby-care', name: 'Baby Bath', slug: 'baby-bath', sortOrder: 2 },
  { categorySlug: 'mom-baby-care', name: 'Diaper Rash', slug: 'diaper-rash', sortOrder: 3 },
  { categorySlug: 'mom-baby-care', name: 'Feeding', slug: 'feeding', sortOrder: 4 },
  { categorySlug: 'mom-baby-care', parentSlug: 'diapers', name: 'Newborn Diapers', slug: 'newborn-diapers', sortOrder: 1 },
  { categorySlug: 'mom-baby-care', parentSlug: 'diapers', name: 'Diaper Pants', slug: 'diaper-pants', sortOrder: 2 },
  { categorySlug: 'mom-baby-care', parentSlug: 'baby-bath', name: 'Baby Shampoo', slug: 'baby-shampoo', sortOrder: 1 },
  { categorySlug: 'mom-baby-care', parentSlug: 'baby-bath', name: 'Baby Wash', slug: 'baby-wash', sortOrder: 2 },
  { categorySlug: 'mom-baby-care', parentSlug: 'feeding', name: 'Bottles', slug: 'bottles', sortOrder: 1 },
  { categorySlug: 'mom-baby-care', parentSlug: 'feeding', name: 'Pacifiers', slug: 'pacifiers', sortOrder: 2 },
  { categorySlug: 'diet-fitness', name: 'Diet Support', slug: 'diet-support', sortOrder: 1 },
  { categorySlug: 'diet-fitness', name: 'Fitness Care', slug: 'fitness-care', sortOrder: 2 },
  { categorySlug: 'diet-fitness', name: 'Protein & Nutrition', slug: 'protein-nutrition', sortOrder: 3 },
  { categorySlug: 'diet-fitness', name: 'Weight Control', slug: 'weight-control', sortOrder: 4 },
  { categorySlug: 'diet-fitness', parentSlug: 'diet-support', name: 'Meal Replacement', slug: 'meal-replacement', sortOrder: 1 },
  { categorySlug: 'diet-fitness', parentSlug: 'diet-support', name: 'Slimming Support', slug: 'slimming-support', sortOrder: 2 },
  { categorySlug: 'diet-fitness', parentSlug: 'protein-nutrition', name: 'Protein Powder', slug: 'protein-powder', sortOrder: 1 },
  { categorySlug: 'diet-fitness', parentSlug: 'protein-nutrition', name: 'Protein Bars', slug: 'protein-bars', sortOrder: 2 },
  { categorySlug: 'diet-fitness', parentSlug: 'fitness-care', name: 'Joint Support', slug: 'joint-support', sortOrder: 1 },
  { categorySlug: 'diet-fitness', parentSlug: 'fitness-care', name: 'Sports Support', slug: 'sports-support', sortOrder: 2 },
  { categorySlug: 'vitamins', name: 'Multivitamins', slug: 'multivitamins', sortOrder: 1 },
  { categorySlug: 'vitamins', name: 'Immunity', slug: 'immunity', sortOrder: 2 },
  { categorySlug: 'vitamins', name: 'Omega', slug: 'omega', sortOrder: 3 },
  { categorySlug: 'vitamins', name: 'Bone Health', slug: 'bone-health', sortOrder: 4 },
  { categorySlug: 'vitamins', parentSlug: 'multivitamins', name: 'Adult Multivitamins', slug: 'adult-multivitamins', sortOrder: 1 },
  { categorySlug: 'vitamins', parentSlug: 'multivitamins', name: 'Kids Vitamins', slug: 'kids-vitamins', sortOrder: 2 },
  { categorySlug: 'vitamins', parentSlug: 'immunity', name: 'Vitamin C', slug: 'vitamin-c', sortOrder: 1 },
  { categorySlug: 'vitamins', parentSlug: 'immunity', name: 'Immune Support', slug: 'immune-support', sortOrder: 2 },
  { categorySlug: 'daily-essentials', name: 'Home Health', slug: 'home-health', sortOrder: 1 },
  { categorySlug: 'daily-essentials', name: 'First Aid', slug: 'first-aid', sortOrder: 2 },
  { categorySlug: 'daily-essentials', name: 'Sanitizers', slug: 'sanitizers', sortOrder: 3 },
  { categorySlug: 'daily-essentials', name: 'Masks & Gloves', slug: 'masks-gloves', sortOrder: 4 },
  { categorySlug: 'daily-essentials', parentSlug: 'first-aid', name: 'Bandages', slug: 'bandages', sortOrder: 1 },
  { categorySlug: 'daily-essentials', parentSlug: 'first-aid', name: 'Antiseptics', slug: 'antiseptics', sortOrder: 2 },
  { categorySlug: 'daily-essentials', parentSlug: 'sanitizers', name: 'Gel Sanitizer', slug: 'gel-sanitizer', sortOrder: 1 },
  { categorySlug: 'daily-essentials', parentSlug: 'sanitizers', name: 'Wipes', slug: 'wipes', sortOrder: 2 },
  { categorySlug: 'dental-care', name: 'Toothpaste', slug: 'toothpaste', sortOrder: 1 },
  { categorySlug: 'dental-care', name: 'Toothbrushes', slug: 'toothbrushes', sortOrder: 2 },
  { categorySlug: 'dental-care', name: 'Mouthwash', slug: 'mouthwash', sortOrder: 3 },
  { categorySlug: 'dental-care', name: 'Sensitive Teeth', slug: 'sensitive-teeth', sortOrder: 4 },
  { categorySlug: 'dental-care', parentSlug: 'toothbrushes', name: 'Manual Toothbrushes', slug: 'manual-toothbrushes', sortOrder: 1 },
  { categorySlug: 'dental-care', parentSlug: 'toothbrushes', name: 'Electric Toothbrushes', slug: 'electric-toothbrushes', sortOrder: 2 },
  { categorySlug: 'dental-care', parentSlug: 'toothpaste', name: 'Sensitivity Toothpaste', slug: 'sensitivity-toothpaste', sortOrder: 1 },
  { categorySlug: 'dental-care', parentSlug: 'toothpaste', name: 'Whitening Toothpaste', slug: 'whitening-toothpaste', sortOrder: 2 },
  { categorySlug: 'men-care', name: 'Shaving', slug: 'shaving', sortOrder: 1 },
  { categorySlug: 'men-care', name: 'Deodorants', slug: 'deodorants', sortOrder: 2 },
  { categorySlug: 'men-care', name: 'Men Grooming', slug: 'men-grooming', sortOrder: 3 },
  { categorySlug: 'men-care', name: 'Men Skin Care', slug: 'men-skin-care', sortOrder: 4 },
  { categorySlug: 'men-care', parentSlug: 'shaving', name: 'Razors', slug: 'razors', sortOrder: 1 },
  { categorySlug: 'men-care', parentSlug: 'shaving', name: 'Shaving Foam', slug: 'shaving-foam', sortOrder: 2 },
  { categorySlug: 'men-care', parentSlug: 'deodorants', name: 'Roll-on Deodorants', slug: 'roll-on-deodorants', sortOrder: 1 },
  { categorySlug: 'men-care', parentSlug: 'deodorants', name: 'Spray Deodorants', slug: 'spray-deodorants', sortOrder: 2 },
  { categorySlug: 'personal-care', name: 'Hygiene', slug: 'hygiene', sortOrder: 1 },
  { categorySlug: 'personal-care', name: 'Body Care', slug: 'body-care', sortOrder: 2 },
  { categorySlug: 'personal-care', name: 'Hand Care', slug: 'hand-care', sortOrder: 3 },
  { categorySlug: 'personal-care', name: 'Bath Care', slug: 'bath-care', sortOrder: 4 },
  { categorySlug: 'personal-care', parentSlug: 'body-care', name: 'Body Wash', slug: 'body-wash', sortOrder: 1 },
  { categorySlug: 'personal-care', parentSlug: 'body-care', name: 'Body Moisturizers', slug: 'body-moisturizers', sortOrder: 2 },
  { categorySlug: 'personal-care', parentSlug: 'hand-care', name: 'Hand Cream', slug: 'hand-cream', sortOrder: 1 },
  { categorySlug: 'personal-care', parentSlug: 'hand-care', name: 'Hand Soap', slug: 'hand-soap', sortOrder: 2 },
  { categorySlug: 'sexual-health', name: 'Condoms', slug: 'condoms', sortOrder: 1 },
  { categorySlug: 'sexual-health', name: 'Lubricants', slug: 'lubricants', sortOrder: 2 },
  { categorySlug: 'sexual-health', name: 'Pregnancy Tests', slug: 'pregnancy-tests', sortOrder: 3 },
  { categorySlug: 'sexual-health', name: 'Family Planning', slug: 'family-planning', sortOrder: 4 },
  { categorySlug: 'women-care', name: 'Feminine Care', slug: 'feminine-care', sortOrder: 1 },
  { categorySlug: 'women-care', name: 'Period Care', slug: 'period-care', sortOrder: 2 },
  { categorySlug: 'women-care', name: 'Intimate Care', slug: 'intimate-care', sortOrder: 3 },
  { categorySlug: 'women-care', name: 'Women Wellness', slug: 'women-wellness', sortOrder: 4 },
  { categorySlug: 'women-care', parentSlug: 'period-care', name: 'Sanitary Pads', slug: 'sanitary-pads', sortOrder: 1 },
  { categorySlug: 'women-care', parentSlug: 'period-care', name: 'Liners', slug: 'liners', sortOrder: 2 },
  { categorySlug: 'women-care', parentSlug: 'intimate-care', name: 'Intimate Wash', slug: 'intimate-wash', sortOrder: 1 },
  { categorySlug: 'women-care', parentSlug: 'intimate-care', name: 'Intimate Wipes', slug: 'intimate-wipes', sortOrder: 2 },
  { categorySlug: 'medical-devices', name: 'Blood Pressure', slug: 'blood-pressure', sortOrder: 1 },
  { categorySlug: 'medical-devices', name: 'Diabetes Care', slug: 'diabetes-care', sortOrder: 2 },
  { categorySlug: 'medical-devices', name: 'Oximeters', slug: 'oximeters', sortOrder: 3 },
  { categorySlug: 'medical-devices', name: 'Thermometers', slug: 'thermometers', sortOrder: 4 },
  { categorySlug: 'medical-devices', parentSlug: 'blood-pressure', name: 'BP Monitors', slug: 'bp-monitors', sortOrder: 1 },
  { categorySlug: 'medical-devices', parentSlug: 'blood-pressure', name: 'BP Accessories', slug: 'bp-accessories', sortOrder: 2 },
  { categorySlug: 'medical-devices', parentSlug: 'diabetes-care', name: 'Glucometers', slug: 'glucometers', sortOrder: 1 },
  { categorySlug: 'medical-devices', parentSlug: 'diabetes-care', name: 'Test Strips', slug: 'test-strips', sortOrder: 2 },
];

const productSubcategoryBySlug: Record<string, string> = {
  'panadol-extra': 'migraine',
  'brufen-400-mg': 'muscle-pain',
  congestal: 'flu-medicine',
  'strepsils-honey-lemon': 'lozenges',
  'otrivin-nasal-spray': 'nasal-care',
  'cerave-moisturizing-cream': 'face-cream',
  'la-roche-posay-anthelios-spf-50': 'daily-sunscreen',
  'bioderma-sensibio-h2o': 'micellar-water',
  'eva-b-white-day-cream': 'brightening',
  'the-ordinary-niacinamide-10': 'spot-treatment',
  'vitamin-c-1000-mg': 'vitamin-c',
  'centrum-advance': 'adult-multivitamins',
  'omega-3-plus': 'omega',
  'calcium-d3f': 'bone-health',
  'digital-thermometer': 'thermometers',
  'dettol-antiseptic-liquid': 'antiseptics',
  'nivea-soft-cream': 'body-moisturizers',
  'always-ultra-normal': 'sanitary-pads',
  'pampers-premium-care': 'newborn-diapers',
  'johnson-baby-shampoo': 'baby-shampoo',
  sudocrem: 'diaper-rash',
  'blood-pressure-monitor': 'bp-monitors',
  'accu-chek-active-glucose-meter': 'glucometers',
  'pulse-oximeter': 'oximeters',
  'sensodyne-repair-protect': 'sensitivity-toothpaste',
  'listerine-cool-mint': 'mouthwash',
  'oral-b-pro-expert-toothbrush': 'manual-toothbrushes',
  'vichy-dercos-anti-dandruff-shampoo': 'anti-dandruff',
  'pantene-pro-v-shampoo': 'daily-shampoo',
  'mielle-rosemary-mint-oil': 'hair-oils',
  'maybelline-fit-me-foundation': 'liquid-foundation',
  'essence-lash-princess-mascara': 'volume-mascara',
  'lens-cleaning-solution': 'lens-solution',
  'ensure-vanilla-powder': 'protein-powder',
  'slim-fast-meal-replacement': 'meal-replacement',
  'knee-support-compression': 'joint-support',
  'first-aid-kit': 'bandages',
  'hand-sanitizer-gel': 'gel-sanitizer',
  'medical-face-masks': 'masks-gloves',
  'gillette-mach3-razors': 'razors',
  'nivea-men-deodorant': 'spray-deodorants',
  'durex-extra-safe': 'condoms',
  'durex-play-lubricant': 'lubricants',
  'clearblue-pregnancy-test': 'pregnancy-tests',
  'always-daily-liners': 'liners',
  'femfresh-intimate-wash': 'intimate-wash',
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
  { name: 'Maybelline', slug: 'maybelline', sortOrder: 26, isFeatured: false },
  { name: 'Essence', slug: 'essence', sortOrder: 27, isFeatured: false },
  { name: 'Ensure', slug: 'ensure', sortOrder: 28, isFeatured: false },
  { name: 'Slim Fast', slug: 'slim-fast', sortOrder: 29, isFeatured: false },
  { name: 'Gillette', slug: 'gillette', sortOrder: 30, isFeatured: false },
  { name: 'Durex', slug: 'durex', sortOrder: 31, isFeatured: false },
  { name: 'Clearblue', slug: 'clearblue', sortOrder: 32, isFeatured: false },
  { name: 'Femfresh', slug: 'femfresh', sortOrder: 33, isFeatured: false },
];

const insuranceProviders = [
  {
    logoUrl: '/images/insurance-providers/axa.png',
    name: 'AXA',
    slug: 'axa',
    sortOrder: 1,
  },
  {
    logoUrl: '/images/insurance-providers/metlife.png',
    name: 'MetLife',
    slug: 'metlife',
    sortOrder: 2,
  },
  {
    logoUrl: '/images/insurance-providers/allianz.png',
    name: 'Allianz',
    slug: 'allianz',
    sortOrder: 3,
  },
  {
    logoUrl: '/images/insurance-providers/globemed.png',
    name: 'GlobeMed',
    slug: 'globemed',
    sortOrder: 4,
  },
  {
    logoUrl: '/images/insurance-providers/mednet.png',
    name: 'MedNet',
    slug: 'mednet',
    sortOrder: 5,
  },
];

const products = [
  {
    categorySlug: 'medication',
    brandSlug: 'panadol',
    name: 'Panadol Extra Optizorb',
    slug: 'panadol-extra',
    description: 'Paracetamol 500 mg and caffeine 65 mg film-coated tablets for temporary relief of headache, migraine, toothache, muscle pain, back pain, menstrual pain, and fever. The pack contains 24 tablets; sell the full box as Piece or one blister strip as Strip.',
    packageSize: '24 tablets',
    pricePiasters: 5800,
    isPopular: true,
  },
  {
    categorySlug: 'medication',
    brandSlug: 'brufen',
    name: 'Brufen 400 mg',
    slug: 'brufen-400-mg',
    description: 'Ibuprofen 400 mg film-coated tablets used as a non-steroidal anti-inflammatory medicine for short-term relief of pain and inflammation. The pack contains 30 tablets; sell the full box as Piece or one blister strip as Strip.',
    packageSize: '30 tablets',
    pricePiasters: 7200,
    isPopular: true,
  },
  {
    categorySlug: 'medication',
    brandSlug: 'congestal',
    name: 'Congestal',
    slug: 'congestal',
    description: 'Combination cold and flu tablets from Sigma Pharmaceutical Industries used for common cold symptoms such as nasal congestion, runny nose, sneezing, headache, and body aches. The pack contains 20 tablets; sell the full box as Piece or one blister strip as Strip.',
    packageSize: '20 tablets',
    pricePiasters: 4500,
    isPopular: false,
  },
  {
    categorySlug: 'medication',
    brandSlug: 'strepsils',
    name: 'Strepsils Honey & Lemon',
    slug: 'strepsils-honey-lemon',
    description: 'Honey and lemon lozenges for soothing sore throat discomfort and everyday throat irritation. The pack contains individually wrapped lozenges and can be sold as the full pack.',
    packageSize: '24 lozenges',
    pricePiasters: 5800,
    isPopular: false,
  },
  {
    categorySlug: 'medication',
    brandSlug: 'otrivin',
    name: 'Otrivin Adult Nasal Spray 0.1%',
    slug: 'otrivin-nasal-spray',
    description: 'Xylometazoline hydrochloride 0.1% metered nasal spray for fast relief of nasal congestion caused by colds, hay fever, allergic rhinitis, or sinusitis. The 10 ml bottle helps improve nasal airflow and can provide relief for up to 12 hours.',
    packageSize: '10 ml',
    pricePiasters: 6500,
    isPopular: false,
  },
  {
    categorySlug: 'skin-care',
    brandSlug: 'cerave',
    name: 'CeraVe Moisturizing Cream',
    slug: 'cerave-moisturizing-cream',
    description: 'Rich, non-greasy moisturizing cream for normal to dry skin on the face and body. Formulated with three essential ceramides and hyaluronic acid to help restore the protective skin barrier and deliver long-lasting hydration.',
    packageSize: '340 g',
    pricePiasters: 65000,
    isPopular: true,
  },
  {
    categorySlug: 'skin-care',
    brandSlug: 'la-roche-posay',
    name: 'La Roche-Posay Anthelios UVMune 400 SPF50+',
    slug: 'la-roche-posay-anthelios-spf-50',
    description: 'Invisible fluid sunscreen with very high UVA/UVB protection for sensitive skin. Lightweight, non-comedogenic texture suitable for daily use on the face, neck, and exposed areas before sun exposure.',
    packageSize: '50 ml',
    pricePiasters: 85000,
    isPopular: false,
  },
  {
    categorySlug: 'skin-care',
    brandSlug: 'bioderma',
    name: 'Bioderma Sensibio H2O',
    slug: 'bioderma-sensibio-h2o',
    description: 'No-rinse micellar cleansing water for sensitive skin. Helps remove makeup and impurities from the face and eyes while soothing the skin and respecting its natural balance.',
    packageSize: '250 ml',
    pricePiasters: 52000,
    isPopular: false,
  },
  {
    categorySlug: 'skin-care',
    brandSlug: 'eva',
    name: 'Eva B-White Day Cream',
    slug: 'eva-b-white-day-cream',
    description: 'Daily facial cream for a brighter-looking complexion and smoother skin tone. Apply in the morning to clean skin as part of a regular skincare routine.',
    packageSize: '50 ml',
    pricePiasters: 18500,
    isPopular: false,
  },
  {
    categorySlug: 'skin-care',
    brandSlug: 'the-ordinary',
    name: 'The Ordinary Niacinamide 10% + Zinc 1%',
    slug: 'the-ordinary-niacinamide-10',
    description: 'Water-based serum with niacinamide 10% and zinc PCA. Designed for blemish-prone skin to support brightness, improve skin texture, reduce visible shine, and help strengthen the moisture barrier.',
    packageSize: '30 ml',
    pricePiasters: 68000,
    isPopular: true,
  },
  {
    categorySlug: 'vitamins',
    brandSlug: 'health-essentials',
    name: 'Vitamin C 1000 mg',
    slug: 'vitamin-c-1000-mg',
    description: 'Effervescent vitamin C tablets for daily antioxidant and immune support. Dissolve one tablet in water according to the pack directions.',
    packageSize: '20 tablets',
    pricePiasters: 8900,
    isPopular: true,
  },
  {
    categorySlug: 'vitamins',
    brandSlug: 'centrum',
    name: 'Centrum Advance',
    slug: 'centrum-advance',
    description: 'Daily multivitamin and multimineral supplement for adults. Contains key micronutrients including B vitamins for energy release, vitamin C and zinc for immune support, and vitamin D for bone health.',
    packageSize: '30 tablets',
    pricePiasters: 31000,
    isPopular: true,
  },
  {
    categorySlug: 'vitamins',
    brandSlug: 'health-essentials',
    name: 'Omega 3 Plus',
    slug: 'omega-3-plus',
    description: 'Omega-3 softgel capsules to support daily wellness and help customers maintain regular intake of essential fatty acids as part of a balanced diet.',
    packageSize: '30 capsules',
    pricePiasters: 16500,
    isPopular: false,
  },
  {
    categorySlug: 'vitamins',
    brandSlug: 'health-essentials',
    name: 'Calcium D3F',
    slug: 'calcium-d3f',
    description: 'Calcium and vitamin D supplement formulated to help support bone health and normal calcium intake when diet alone is not enough.',
    packageSize: '30 tablets',
    pricePiasters: 9800,
    isPopular: false,
  },
  {
    categorySlug: 'medical-devices',
    brandSlug: 'health-essentials',
    name: 'Digital Thermometer',
    slug: 'digital-thermometer',
    description: 'Digital thermometer for home temperature checks with a compact body and easy-to-read screen. Suitable for family first-aid kits and regular fever monitoring.',
    packageSize: '1 device',
    pricePiasters: 12500,
    isPopular: false,
  },
  {
    categorySlug: 'women-care',
    brandSlug: 'dettol',
    name: 'Dettol Antiseptic Liquid',
    slug: 'dettol-antiseptic-liquid',
    description: 'Antiseptic disinfectant liquid for personal hygiene and household first-aid use. Dilute and apply according to the label directions.',
    packageSize: '500 ml',
    pricePiasters: 11800,
    isPopular: false,
  },
  {
    categorySlug: 'personal-care',
    brandSlug: 'nivea',
    name: 'Nivea Soft Cream',
    slug: 'nivea-soft-cream',
    description: 'Light moisturizing cream for the face, hands, and body. Fast-absorbing formula for everyday hydration and a soft skin feel.',
    packageSize: '200 ml',
    pricePiasters: 14500,
    isPopular: false,
  },
  {
    categorySlug: 'personal-care',
    brandSlug: 'health-essentials',
    name: 'Always Ultra Normal',
    slug: 'always-ultra-normal',
    description: 'Ultra-thin sanitary pads designed for comfort, absorption, and everyday period protection. The pack contains 16 pads.',
    packageSize: '16 pads',
    pricePiasters: 7400,
    isPopular: false,
  },
  {
    categorySlug: 'mom-baby-care',
    brandSlug: 'pampers',
    name: 'Pampers Premium Care',
    slug: 'pampers-premium-care',
    description: 'Premium disposable diapers for babies with soft materials and absorbent protection for sensitive skin. Size 3 pack for babies in the mid-weight range.',
    packageSize: 'Size 3 - 60 diapers',
    pricePiasters: 48500,
    isPopular: true,
  },
  {
    categorySlug: 'mom-baby-care',
    brandSlug: 'johnsons',
    name: "Johnson's Baby Shampoo",
    slug: 'johnson-baby-shampoo',
    description: 'Gentle baby shampoo with No More Tears formula. Designed to cleanse delicate hair and scalp, lather quickly, rinse easily, and leave baby hair soft and clean.',
    packageSize: '500 ml',
    pricePiasters: 13200,
    isPopular: false,
  },
  {
    categorySlug: 'mom-baby-care',
    brandSlug: 'sudocrem',
    name: 'Sudocrem Antiseptic Healing Cream',
    slug: 'sudocrem',
    description: 'Multi-purpose antiseptic healing cream used for nappy rash, minor cuts, grazes, eczema-prone irritation, and other minor skin concerns. Forms a breathable protective barrier and contains zinc oxide.',
    packageSize: '125 g',
    pricePiasters: 17600,
    isPopular: false,
  },
  {
    categorySlug: 'medical-devices',
    brandSlug: 'health-essentials',
    name: 'Blood Pressure Monitor',
    slug: 'blood-pressure-monitor',
    description: 'Digital upper-arm blood pressure monitor for home tracking of systolic pressure, diastolic pressure, and pulse. Suitable for routine monitoring between healthcare visits.',
    packageSize: '1 device',
    pricePiasters: 145000,
    isPopular: true,
  },
  {
    categorySlug: 'medical-devices',
    brandSlug: 'accu-chek',
    name: 'Accu-Chek Active Glucose Meter',
    slug: 'accu-chek-active-glucose-meter',
    description: 'Blood glucose meter for self-monitoring. Provides readings in about 5 seconds, uses a small blood sample, stores previous results, and supports average result review for diabetes management.',
    packageSize: '1 kit',
    pricePiasters: 132000,
    isPopular: false,
  },
  {
    categorySlug: 'medical-devices',
    brandSlug: 'health-essentials',
    name: 'Pulse Oximeter',
    slug: 'pulse-oximeter',
    description: 'Fingertip pulse oximeter for quick spot checks of oxygen saturation and pulse rate at home. Compact device with a digital display.',
    packageSize: '1 device',
    pricePiasters: 69000,
    isPopular: false,
  },
  {
    categorySlug: 'dental-care',
    brandSlug: 'sensodyne',
    name: 'Sensodyne Repair & Protect',
    slug: 'sensodyne-repair-protect',
    description: 'Daily fluoride toothpaste for sensitive teeth. Helps build a protective layer over sensitive areas with twice-daily brushing and supports cavity protection.',
    packageSize: '75 ml',
    pricePiasters: 9400,
    isPopular: false,
  },
  {
    categorySlug: 'dental-care',
    brandSlug: 'listerine',
    name: 'Listerine Cool Mint',
    slug: 'listerine-cool-mint',
    description: 'Cool mint daily mouthwash for fresh breath and oral hygiene. Use after brushing as part of a regular oral-care routine.',
    packageSize: '500 ml',
    pricePiasters: 16800,
    isPopular: false,
  },
  {
    categorySlug: 'dental-care',
    brandSlug: 'oral-b',
    name: 'Oral-B Pro-Expert Toothbrush',
    slug: 'oral-b-pro-expert-toothbrush',
    description: 'Manual toothbrush designed for daily plaque removal and complete oral cleaning. Replace regularly as recommended by dental guidance.',
    packageSize: '1 brush',
    pricePiasters: 6200,
    isPopular: false,
  },
  {
    categorySlug: 'hair-care',
    brandSlug: 'vichy',
    name: 'Vichy Dercos Anti-Dandruff Shampoo',
    slug: 'vichy-dercos-anti-dandruff-shampoo',
    description: 'Anti-dandruff shampoo for scalp care, designed to help reduce visible flakes and support a cleaner-feeling scalp with regular use.',
    packageSize: '200 ml',
    pricePiasters: 47500,
    isPopular: false,
  },
  {
    categorySlug: 'hair-care',
    brandSlug: 'pantene',
    name: 'Pantene Pro-V Shampoo',
    slug: 'pantene-pro-v-shampoo',
    description: 'Daily shampoo with Pantene Pro-V formula for clean, smooth, healthy-looking hair. Apply to wet hair, lather, and rinse thoroughly.',
    packageSize: '400 ml',
    pricePiasters: 11600,
    isPopular: false,
  },
  {
    categorySlug: 'hair-care',
    brandSlug: 'mielle',
    name: 'Mielle Rosemary Mint Oil',
    slug: 'mielle-rosemary-mint-oil',
    description: 'Rosemary mint scalp and hair oil for textured hair routines. Can be used on the scalp or hair strands to support a nourished feel and healthy-looking shine.',
    packageSize: '59 ml',
    pricePiasters: 42000,
    isPopular: true,
  },
  {
    categorySlug: 'cosmetics',
    brandSlug: 'maybelline',
    name: 'Maybelline Fit Me Foundation',
    slug: 'maybelline-fit-me-foundation',
    description: 'Fit Me liquid foundation with a natural matte finish for everyday makeup. Lightweight texture with buildable coverage; apply evenly over clean, moisturized skin.',
    packageSize: '30 ml',
    pricePiasters: 21500,
    isPopular: true,
  },
  {
    categorySlug: 'cosmetics',
    brandSlug: 'essence',
    name: 'Essence Lash Princess Mascara',
    slug: 'essence-lash-princess-mascara',
    description: 'Lash Princess mascara for defined lashes and visible volume. The brush separates lashes while building a fuller look for everyday or evening makeup.',
    packageSize: '12 ml',
    pricePiasters: 17500,
    isPopular: false,
  },
  {
    categorySlug: 'cosmetics',
    brandSlug: 'health-essentials',
    name: 'Lens Cleaning Solution',
    slug: 'lens-cleaning-solution',
    description: 'Multipurpose contact lens solution for rinsing, cleaning, disinfecting, and storing soft contact lenses. Use fresh solution each time lenses are stored.',
    packageSize: '120 ml',
    pricePiasters: 8600,
    isPopular: false,
  },
  {
    categorySlug: 'diet-fitness',
    brandSlug: 'ensure',
    name: 'Ensure Vanilla Powder',
    slug: 'ensure-vanilla-powder',
    description: 'Vanilla nutritional powder drink with protein, vitamins, and minerals for daily nutrition support. Mix with water or milk as directed on the pack.',
    packageSize: '400 g',
    pricePiasters: 36500,
    isPopular: true,
  },
  {
    categorySlug: 'diet-fitness',
    brandSlug: 'slim-fast',
    name: 'Slim Fast Meal Replacement',
    slug: 'slim-fast-meal-replacement',
    description: 'Meal replacement shake powder for structured weight management plans. Prepare according to pack directions and combine with balanced meals and activity.',
    packageSize: '438 g',
    pricePiasters: 39900,
    isPopular: false,
  },
  {
    categorySlug: 'diet-fitness',
    brandSlug: 'health-essentials',
    name: 'Knee Support Compression',
    slug: 'knee-support-compression',
    description: 'Elastic knee support for mild compression during walking, training, or daily movement. Choose the correct size and fit for comfortable support.',
    packageSize: '1 piece',
    pricePiasters: 15500,
    isPopular: false,
  },
  {
    categorySlug: 'daily-essentials',
    brandSlug: 'health-essentials',
    name: 'First Aid Kit',
    slug: 'first-aid-kit',
    description: 'Compact first aid kit with basic supplies for small cuts, scratches, and minor daily incidents. Keep one at home, in the car, or at work.',
    packageSize: '1 box',
    pricePiasters: 24500,
    isPopular: true,
  },
  {
    categorySlug: 'daily-essentials',
    brandSlug: 'health-essentials',
    name: 'Hand Sanitizer Gel',
    slug: 'hand-sanitizer-gel',
    description: 'Alcohol-based hand sanitizer gel for quick hand hygiene when soap and water are not available. Rub thoroughly over both hands until dry.',
    packageSize: '250 ml',
    pricePiasters: 6900,
    isPopular: false,
  },
  {
    categorySlug: 'daily-essentials',
    brandSlug: 'health-essentials',
    name: 'Medical Face Masks',
    slug: 'medical-face-masks',
    description: 'Disposable ear-loop face masks for everyday hygiene in crowded settings. Replace when damp, damaged, or after extended use.',
    packageSize: '50 pieces',
    pricePiasters: 9800,
    isPopular: false,
  },
  {
    categorySlug: 'men-care',
    brandSlug: 'gillette',
    name: 'Gillette Mach3 Razors',
    slug: 'gillette-mach3-razors',
    description: 'Mach3 razors with three blades for a close daily shave. Designed with a lubricating strip to help the razor glide smoothly over skin.',
    packageSize: '3 pieces',
    pricePiasters: 23500,
    isPopular: true,
  },
  {
    categorySlug: 'men-care',
    brandSlug: 'nivea',
    name: 'Nivea Men Deodorant',
    slug: 'nivea-men-deodorant',
    description: 'Daily deodorant spray for long-lasting freshness and odor protection. Apply to clean, dry underarms and allow to dry before dressing.',
    packageSize: '150 ml',
    pricePiasters: 11800,
    isPopular: false,
  },
  {
    categorySlug: 'sexual-health',
    brandSlug: 'durex',
    name: 'Durex Extra Safe',
    slug: 'durex-extra-safe',
    description: 'Latex condoms designed for extra reassurance while maintaining comfort. Check expiry date and package integrity before use.',
    packageSize: '12 pieces',
    pricePiasters: 26500,
    isPopular: true,
  },
  {
    categorySlug: 'sexual-health',
    brandSlug: 'durex',
    name: 'Durex Play Lubricant',
    slug: 'durex-play-lubricant',
    description: 'Water-based personal lubricant designed to reduce dryness and improve comfort. Compatible with latex condoms and easy to wash off.',
    packageSize: '50 ml',
    pricePiasters: 18900,
    isPopular: false,
  },
  {
    categorySlug: 'sexual-health',
    brandSlug: 'clearblue',
    name: 'Clearblue Pregnancy Test',
    slug: 'clearblue-pregnancy-test',
    description: 'Home pregnancy test designed for clear, easy-to-read results. Read the instructions before use and check the result within the recommended time window.',
    packageSize: '1 piece',
    pricePiasters: 28500,
    isPopular: false,
  },
  {
    categorySlug: 'women-care',
    brandSlug: 'health-essentials',
    name: 'Always Daily Liners',
    slug: 'always-daily-liners',
    description: 'Thin daily liners for light freshness and everyday comfort. The pack contains 40 liners for routine daily use.',
    packageSize: '40 pieces',
    pricePiasters: 9700,
    isPopular: false,
  },
  {
    categorySlug: 'women-care',
    brandSlug: 'femfresh',
    name: 'Femfresh Intimate Wash',
    slug: 'femfresh-intimate-wash',
    description: 'Gentle intimate wash for daily external cleansing. Mild formula for routine freshness and comfort; use externally according to label directions.',
    packageSize: '250 ml',
    pricePiasters: 15800,
    isPopular: false,
  },
];

function getUnitLabel(packageSize: string) {
  const value = packageSize.toLowerCase();

  if (value.includes('ml') || value.includes('spray') || value.includes('liquid')) {
    return 'Bottle';
  }

  if (
    value.includes('box') ||
    value.includes('cream') ||
    /\d+\s*g\b/.test(value) ||
    value.includes('diaper') ||
    value.includes('pad')
  ) {
    return 'Box';
  }

  return 'Piece';
}

function getTabletCount(packageSize: string) {
  const match = packageSize.match(/\d+/);

  if (!match) {
    return 1;
  }

  return Number(match[0]);
}

function getStripCount(packageSize: string) {
  const tabletCount = getTabletCount(packageSize);

  if (tabletCount >= 30) {
    return 3;
  }

  if (tabletCount >= 20) {
    return 2;
  }

  return 1;
}

function getProductUnits(product: { packageSize: string; pricePiasters: number }) {
  const value = product.packageSize.toLowerCase();
  const canSellByStrip =
    value.includes('tablet') || value.includes('capsule') || value.includes('lozenge');
  const primaryUnit = canSellByStrip ? 'Piece' : getUnitLabel(product.packageSize);
  const units = [
    {
      isDefault: true,
      label: primaryUnit,
      pricePiasters: product.pricePiasters,
      sortOrder: 1,
    },
  ];

  if (canSellByStrip) {
    const stripCount = Math.max(getStripCount(product.packageSize), 1);
    const stripPrice = Math.max(100, Math.ceil(product.pricePiasters / stripCount));

    units.push({
      isDefault: false,
      label: 'Strip',
      pricePiasters: stripPrice,
      sortOrder: 2,
    });
  }

  return units;
}

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

const demoCustomers = [
  {
    fullName: 'Omar Harras',
    password: '123456',
    phone: '01000000000',
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

  for (const provider of insuranceProviders) {
    await prisma.insuranceProvider.upsert({
      where: { slug: provider.slug },
      update: provider,
      create: provider,
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
    const parent = subcategory.parentSlug
      ? await prisma.subcategory.findUniqueOrThrow({
          where: { slug: subcategory.parentSlug },
        })
      : null;
    const {
      categorySlug: _categorySlug,
      parentSlug: _parentSlug,
      ...subcategoryData
    } = subcategory;

    await prisma.subcategory.upsert({
      where: { slug: subcategory.slug },
      update: {
        ...subcategoryData,
        categoryId: category.id,
        parentId: parent?.id ?? null,
        imageUrl:
          subcategoryImagesBySlug[subcategory.slug] ??
          productImagesByCategorySlug[subcategory.categorySlug],
      },
      create: {
        ...subcategoryData,
        categoryId: category.id,
        parentId: parent?.id ?? null,
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
    const imageUrl = productImagesBySlug[product.slug] ?? productImagesByCategorySlug[product.categorySlug];

    const savedProduct = await prisma.product.upsert({
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

    const units = getProductUnits(product);

    for (const unit of units) {
      await prisma.productUnit.upsert({
        where: {
          productId_label: {
            label: unit.label,
            productId: savedProduct.id,
          },
        },
        update: unit,
        create: {
          ...unit,
          productId: savedProduct.id,
        },
      });
    }

    await prisma.productUnit.deleteMany({
      where: {
        productId: savedProduct.id,
        label: {
          notIn: units.map((unit) => unit.label),
        },
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

  for (const customer of demoCustomers) {
    await prisma.customer.upsert({
      where: {
        phone: customer.phone,
      },
      update: {
        fullName: customer.fullName,
        passwordHash: await hashPassword(customer.password),
      },
      create: {
        fullName: customer.fullName,
        passwordHash: await hashPassword(customer.password),
        phone: customer.phone,
      },
    });
  }
}

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `${salt}:${derivedKey.toString('hex')}`;
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
