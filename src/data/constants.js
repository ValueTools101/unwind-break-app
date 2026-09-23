export const BREATH_PATTERNS = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal counts in, hold, out, hold. Great for focus.',
    phases: [
      { type: 'inhale', seconds: 4, label: 'Breathe in' },
      { type: 'hold', seconds: 4, label: 'Hold' },
      { type: 'exhale', seconds: 4, label: 'Breathe out' },
      { type: 'hold', seconds: 4, label: 'Hold' },
    ],
  },
  {
    id: '478',
    name: 'Calming 4-7-8',
    description: 'A longer exhale to help you wind down fast.',
    phases: [
      { type: 'inhale', seconds: 4, label: 'Breathe in' },
      { type: 'hold', seconds: 7, label: 'Hold' },
      { type: 'exhale', seconds: 8, label: 'Breathe out' },
    ],
  },
  {
    id: 'simple',
    name: 'Simple Breath',
    description: 'Easy in and out, no holding.',
    phases: [
      { type: 'inhale', seconds: 4, label: 'Breathe in' },
      { type: 'exhale', seconds: 4, label: 'Breathe out' },
    ],
  },
];

export const SOUND_PRESETS = [
  { id: 'rain', label: 'Rain', icon: '🌧️', visual: 'rain' },
  { id: 'brown', label: 'Deep Hum', icon: '🌊', visual: 'waves' },
  { id: 'wind', label: 'Soft Wind', icon: '🍃', visual: 'wind' },
  { id: 'tone-low', label: 'Low Calm Tone', icon: '🔔', visual: 'glow' },
  { id: 'tone-mid', label: 'Gentle Chime Tone', icon: '✨', visual: 'sparkle' },
];

