export const categories = [
  {
    name: "Vegetables",
    image: require("@/src/assets/images/category/vegetables.png"),
  },
  {
    name: "Snacks",
    image: require("@/src/assets/images/category/snacks.png"),
  },
  {
    name: "Dairy",
    image: require("@/src/assets/images/category/dairy.png"),
  },
  {
    name: "Eggs",
    image: require("@/src/assets/images/category/eggs.png"),
  },
  {
    name: "Vegetables",
    image: require("@/src/assets/images/category/vegetables.png"),
  },
  {
    name: "Snacks",
    image: require("@/src/assets/images/category/snacks.png"),
  },
  {
    name: "Dairy",
    image: require("@/src/assets/images/category/dairy.png"),
  },
  {
    name: "Eggs",
    image: require("@/src/assets/images/category/eggs.png"),
  },
];

export const products = [
  {
    name: "Aashirvaad Atta",
    image: require("@/src/assets/images/products/Aashirvaad Atta.png"),
    brand: "Aashirvaad",
    category: "Flour & Grains",
    weight: "5 kg",
    price: 265,
  },
  {
    name: "Fortune Sunlite Refined Oil",
    image: require("@/src/assets/images/products/Fortune Sunlite Refined Oil.png"),
    brand: "Fortune",
    category: "Edible Oils",
    weight: "1 L",
    price: 155,
  },
  {
    name: "Tata Sampann Toor Dal",
    image: require("@/src/assets/images/products/Tata Sampann Toor Dal.png"),
    brand: "Tata Sampann",
    category: "Pulses & Lentils",
    weight: "1 kg",
    price: 185,
  },
  {
    name: "Amul Gold Milk",
    image: require("@/src/assets/images/products/Amul Gold Milk.png"),
    brand: "Amul",
    category: "Dairy",
    weight: "1 L",
    price: 68,
  },
  {
    name: "Britannia Good Day Butter Cookies",
    image: require("@/src/assets/images/products/Britannia Good Day Butter Cookies.png"),
    brand: "Britannia",
    category: "Snacks & Biscuits",
    weight: "200 g",
    price: 40,
  },
  {
    name: "Maggi 2-Minute Noodles",
    image: require("@/src/assets/images/products/Maggi 2-Minute Noodles.png"),
    brand: "Maggi",
    category: "Instant Food",
    weight: "280 g",
    price: 56,
  },
  {
    name: "Surf Excel Easy Wash Detergent",
    image: require("@/src/assets/images/products/Surf Excel Easy Wash Detergent.png"),
    brand: "Surf Excel",
    category: "Household Care",
    weight: "1 kg",
    price: 145,
  },
  {
    name: "Colgate Strong Teeth Toothpaste",
    image: require("@/src/assets/images/products/Colgate Strong Teeth Toothpaste.png"),
    brand: "Colgate",
    category: "Personal Care",
    weight: "200 g",
    price: 98,
  },
  {
    name: "Real Mixed Fruit Juice",
    image: require("@/src/assets/images/products/Real Mixed Fruit Juice.png"),
    brand: "Real",
    category: "Beverages",
    weight: "1 L",
    price: 120,
  },
  {
    name: "Tata Tea Gold",
    image: require("@/src/assets/images/products/Tata Tea Gold.png"),
    brand: "Tata Tea",
    category: "Tea & Coffee",
    weight: "500 g",
    price: 245,
  },
];

export const product = {
  name: "Fortune Sunlite Refined Sunflower Oil",
  variant: "500 ml",
  brand: "Fortune",
  description:
    "Fortune Sunlite Refined Sunflower Oil is made from high-quality sunflower seeds and refined using advanced technology to retain natural nutrients. Light in taste and texture, it is ideal for everyday cooking, frying, and sautéing while supporting a balanced lifestyle.",
  images: [
    {
      id: "aashirvaad-atta",
      image: require("@/src/assets/images/products/Aashirvaad Atta.png"),
    },
    {
      id: "fortune-sunlite-oil",
      image: require("@/src/assets/images/products/Fortune Sunlite Refined Oil.png"),
    },
    {
      id: "tata-sampann-toor-dal",
      image: require("@/src/assets/images/products/Tata Sampann Toor Dal.png"),
    },
    {
      id: "amul-gold-milk",
      image: require("@/src/assets/images/products/Amul Gold Milk.png"),
    },
  ],
  ratings: {
    average: 4.4,
    count: 1287,
  },
  mrp: 110,
  price: 96,
  discount: 13, // percentage
};


export const deliveryItems= [
  {
    image: "https://example.com/images/rice.png",
    name: "Basmati Rice",
    quantity: 2,
  },
  {
    image: "https://example.com/images/milk.png",
    name: "Full Cream Milk",
    quantity: 1,
  },
  {
    image: "https://example.com/images/apples.png",
    name: "Fresh Apples",
    quantity: 6,
  },
  {
    image: "https://example.com/images/bread.png",
    name: "Whole Wheat Bread",
    quantity: 1,
  },
];


export const orders = [
  {
    id: "10234",
    status: "On the way",
    storeName: "Fresh Mart Grocery",
    eta: 12,
    total: 749,
    items: [
      { name: "Tomatoes", qty: 2 },
      { name: "Milk (1L)", qty: 1 },
      { name: "Brown Bread", qty: 1 },
      { name: "Eggs (12 pcs)", qty: 1 },
    ],
  },
  {
    id: "10235",
    status: "Preparing",
    storeName: "Daily Needs Store",
    eta: 25,
    total: 420,
    items: [
      { name: "Rice (5kg)", qty: 1 },
      { name: "Cooking Oil", qty: 1 },
    ],
  },
];
