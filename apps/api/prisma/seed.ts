import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: 'Medicines',
    slug: 'medicines',
    description: 'Everyday medicines and pharmacy essentials.',
    imageUrl: '/images/categories/medicines.jpg',
    sortOrder: 1,
  },
  {
    name: 'Skin Care',
    slug: 'skin-care',
    description: 'Dermatology, cleansers, moisturizers, and sunscreen.',
    imageUrl: '/images/categories/skin-care.jpg',
    sortOrder: 2,
  },
  {
    name: 'Vitamins',
    slug: 'vitamins',
    description: 'Supplements for daily wellness and immunity.',
    imageUrl: '/images/categories/vitamins.jpg',
    sortOrder: 3,
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Hygiene, oral care, and home health products.',
    imageUrl: '/images/categories/personal-care.jpg',
    sortOrder: 4,
  },
  {
    name: 'Baby Care',
    slug: 'baby-care',
    description: 'Baby feeding, diapers, bath care, and daily essentials.',
    imageUrl: '/images/categories/baby-care.jpg',
    sortOrder: 5,
  },
  {
    name: 'Medical Devices',
    slug: 'medical-devices',
    description: 'Home monitoring devices and practical health tools.',
    imageUrl: '/images/categories/medical-devices.jpg',
    sortOrder: 6,
  },
  {
    name: 'Oral Care',
    slug: 'oral-care',
    description: 'Toothpaste, brushes, mouthwash, and gum care.',
    imageUrl: '/images/categories/oral-care.jpg',
    sortOrder: 7,
  },
  {
    name: 'Hair Care',
    slug: 'hair-care',
    description: 'Shampoo, treatments, oils, and scalp care.',
    imageUrl: '/images/categories/hair-care.jpg',
    sortOrder: 8,
  },
];

const productImagesByCategorySlug: Record<string, string> = {
  medicines: '/images/products/medicines.jpg',
  'skin-care': '/images/products/skin-care.jpg',
  vitamins: '/images/products/vitamins.jpg',
  'personal-care': '/images/products/personal-care.jpg',
  'baby-care': '/images/products/baby-care.jpg',
  'medical-devices': '/images/products/medical-devices.jpg',
  'oral-care': '/images/products/oral-care.jpg',
  'hair-care': '/images/products/hair-care.jpg',
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
    categorySlug: 'medicines',
    brandSlug: 'panadol',
    name: 'Panadol Extra',
    slug: 'panadol-extra',
    description: 'Pain relief tablets for headache and body aches.',
    packageSize: '24 tablets',
    pricePiasters: 7500,
    isPopular: true,
  },
  {
    categorySlug: 'medicines',
    brandSlug: 'brufen',
    name: 'Brufen 400 mg',
    slug: 'brufen-400-mg',
    description: 'Anti-inflammatory tablets for short-term pain relief.',
    packageSize: '30 tablets',
    pricePiasters: 6200,
    isPopular: true,
  },
  {
    categorySlug: 'medicines',
    brandSlug: 'congestal',
    name: 'Congestal',
    slug: 'congestal',
    description: 'Cold and flu tablets for congestion and common symptoms.',
    packageSize: '20 tablets',
    pricePiasters: 4300,
    isPopular: false,
  },
  {
    categorySlug: 'medicines',
    brandSlug: 'strepsils',
    name: 'Strepsils Honey & Lemon',
    slug: 'strepsils-honey-lemon',
    description: 'Lozenges for sore throat comfort.',
    packageSize: '24 lozenges',
    pricePiasters: 5800,
    isPopular: false,
  },
  {
    categorySlug: 'medicines',
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
    categorySlug: 'personal-care',
    brandSlug: 'health-essentials',
    name: 'Digital Thermometer',
    slug: 'digital-thermometer',
    description: 'Fast digital thermometer for home care.',
    packageSize: '1 device',
    pricePiasters: 12500,
    isPopular: false,
  },
  {
    categorySlug: 'personal-care',
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
    categorySlug: 'baby-care',
    brandSlug: 'pampers',
    name: 'Pampers Premium Care',
    slug: 'pampers-premium-care',
    description: 'Soft diapers for sensitive baby skin.',
    packageSize: 'Size 3 - 60 diapers',
    pricePiasters: 48500,
    isPopular: true,
  },
  {
    categorySlug: 'baby-care',
    brandSlug: 'johnsons',
    name: 'Johnson Baby Shampoo',
    slug: 'johnson-baby-shampoo',
    description: 'Gentle baby shampoo for daily bath care.',
    packageSize: '500 ml',
    pricePiasters: 13200,
    isPopular: false,
  },
  {
    categorySlug: 'baby-care',
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
    categorySlug: 'oral-care',
    brandSlug: 'sensodyne',
    name: 'Sensodyne Repair & Protect',
    slug: 'sensodyne-repair-protect',
    description: 'Toothpaste for sensitive teeth care.',
    packageSize: '75 ml',
    pricePiasters: 9400,
    isPopular: false,
  },
  {
    categorySlug: 'oral-care',
    brandSlug: 'listerine',
    name: 'Listerine Cool Mint',
    slug: 'listerine-cool-mint',
    description: 'Daily mouthwash for fresh breath and oral hygiene.',
    packageSize: '500 ml',
    pricePiasters: 16800,
    isPopular: false,
  },
  {
    categorySlug: 'oral-care',
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

  for (const product of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: product.categorySlug },
    });
    const brand = await prisma.brand.findUniqueOrThrow({
      where: { slug: product.brandSlug },
    });

    const { categorySlug: _categorySlug, brandSlug: _brandSlug, ...productData } = product;
    const imageUrl = productImagesByCategorySlug[product.categorySlug];

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...productData,
        brandId: brand.id,
        categoryId: category.id,
        imageUrl,
      },
      create: {
        ...productData,
        brandId: brand.id,
        categoryId: category.id,
        imageUrl,
      },
    });
  }

  for (const offer of offers) {
    await prisma.offer.upsert({
      where: { id: offer.id },
      update: offer,
      create: offer,
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