export const MOODS = [
  { emoji: '😌', label: 'Calm' },
  { emoji: '🙂', label: 'Okay' },
  { emoji: '😔', label: 'Down' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😰', label: 'Anxious' },
];

export const SHOP_CATEGORIES = [
  'Clothing',
  'Footwear',
  'Home',
  'Kitchen',
  'Gadgets',
  'Beauty',
  'Accessories',
  'Books & Stationery',
  'Sports & Outdoors',
  'Toys & Games',
];

export const SHOP_CATEGORY_ICONS = {
  Clothing: '👕',
  Footwear: '👟',
  Home: '🛋️',
  Kitchen: '🍳',
  Gadgets: '🎧',
  Beauty: '💄',
  Accessories: '👜',
  'Books & Stationery': '📚',
  'Sports & Outdoors': '🏕️',
  'Toys & Games': '🧸',
};

export const SHOP_BANNERS = [
  { id: 'b1', title: 'Cozy Season Picks', subtitle: 'Soft layers for a slow afternoon', emoji: '🧣', colors: ['#C9D8FF', '#E1E8F5'] },
  { id: 'b2', title: 'Fresh Arrivals', subtitle: 'New this week, just for browsing', emoji: '🌱', colors: ['#D6F5E7', '#DFF5DE'] },
  { id: 'b3', title: 'Under $20 Treats', subtitle: 'Little things that spark joy', emoji: '🎀', colors: ['#FFE3D6', '#FFD3B0'] },
  { id: 'b4', title: 'Home Refresh', subtitle: 'Make your space feel new', emoji: '🪴', colors: ['#F0E3FF', '#E4D6FF'] },
];

const CARD_COLORS = [
  '#D6E9FF', '#FFE3D6', '#FFD6E7', '#E1E8F5', '#DFF5DE', '#FFF6D6',
  '#F0E3FF', '#FFE9D6', '#DDEBFF', '#E7E7E7', '#FFF3D0', '#D6F0FF',
  '#FFDCE6', '#F3D6FF', '#E4D6FF', '#D6FFE9',
];

// [name, emoji, category, price in USD]
const RAW_PRODUCTS = [
  ['Cloud Sneakers', '👟', 'Footwear', 68],
  ['Trail Running Shoes', '🥾', 'Footwear', 82],
  ['Canvas Slip-Ons', '👞', 'Footwear', 39],
  ['Rain Boots', '🥾', 'Footwear', 46],
  ['Cozy Slippers', '🩴', 'Footwear', 24],
  ['Ankle Boots', '👢', 'Footwear', 74],
  ['Sport Sandals', '👡', 'Footwear', 32],
  ['High-Top Sneakers', '👟', 'Footwear', 71],

  ['Oversized Knit Sweater', '🧶', 'Clothing', 54],
  ['Sunset Sundress', '👗', 'Clothing', 45],
  ['Classic Denim Jacket', '🧥', 'Clothing', 72],
  ['Everyday Hoodie', '👕', 'Clothing', 41],
  ['Linen Button-Up', '👔', 'Clothing', 38],
  ['Wide-Leg Trousers', '👖', 'Clothing', 49],
  ['Puffer Vest', '🦺', 'Clothing', 58],
  ['Pleated Midi Skirt', '👗', 'Clothing', 43],

  ['Ceramic Plant Pot', '🪴', 'Home', 22],
  ['Fairy Light String', '✨', 'Home', 15],
  ['Fluffy Throw Blanket', '🛋️', 'Home', 38],
  ['Scented Candle Set', '🕯️', 'Home', 26],
  ['Woven Storage Basket', '🧺', 'Home', 19],
  ['Framed Wall Art', '🖼️', 'Home', 34],
  ['Area Rug', '🟫', 'Home', 89],
  ['Table Lamp', '💡', 'Home', 31],

  ['Cast Iron Skillet', '🍳', 'Kitchen', 44],
  ['Ceramic Mug Set', '☕', 'Kitchen', 21],
  ['Bamboo Cutting Board', '🪵', 'Kitchen', 18],
  ['French Press', '☕', 'Kitchen', 27],
  ['Glass Storage Jars', '🫙', 'Kitchen', 23],
  ['Stand Mixer', '🧁', 'Kitchen', 129],
  ['Herb Garden Kit', '🌿', 'Kitchen', 25],
  ['Enamel Dinnerware Set', '🍽️', 'Kitchen', 52],

  ['Wireless Earbuds', '🎧', 'Gadgets', 89],
  ['Mini Polaroid Cam', '📷', 'Gadgets', 64],
  ['Smart Desk Lamp', '💡', 'Gadgets', 34],
  ['Portable Speaker', '🔊', 'Gadgets', 42],
  ['Fitness Tracker Band', '⌚', 'Gadgets', 58],
  ['Wireless Charger Pad', '🔌', 'Gadgets', 27],
  ['Mechanical Keyboard', '⌨️', 'Gadgets', 76],
  ['Tablet Stand', '📱', 'Gadgets', 19],

  ['Rose Face Mask Set', '🌹', 'Beauty', 18],
  ['Silk Hair Scrunchie', '🎀', 'Beauty', 9],
  ['Lavender Bath Bomb', '🛁', 'Beauty', 7],
  ['Glow Serum', '🧴', 'Beauty', 29],
  ['Mineral Sunscreen', '🧴', 'Beauty', 16],
  ['Jade Facial Roller', '💎', 'Beauty', 14],
  ['Lip Balm Trio', '💄', 'Beauty', 11],
  ['Body Butter', '🧴', 'Beauty', 19],

  ['Woven Tote Bag', '👜', 'Accessories', 36],
  ['Minimalist Watch', '⌚', 'Accessories', 62],
  ['Beaded Bracelet Set', '📿', 'Accessories', 17],
  ['Wool Beanie', '🧢', 'Accessories', 21],
  ['Leather Wallet', '👛', 'Accessories', 33],
  ['Sunglasses', '🕶️', 'Accessories', 28],
  ['Silk Scarf', '🧣', 'Accessories', 24],
  ['Canvas Backpack', '🎒', 'Accessories', 47],

  ['Guided Journal', '📔', 'Books & Stationery', 16],
  ['Watercolor Set', '🎨', 'Books & Stationery', 22],
  ['Fountain Pen', '🖋️', 'Books & Stationery', 19],
  ['Desk Planner', '🗓️', 'Books & Stationery', 14],
  ['Sticky Note Set', '🗒️', 'Books & Stationery', 8],
  ['Cozy Mystery Novel', '📖', 'Books & Stationery', 13],
  ['Calligraphy Kit', '✒️', 'Books & Stationery', 25],
  ['Bookmark Collection', '🔖', 'Books & Stationery', 6],

  ['Yoga Mat', '🧘', 'Sports & Outdoors', 32],
  ['Insulated Water Bottle', '🧴', 'Sports & Outdoors', 24],
  ['Camping Hammock', '🏕️', 'Sports & Outdoors', 41],
  ['Resistance Bands Set', '💪', 'Sports & Outdoors', 18],
  ['Trail Backpack', '🎒', 'Sports & Outdoors', 56],
  ['Foldable Picnic Mat', '🧺', 'Sports & Outdoors', 22],
  ['Binoculars', '🔭', 'Sports & Outdoors', 39],
  ['Bike Bell & Light Set', '🚲', 'Sports & Outdoors', 17],

  ['Wooden Puzzle Box', '🧩', 'Toys & Games', 21],
  ['Card Game Deck', '🃏', 'Toys & Games', 12],
  ['Plush Bear', '🧸', 'Toys & Games', 19],
  ['Building Block Set', '🧱', 'Toys & Games', 34],
  ['Desk Fidget Toy', '🔧', 'Toys & Games', 9],
  ['Board Game Night Pack', '🎲', 'Toys & Games', 27],
  ['Kite', '🪁', 'Toys & Games', 15],
  ['Water Color Sand Art', '🎨', 'Toys & Games', 11],
];

export const SHOP_CATALOG = RAW_PRODUCTS.map(([name, emoji, category, price], index) => ({
  id: 'p' + (index + 1),
  name,
  emoji,
  category,
  price,
  color: CARD_COLORS[index % CARD_COLORS.length],
}));
