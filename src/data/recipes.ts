export interface FormulationRecipe {
  id: string;
  name: string;
  hindiName: string;
  purpose: string;
  shelfLife: string;
  ingredients: string[];
  preparationSteps: string[];
  dosage: string;
  targetPestsOrDiseases: string[];
}

export const ORGANIC_RECIPES: FormulationRecipe[] = [
  {
    id: 'jeevamrut',
    name: 'Jeevamrut (Foliar & Soil Microbial Inoculant)',
    hindiName: 'जीवामृत (प्राकृतिक सूक्ष्मजीवाणु टॉनिक)',
    purpose: 'Rapidly multiplies beneficial aerobic soil microbes, enhances nutrient uptake, and builds plant immunity.',
    shelfLife: '7 to 10 days after 48-hour fermentation',
    ingredients: [
      'Fresh Desi Cow Dung: 10 kg',
      'Desi Cow Urine (Gomutra): 5 to 10 Litres',
      'Jaggery (Gud / molasses): 1 to 2 kg',
      'Pulse flour (Besan / Gram flour): 1 to 2 kg',
      'Virgin soil from fence or banyan tree: Handful (approx. 50-100g)',
      'Water: 200 Litres (chlorine-free)',
    ],
    preparationSteps: [
      'In a 200L plastic drum, mix cow dung and cow urine thoroughly with a wooden stick.',
      'Dissolve jaggery and gram flour in a separate bucket of water and add to the drum.',
      'Add the handful of virgin undisturbed soil containing indigenous mycorrhizae.',
      'Fill the drum with 200L water and stir clockwise for 2 minutes morning and evening.',
      'Cover with a wet jute gunny bag and keep in deep shade for 48 to 72 hours.',
    ],
    dosage: 'Soil drenching: 200L per acre via flood/drip. Foliar spray: 10% solution (1L filtered Jeevamrut in 10L water).',
    targetPestsOrDiseases: [
      'Soil nutrient starvation',
      'Root rot and wilting',
      'Plant stress due to heat',
      'Leaf chlorosis',
    ],
  },
  {
    id: 'dashaparni-ark',
    name: 'Dashaparni Ark (10-Leaf Botanical Insecticide)',
    hindiName: 'दशपर्णी अर्क (दस पत्तियों का प्राकृतिक कीटनाशक)',
    purpose: 'Broad-spectrum organic protection against sucking pests, chewing caterpillars, and borer larvae.',
    shelfLife: 'Up to 6 months in shade',
    ingredients: [
      'Cow Dung: 5 kg & Cow Urine: 10 Litres',
      'Neem leaves (crushed): 5 kg',
      'Karanj (Pongamia) leaves: 2 kg',
      'Custard Apple (Sitaphal) leaves: 2 kg',
      'Castor (Arandi) leaves: 2 kg',
      'Dhatura leaves: 2 kg',
      'Calotropis (Aak / Madar) leaves: 2 kg',
      'Guava or Papaya leaves: 2 kg',
      'Green Chilli paste: 500g & Garlic paste: 250g',
      'Water: 200 Litres',
    ],
    preparationSteps: [
      'In a 200L barrel, mix cow dung, urine, and 200L water.',
      'Add all crushed bitter/medicinal leaves, chilli paste, and garlic paste.',
      'Stir twice daily with a wooden pole.',
      'Let it ferment in full shade for 30 to 40 days under gunny cloth cover.',
      'Filter thoroughly through fine double-layered muslin cloth before spraying.',
    ],
    dosage: '6 to 8 Litres of filtered extract per 200L water per acre (or 400ml - 500ml per 15L knapsack tank).',
    targetPestsOrDiseases: [
      'Bollworms (Pink & American)',
      'Aphids, Jassids, and Thrips',
      'Whitefly infestations',
      'Fruit & shoot borers',
    ],
  },
  {
    id: 'sour-buttermilk',
    name: 'Fermented Sour Buttermilk / Khatta Chhaach (Copper Enriched)',
    hindiName: 'तांबा युक्त खट्टी छाछ (प्राकृतिक फफूंदनाशक)',
    purpose: 'Potent natural bio-fungicide that halts fungal rusts, downy mildew, powdery mildew, and leaf spots.',
    shelfLife: 'Use within 15-20 days',
    ingredients: [
      'Sour desi cow buttermilk (Chhaach / Matha): 5 Litres',
      'Clean copper wire or clean brass vessel: 1 piece (approx. 200g)',
      'Water: 100 Litres',
    ],
    preparationSteps: [
      'Take 5L naturally sour buttermilk in an earthen pot or plastic container.',
      'Immerse a clean piece of copper wire or copper plate inside.',
      'Cover and leave undisturbed in a cool dark spot for 8 to 12 days until it turns greenish-blue with copper carbonate.',
      'Remove the copper and filter the greenish buttermilk through fine cloth.',
    ],
    dosage: '5 Litres strained copper-buttermilk per 100 Litres of water (500ml per 15L pump). Spray every 10-12 days.',
    targetPestsOrDiseases: [
      'Yellow Rust / Stripe Rust',
      'Powdery & Downy Mildew',
      'Bacterial Leaf Blight',
      'Early & Late Blight in Solanaceae',
    ],
  },
  {
    id: 'neemastra',
    name: 'Neemastra (Quick Neem Extract)',
    hindiName: 'नीमास्त्र (शीघ्र तैयार नीम का घोल)',
    purpose: 'Effective against early-stage soft-bodied sucking insects, whiteflies, aphids, and leafhoppers.',
    shelfLife: 'Use within 10 to 14 days',
    ingredients: [
      'Fresh crushed Neem leaves or Neem kernel powder: 5 kg',
      'Desi Cow Urine: 5 Litres',
      'Fresh Cow Dung: 2 kg',
      'Water: 100 Litres',
    ],
    preparationSteps: [
      'Crush neem leaves thoroughly into a paste.',
      'Mix cow urine, cow dung, and neem paste into 100L water drum.',
      'Stir clockwise twice a day and let ferment for 48 hours in shade.',
      'Filter with a cloth and spray directly without further dilution.',
    ],
    dosage: 'Direct spray as prepared (no additional water needed). Apply on leaf undersides.',
    targetPestsOrDiseases: [
      'Whiteflies',
      'Aphids (Mahun)',
      'Thrips and Jassids',
      'Mites in vegetable crops',
    ],
  },
];
