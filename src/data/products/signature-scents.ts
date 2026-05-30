import perfume1 from "@/assets/perfume-1.jpeg";
import perfume2 from "@/assets/perfume-2.jpeg";
import perfume3 from "@/assets/perfume-3.jpeg";
import perfume4 from "@/assets/perfume-4.jpeg";
import perfume5 from "@/assets/perfume-5.jpeg";
import perfume6 from "@/assets/perfume-6.jpeg";
import perfume7 from "@/assets/perfume-7.jpeg";
import perfume8 from "@/assets/perfume-8.jpeg";
import perfume9 from "@/assets/perfume-9.jpeg";
import perfume10 from "@/assets/perfume-10.jpeg";
import perfume11 from "@/assets/perfume-11.jpg";
import perfume12 from "@/assets/perfume-12.jpg";
import perfume13 from "@/assets/perfume-13.jpg";
import perfume14 from "@/assets/perfume-14.jpg";
import perfume15 from "@/assets/perfume-15.jpg";
import perfume16 from "@/assets/perfume-16.jpg";
import perfume17 from "@/assets/perfume-17.jpg";
import perfume18 from "@/assets/perfume-18.jpg";
import perfume19 from "@/assets/perfume-19.jpg";
import perfume20 from "@/assets/perfume-20.jpg";
import perfume21 from "@/assets/perfume-21.jpg";
import perfume22 from "@/assets/perfume-22.jpg";
import perfume23 from "@/assets/perfume-23.jpg";
import perfume24 from "@/assets/perfume-24.jpg";
import perfume25 from "@/assets/perfume-25.jpg";
import perfume26 from "@/assets/perfume-26.jpg";
import perfume27 from "@/assets/perfume-27.jpg";
import perfume28 from "@/assets/perfume-28.jpg";
import perfume29 from "@/assets/perfume-29.jpg";
import perfume30 from "@/assets/perfume-30.jpg";
import perfume31 from "@/assets/perfume-31.jpg";
import perfume32 from "@/assets/perfume-32.jpg";
import perfume33 from "@/assets/perfume-33.jpg";
import perfume34 from "@/assets/perfume-34.jpg";
import perfume35 from "@/assets/perfume-35.jpg";
import perfume36 from "@/assets/perfume-36.jpg";
import perfume37 from "@/assets/perfume-37.jpg";
import perfume38 from "@/assets/perfume-38.jpg";
import perfume39 from "@/assets/perfume-39.jpg";
import perfume40 from "@/assets/perfume-40.jpg";
import perfume41 from "@/assets/perfume-41.jpg";
import bodysplash1 from "@/assets/bodysplash-1.jpg";
import bodysplash2 from "@/assets/bodysplash-2.jpg";
import bodysplash3 from "@/assets/bodysplash-3.jpg";
import bodysplash4 from "@/assets/bodysplash-4.webp";
import bodysplash5 from "@/assets/bodysplash-5.jpg";
import bodysplash6 from "@/assets/bodysplash-6.jpg";
import bodysplash7 from "@/assets/bodysplash-7.webp";
import bodysplash8 from "@/assets/bodysplash-8.jpg";
import bodysplash9 from "@/assets/bodysplash-9.jpg";
import bodysplash10 from "@/assets/bodysplash-10.jpg";
import bodysplash11 from "@/assets/bodysplash-11.jpg";
import bodysplash12 from "@/assets/bodysplash-12.jpg";
import bodysplash13 from "@/assets/bodysplash-13.jpg";
import bodysplash14 from "@/assets/bodysplash-14.jpg";
import bodysplash15 from "@/assets/bodysplash-15.jpg";
import bodysplash16 from "@/assets/bodysplash-16.jpg";
import bodysplash17 from "@/assets/bodysplash-17.jpg";
import bodysplash18 from "@/assets/bodysplash-18.jpg";
import bodysplash19 from "@/assets/bodysplash-19.jpg";
import bodysplash20 from "@/assets/bodysplash-20.jpg";
import bodysplash21 from "@/assets/bodysplash-21.png";
import bodysplash22 from "@/assets/bodysplash-22.jpg";
import bodysplash23 from "@/assets/bodysplash-23.jpg";
import type { Product } from "./types";

// Helper to cycle perfume images
const pImg = [perfume1, perfume2, perfume3, perfume4, perfume5, perfume6];
const pi = (i: number) => pImg[i % pImg.length];

export const signatureScentProducts: Product[] = [
  // ═══════════════════════════════════════════
  // PERFUMES (55 total)
  // ═══════════════════════════════════════════

  // --- Men's Perfumes ---
  {
    id: "1", name: "Explore the One", price: 145.38, image: perfume11, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Oriental",
    description: "A refined masculine fragrance blending warm spices with deep woods for a confident and adventurous spirit.",
    notes: { top: ["Grapefruit", "Black Pepper"], middle: ["Cardamom", "Lavender"], base: ["Amber", "Cedarwood", "Patchouli"] },
    size: "100ml", rating: 4.9, stock: 15,
  },
  {
    id: "2", name: "Matelot", price: 161.51, image: perfume12, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Woody",
    description: "A refreshing marine fragrance inspired by the open sea, blending crisp citrus with oceanic accords.",
    notes: { top: ["Lemon", "Sea Breeze"], middle: ["Lavender", "Marine Notes"], base: ["Driftwood", "Amber", "Musk"] },
    size: "100ml", rating: 4.8, stock: 12,
  },
  {
    id: "7", name: "Aventos Blue", price: 145.38, image: perfume13, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Woody",
    description: "A powerful blend of fresh fruits and smoky woods delivering a bold and charismatic masculine scent.",
    notes: { top: ["Pineapple", "Apple", "Bergamot"], middle: ["Birch", "Jasmine"], base: ["Musk", "Oakmoss", "Vanilla"] },
    size: "100ml", rating: 4.7, stock: 18,
  },
  {
    id: "9", name: "Hunted by Night", price: 145.38, image: perfume14, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Woody",
    description: "A dark and mysterious scent with smoky woods and spicy accords designed for evening sophistication.",
    notes: { top: ["Mandarin", "Pink Pepper"], middle: ["Cinnamon", "Clove"], base: ["Amber", "Tonka Bean", "Leather"] },
    size: "100ml", rating: 4.9, stock: 10,
  },
  {
    id: "11", name: "Suave Elixir", price: 145.38, image: perfume15, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Oriental",
    description: "An intoxicating elixir combining warm amber, spices, and creamy woods for a bold and elegant presence.",
    notes: { top: ["Nutmeg", "Cinnamon"], middle: ["Lavender", "Amber"], base: ["Sandalwood", "Tonka Bean", "Vanilla"] },
    size: "100ml", rating: 4.8, stock: 7,
  },
  {
    id: "32", name: "Bad Lad", price: 145.38, image: perfume16, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Oriental",
    description: "A rebellious fragrance mixing fiery spices with deep woods for a daring masculine edge.",
    notes: { top: ["Black Pepper", "Bergamot"], middle: ["Geranium", "Sage"], base: ["Leather", "Cedarwood", "Amber"] },
    size: "100ml", rating: 4.7, stock: 14,
  },
  {
    id: "33", name: "Oniro", price: 145.38, image: perfume17, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Fresh",
    description: "A dreamlike composition of aromatic herbs and smooth woods creating a calm yet powerful aura.",
    notes: { top: ["Bergamot", "Mint"], middle: ["Lavender", "Clary Sage"], base: ["Sandalwood", "Musk", "Vetiver"] },
    size: "75ml", rating: 4.6, stock: 22,
  },
  {
    id: "34", name: "Barakkat Rouge 540", price: 145.38, image: perfume18, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Woody",
    description: "A luxurious blend of amber, saffron, and sweet woods delivering a rich and unforgettable signature.",
    notes: { top: ["Saffron", "Jasmine"], middle: ["Amberwood", "Ambergris"], base: ["Fir Resin", "Cedar"] },
    size: "100ml", rating: 4.8, stock: 11,
  },
  {
    id: "35", name: "Zaraman", price: 145.38, image: perfume19, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Fresh",
    description: "A smooth masculine scent blending citrus freshness with deep woody warmth.",
    notes: { top: ["Lemon", "Bergamot"], middle: ["Lavender", "Nutmeg"], base: ["Cedarwood", "Amber", "Musk"] },
    size: "75ml", rating: 4.5, stock: 25,
  },
  {
    id: "36", name: "Montera Rouge Tobacco", price: 161.5, image: perfume20, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Oriental",
    description: "A rich and smoky fragrance with warm tobacco leaves, spices, and sweet vanilla undertones.",
    notes: { top: ["Cinnamon", "Saffron"], middle: ["Tobacco", "Clove"], base: ["Vanilla", "Amber", "Sandalwood"] },
    size: "100ml", rating: 4.9, stock: 8,
  },
  {
    id: "37", name: "Oud De Arabia", price: 161.51, image: perfume21, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Woody",
    description: "A powerful Middle Eastern inspired fragrance blending rich oud wood with warm spices and smoky depth.",
    notes: { top: ["Saffron", "Rose"], middle: ["Oud", "Patchouli"], base: ["Amber", "Sandalwood", "Musk"] },
    size: "100ml", rating: 4.7, stock: 16,
  },
  {
    id: "38", name: "Suspenso", price: 145.38, image: perfume22, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Woody",
    description: "A mysterious fragrance with dark spices and deep woods creating a bold and suspenseful presence.",
    notes: { top: ["Black Pepper", "Bergamot"], middle: ["Cardamom", "Geranium"], base: ["Vetiver", "Amber", "Cedarwood"] },
    size: "75ml", rating: 4.6, stock: 19,
  },
  {
    id: "39", name: "Vanille Bouquet", price: 161.5, image: perfume23, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Oriental",
    description: "A warm and addictive fragrance combining creamy vanilla with subtle spices and soft woody tones.",
    notes: { top: ["Vanilla Orchid", "Bergamot"], middle: ["Caramel", "Jasmine"], base: ["Tonka Bean", "Amber", "Sandalwood"] },
    size: "100ml", rating: 4.8, stock: 9,
  },
  {
    id: "40", name: "Black Leather", price: 161.51, image: perfume24, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Fresh",
    description: "A bold masculine scent built around smooth black leather with smoky woods and spicy undertones.",
    notes: { top: ["Cardamom", "Bergamot"], middle: ["Leather", "Jasmine"], base: ["Patchouli", "Amber", "Vetiver"] },
    size: "75ml", rating: 4.5, stock: 28,
  },
  {
    id: "41", name: "Oud Madness", price: 161.51, image: perfume25, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Oriental",
    description: "An intense and luxurious oud fragrance layered with dark spices and smoky amber warmth.",
    notes: { top: ["Saffron", "Nutmeg"], middle: ["Oud", "Rose"], base: ["Amber", "Musk", "Sandalwood"] },
    size: "100ml", rating: 4.9, stock: 20,
  },
   {
    id: "50", name: "Fiero Bleu Man", price: 145.38, image: perfume26, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Oriental",
    description: "A vibrant and energetic fragrance combining fresh citrus with aromatic herbs and smooth woods.",
    notes: { top: ["Lemon", "Mint"], middle: ["Lavender", "Geranium"], base: ["Cedarwood", "Amber", "Musk"] },
    size: "100ml", rating: 4.7, stock: 20,
  },
  {
    id: "51", name: "Catch de Noire", price: 145.38, image: perfume27, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Floral",
    description: "A sophisticated fragrance with dark woods and spicy accords that leave a lasting impression.",
    notes: { top: ["Bergamot", "Black Pepper"], middle: ["Lavender", "Nutmeg"], base: ["Patchouli", "Amber", "Vetiver"] },
    size: "75ml", rating: 4.6, stock: 20,
  },
  {
    id: "52", name: "Oud al Layl", price: 166.88, image: perfume28, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Oriental",
    description: "A deep and luxurious night-time fragrance rich with oud, spices, and warm oriental sweetness.",
    notes: { top: ["Saffron", "Rose"], middle: ["Oud", "Incense"], base: ["Amber", "Musk", "Sandalwood"] },
    size: "100ml", rating: 4.9, stock: 9,
  },
  {
    id: "53", name: "Suits", price: 161.5, image: perfume29, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Floral",
    description: "An elegant gentleman’s fragrance with refined aromatics and smooth woody sophistication.",
    notes: { top: ["Bergamot", "Apple"], middle: ["Lavender", "Clary Sage"], base: ["Cedarwood", "Amber", "Vetiver"] },
    size: "75ml", rating: 4.5, stock: 26,
  },
  {
    id: "59", name: "Urban Man Elixir", price: 161.5, image: perfume30, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Woody",
    description: "A bold city-inspired elixir blending spicy freshness with warm amber and smoky woods.",
    notes: { top: ["Grapefruit", "Cardamom"], middle: ["Lavender", "Nutmeg"], base: ["Amber", "Patchouli", "Vetiver"] },
    size: "100ml", rating: 4.7, stock: 15,
  },
  {
    id: "60", name: "Valiance", price: 161.5, image: perfume31, category: "signature-scents", gender: "men", subcategory: "perfume", family: "Oriental",
    description: "A confident and uplifting fragrance combining fresh citrus with strong masculine woods.",
    notes: { top: ["Lemon", "Bergamot"], middle: ["Geranium", "Lavender"], base: ["Cedarwood", "Amber", "Musk"] },
    size: "100ml", rating: 4.9, stock: 6,
  },
  

  // --- Women's Perfumes ---
  {
    id: "3", name: "Ador", price: 161.51, image: perfume32, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Floral",
    description: "A luminous feminine fragrance blending delicate florals with soft sweetness for a graceful everyday elegance.",
    notes: { top: ["Pear", "Mandarin"], middle: ["Jasmine", "Rose"], base: ["Vanilla", "White Musk", "Cedarwood"] },
    size: "75ml", rating: 4.4, stock: 20,
  },
  {
    id: "8", name: "Rose Seduction Secret", price: 161.51, image: perfume33, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Floral",
    description: "A romantic fragrance centered on blooming roses layered with soft fruits and warm musky elegance.",
    notes: { top: ["Red Berries", "Bergamot"], middle: ["Rose", "Peony"], base: ["Musk", "Amber", "Vanilla"] },
    size: "75ml", rating: 4.4, stock: 14,
  },
  {
    id: "12", name: "Rose Seduction Secret Temptation", price: 161.51, image: perfume34, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Floral",
    description: "A seductive blend of sweet fruits and blooming roses wrapped in warm amber and creamy vanilla.",
    notes: { top: ["Raspberry", "Pear"], middle: ["Rose", "Jasmine"], base: ["Amber", "Vanilla", "Musk"] },
    size: "75ml", rating: 4.4, stock: 22,
  },
  {
    id: "42", name: "Rose Seduction Secret Las Vegas", price: 161.51, image: perfume35, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Floral",
    description: "A glamorous fragrance inspired by nightlife with sparkling fruits, romantic roses, and creamy sweetness.",
    notes: { top: ["Blackcurrant", "Orange"], middle: ["Rose", "Gardenia"], base: ["Vanilla", "Amber", "Sandalwood"] },
    size: "75ml", rating: 4.4, stock: 16,
  },
  {
    id: "43", name: "Rose Seduction Secret Essence", price: 161.51, image: perfume36, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Floral",
    description: "An elegant bouquet of fresh roses and delicate florals softened by warm musk and smooth woods.",
    notes: { top: ["Pink Pepper", "Bergamot"], middle: ["Rose", "Lily"], base: ["White Musk", "Amber", "Cedarwood"] },
    size: "75ml", rating: 4.4, stock: 20,
  },
  {
    id: "44", name: "Rose Seduction Sunkissed", price: 161.51, image: perfume37, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Oriental",
    description: "A bright and sunny fragrance blending fresh roses with citrus and soft summer florals.",
    notes: { top: ["Mandarin", "Lemon"], middle: ["Rose", "Peony"], base: ["White Musk", "Amber"] },
    size: "100ml", rating: 4.4, stock: 12,
  },
  {
    id: "45", name: "Rose Seduction Secret Amor", price: 161.51, image: perfume38, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Floral",
    description: "A charming fragrance featuring romantic rose petals blended with juicy fruits and soft vanilla warmth.",
    notes: { top: ["Strawberry", "Mandarin"], middle: ["Rose", "Peony"], base: ["Vanilla", "Musk", "Amber"] },
    size: "75ml", rating: 4.4, stock: 30,
  },
  {
    id: "46", name: "La Nuit Rose a l'Amour", price: 161.51, image: perfume39, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Floral",
    description: "A delicate and romantic fragrance inspired by blooming roses and soft powdery elegance.",
    notes: { top: ["Pink Pepper", "Mandarin"], middle: ["Rose", "Iris"], base: ["White Musk", "Amber", "Sandalwood"] },
    size: "100ml", rating: 4.4, stock: 10,
  },
  {
    id: "47", name: "Gabrielle Bloom", price: 161.51, image: perfume40, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Oriental",
    description: "A radiant bouquet of white flowers creating a luminous and elegant feminine fragrance.",
    notes: { top: ["Orange Blossom", "Mandarin"], middle: ["Jasmine", "Tuberose"], base: ["Sandalwood", "Musk"] },
    size: "75ml", rating: 4.4, stock: 24,
  },
  {
    id: "48", name: "Elysia Marshmallow", price: 145.38, image: perfume41, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Oriental",
    description: "A playful sweet fragrance with fluffy marshmallow, creamy vanilla, and soft floral undertones.",
    notes: { top: ["Marshmallow", "Pear"], middle: ["Jasmine", "Sugar"], base: ["Vanilla", "Tonka Bean", "Musk"] },
    size: "100ml", rating: 4.4, stock: 18,
  },
  {
    id: "6", name: "Kristal Eau de Parfum", price: 145.38, image: perfume1, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Oriental",
    description: "A radiant blend of juicy fruits and soft florals wrapped in creamy vanilla for a luxurious and feminine signature.",
    notes: { top: ["Passion Fruit", "Peach", "Raspberry"], middle: ["Lily", "Pear Blossom"], base: ["Vanilla", "Musk", "Sandalwood"] },
    size: "100ml", rating: 4.4, stock: 5,
  },
  {
    id: "58", name: "Versus Océan Bleu", price: 145.38, image: perfume10, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Oriental",
    description: "A refreshing ocean-inspired scent blending crisp citrus, marine accords, and smooth driftwood.",
    notes: { top: ["Sea Breeze", "Lemon"], middle: ["Lavender", "Marine Notes"], base: ["Driftwood", "Amber", "Musk"] },
    size: "100ml", rating: 4.4, stock: 7,
  },
 

  // --- Unisex Perfumes ---
  {
    id: "4", name: "Dolores", price: 145.38, image: perfume5, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Oriental",
    description: "A vibrant escape into lush gardens with green fig leaves, aromatic herbs, and earthy woods.",
    notes: { top: ["Fig Leaf", "Basil"], middle: ["Green Tea", "Bamboo"], base: ["Vetiver", "White Cedar"] },
    size: "100ml", rating: 4.4, stock: 8,
  },
  {
    id: "5", name: "Extreamely Unique Pistachio", price: 145.38, image: perfume7, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Fresh",
    description: "A deliciously addictive blend of creamy pistachio, sweet vanilla, and warm caramelized nuts.",
    notes: { top: ["Pistachio", "Almond"], middle: ["Heliotrope", "Vanilla Cream"], base: ["Tonka Bean", "Caramel", "Musk"] },
    size: "75ml", rating: 4.4, stock: 25,
  },
  
  {
    id: "10", name: "Extreamely Unique", price: 145.38, image: perfume2, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Fresh",
    description: "An intensely seductive composition of dark woods, leather, and smoky vetiver for the modern gentleman.",
    notes: { top: ["Bergamot", "Lemon"], middle: ["Lavender", "Spice"], base: ["Amber", "Cedarwood", "Musk"] },
    size: "75ml", rating: 4.4, stock: 30,
  },
  {
    id: "54", name: "Ophylia", price: 145.38, image: perfume4, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Oriental",
    description: "A graceful bouquet of luminous florals layered with creamy woods, capturing elegance and timeless beauty.",
    notes: { top: ["Peony", "Mandarin"], middle: ["Rose", "Magnolia"], base: ["White Musk", "Sandalwood"] },
    size: "100ml", rating: 4.4, stock: 12,
  },
  {
    id: "55", name: "Ur Way", price: 145.38, image: perfume6, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Fresh",
    description: "A modern fragrance celebrating independence with radiant florals and a warm sensual base.",
    notes: { top: ["Orange Blossom", "Pear"], middle: ["Tuberose", "Jasmine"], base: ["Vanilla", "Cedarwood", "White Musk"] },
    size: "75ml", rating: 4.4, stock: 18,
  },
  {
    id: "56", name: "Berries Weekend", price: 145.38, image: perfume8, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Oriental",
    description: "A joyful splash of sweet berries and delicate florals capturing the carefree spirit of a perfect weekend.",
    notes: { top: ["Strawberry", "Blackcurrant"], middle: ["Peony", "Rose"], base: ["Vanilla", "Soft Musk"] },
    size: "100ml", rating: 4.5, stock: 10,
  },
  {
    id: "57", name: "Queen of Red", price: 145.38, image: perfume9, category: "signature-scents", gender: "women", subcategory: "perfume", family: "Fresh",
    description: "A bold and glamorous fragrance of luscious red fruits and elegant florals with a sensual amber finish.",
    notes: { top: ["Cherry", "Red Berries"], middle: ["Rose", "Jasmine"], base: ["Amber", "Vanilla", "Patchouli"] },
    size: "75ml", rating: 4.4, stock: 32,
  },
  
 /** {
    id: "61", name: "Figue & Olive", price: 650, image: pi(3), category: "signature-scents", gender: "women", subcategory: "perfume", family: "Fresh",
    description: "A Mediterranean escape of ripe figs, olive leaves, and sun-dried herbs.",
    notes: { top: ["Fig", "Lemon"], middle: ["Olive Leaf", "Thyme"], base: ["Sandalwood", "Musk"] },
    size: "75ml", rating: 4.6, stock: 22,
  },*/ 

  // ═══════════════════════════════════════════
  // BODY SPLASHES (15 total)
  // ═══════════════════════════════════════════

  // --- Unisex Body Splashes ---
  {
    id: "13", name: "Body Philosophy Berry Blast", price: 129.25, image: bodysplash15, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh",
    description: "A vibrant body splash bursting with juicy berries, sweet sugar crystals, and soft vanilla for a playful and refreshing scent.",
    notes: { top: ["Strawberry", "Raspberry"], middle: ["Blackberry", "Peony"], base: ["Vanilla", "Musk", "Sugar"] },
    size: "300ml", rating: 4.5, stock: 40,
  },
  {
    id: "62", name: "Body Philosophy Cotton Candy", price: 129.25, image: bodysplash17, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh",
    description: "A dreamy and sugary fragrance inspired by fluffy cotton candy blended with creamy vanilla and soft caramel.",
    notes: { top: ["Pink Sugar", "Berry"], middle: ["Cotton Candy", "Vanilla Cream"], base: ["Caramel", "Musk", "Tonka Bean"] },
    size: "300ml", rating: 4.4, stock: 50,
  },
  {
    id: "63", name: "Body Philosophy Milk Cookies", price: 129.25, image: bodysplash14, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh",
    description: "A cozy dessert-inspired body splash with creamy milk, warm cookies, and sweet vanilla for a comforting scent.",
    notes: { top: ["Milk", "Sugar"], middle: ["Cookie Dough", "Vanilla"], base: ["Caramel", "Musk", "Tonka Bean"] },
    size: "300ml", rating: 4.5, stock: 45,
  },
  {
    id: "64", name: "Body Philosophy Candy Shop", price: 129.25, image: bodysplash13, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh",
    description: "A fun and playful fragrance filled with sweet candy accords, juicy fruits, and creamy vanilla.",
    notes: { top: ["Mixed Berries", "Citrus"], middle: ["Candy Accord", "Rose"], base: ["Vanilla", "Musk", "Amber"] },
    size: "300ml", rating: 4.6, stock: 38,
  },
  {
    id: "74", name: "Body Philosophy Cherry Luxe", price: 129.25, image: bodysplash16, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh",
    description: "A luxurious and seductive body splash with rich cherries, sweet vanilla, and warm amber for a bold feminine scent.",
    notes: { top: ["Black Cherry", "Red Berries"], middle: ["Rose", "Almond"], base: ["Vanilla", "Amber", "Musk"] },
    size: "300ml", rating: 4.6, stock: 38,
  },
  

  // --- Women's Body Splashes ---
  {
    id: "14", name: "Vinecya's Secret Cake Confetti", price: 129.25, image: bodysplash2, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Floral",
    description: "A playful and delicious body splash blending sweet cake notes, creamy vanilla, and sugary delights for a fun and feminine scent.",
    notes: { top: ["Sugar Crystals", "Berry"], middle: ["Vanilla Cake", "Caramel"], base: ["Vanilla", "Musk", "Tonka Bean"] },
    size: "250ml", rating: 4.6, stock: 35,
  },
  {
    id: "66", name: "Vinecya's Secret Sugar Black Intense", price: 129.25, image: bodysplash9, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh",
    description: "A bold and seductive body splash with dark berries, sweet sugar accords, and warm amber for a mysterious feminine aura.",
    notes: { top: ["Blackcurrant", "Raspberry"], middle: ["Rose", "Sugar Accord"], base: ["Amber", "Vanilla", "Musk"] },
    size: "250ml", rating: 4.5, stock: 42,
  },
  {
    id: "67", name: "Vinecya's Secret Choco Obsession", price: 129.25, image: bodysplash10, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Floral",
    description: "A rich and indulgent fragrance bursting with creamy chocolate, sweet vanilla, and soft caramel for a warm dessert-like scent.",
    notes: { top: ["Chocolate", "Cocoa"], middle: ["Caramel", "Cream"], base: ["Vanilla", "Amber", "Musk"] },
    size: "250ml", rating: 4.6, stock: 40,
  },
  {
    id: "68", name: "Vinecya's Secret Sugar Pink Intense", price: 129.25, image: bodysplash23, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Oriental",
    description: "A vibrant and feminine body splash combining juicy fruits, pink sugar, and soft florals for a bright and playful scent.",
    notes: { top: ["Strawberry", "Raspberry"], middle: ["Peony", "Pink Sugar"], base: ["Vanilla", "Musk", "Amber"] },
    size: "250ml", rating: 4.7, stock: 36,
  },
  {
    id: "69", name: "Vinecya's Secret Love Spell", price: 129.25, image: bodysplash8, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh",
    description: "A romantic and irresistible fragrance blending juicy peach, cherry blossom, and soft florals for a sweet enchanting scent.",
    notes: { top: ["Peach", "Cherry Blossom"], middle: ["Jasmine", "Apple Blossom"], base: ["Vanilla", "Musk", "Amber"] },
    size: "250ml", rating: 4.4, stock: 48,
  },
  {
    id: "75", name: "Vinecya's Secret Pure Seduction", price: 129.25, image: bodysplash3, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh",
    description: "A seductive blend of juicy red plum, sweet berries, and delicate florals creating a vibrant and feminine fragrance.",
    notes: { top: ["Red Plum", "Wild Berries"], middle: ["Jasmine", "Freesia"], base: ["Vanilla", "Amber", "Musk"] },
    size: "250ml", rating: 4.4, stock: 48,
  },
  {
    id: "76", name: "Vinecya's Secret Bare Vanilla", price: 129.25, image: bodysplash5, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh",
    description: "A comforting and creamy body splash with whipped vanilla, soft caramel, and warm amber for a cozy feminine scent.",
    notes: { top: ["Whipped Cream", "Sugar"], middle: ["Vanilla Orchid", "Caramel"], base: ["Amber", "Musk", "Tonka Bean"] },
    size: "250ml", rating: 4.4, stock: 48,
  },
  {
    id: "77", name: "Vinecya's Secret Sugar White", price: 129.25, image: bodysplash11, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh",
    description: "A delicate and airy fragrance with soft white florals, creamy vanilla, and subtle musk for a clean feminine scent.",
    notes: { top: ["Pear", "White Peach"], middle: ["White Lily", "Jasmine"], base: ["Vanilla", "Musk", "Sandalwood"] },
    size: "250ml", rating: 4.4, stock: 48,
  },
  {
    id: "78", name: "Vinecya's Secret Bombshell", price: 129.25, image: bodysplash6, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh",
    description: "A bold and glamorous body splash with sparkling fruits, floral elegance, and warm musk for a confident feminine scent.",
    notes: { top: ["Passion Fruit", "Grapefruit"], middle: ["Peony", "Vanilla Orchid"], base: ["Musk", "Amber", "Wood"] },
    size: "250ml", rating: 4.4, stock: 48,
  },
  {
  id: "79", name: "Vinecya's Secret Amber Romance", price: 129.25, image: bodysplash7, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Warm Amber",
  description: "A warm and sensual fragrance featuring golden amber, creamy vanilla, and soft woods for a romantic and cozy scent.",
  notes: { top: ["Cherry", "Sugar"], middle: ["Amber", "Vanilla"], base: ["Sandalwood", "Musk", "Tonka Bean"] },
  size: "250ml", rating: 4.6, stock: 41,
},

{
  id: "80", name: "Vinecya's Secret New York", price: 129.25, image: bodysplash4, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh Floral",
  description: "A vibrant city-inspired fragrance blending fresh citrus, delicate florals, and soft musk for a modern feminine scent.",
  notes: { top: ["Mandarin", "Apple"], middle: ["Rose", "Peony"], base: ["Musk", "Amber", "Cedarwood"] },
  size: "250ml", rating: 4.5, stock: 36,
},

{
  id: "81", name: "Vinecya's Secret Sugar Green", price: 129.25, image: bodysplash12, category: "signature-scents", gender: "women", subcategory: "body-splash", family: "Fresh Fruity",
  description: "A refreshing and youthful fragrance combining crisp green apple, sweet sugar notes, and soft florals.",
  notes: { top: ["Green Apple", "Citrus"], middle: ["Peony", "Lily"], base: ["Vanilla", "Musk", "Amber"] },
  size: "250ml", rating: 4.6, stock: 38,
},

  // --- Men's Body Splashes ---
  {
    id: "15", name: "Body Philosophy Odyssey Mandarin Sky Elixir Edition", price: 129.25, image: bodysplash20, category: "signature-scents", gender: "men", subcategory: "body-splash", family: "Fresh",
    description: "A vibrant body splash bursting with juicy mandarin, sweet caramel, and creamy vanilla for a bold and addictive scent.",
    notes: { top: ["Mandarin", "Orange", "Bergamot"], middle: ["Caramel", "Tonka Bean"], base: ["Vanilla", "Amber", "Musk"] },
    size: "250ml", rating: 4.4, stock: 45,
  },
  {
    id: "70", name: "Body Philosophy Odyssey Aoud Edition", price: 129.25, image: bodysplash22, category: "signature-scents", gender: "men", subcategory: "body-splash", family: "Fresh",
    description: "A deep and luxurious body splash featuring rich oud wood, warm spices, and smoky amber for a bold masculine presence.",
    notes: { top: ["Saffron", "Spicy Notes"], middle: ["Oud", "Rose"], base: ["Amber", "Sandalwood", "Musk"] },
    size: "250ml", rating: 4.5, stock: 50,
  },
  {
    id: "71", name: "Body Philosophy Odyssey Admiral", price: 129.25, image: bodysplash21, category: "signature-scents", gender: "men", subcategory: "body-splash", family: "Woody",
    description: "A modern and refreshing body splash blending crisp citrus, aromatic herbs, and smooth woody notes for everyday confidence.",
    notes: { top: ["Bergamot", "Lemon"], middle: ["Lavender", "Clary Sage"], base: ["Cedarwood", "Amber", "Musk"] },
    size: "250ml", rating: 4.6, stock: 38,
  },
  {
    id: "72", name: "Body Philosophy Odyssey Dubai Chocolat", price: 129.25, image: bodysplash1, category: "signature-scents", gender: "men", subcategory: "body-splash", family: "Fresh",
    description: "A rich gourmand body splash with indulgent chocolate, creamy vanilla, and warm caramel for a sweet yet masculine scent.",
    notes: { top: ["Chocolate", "Coffee"], middle: ["Caramel", "Vanilla"], base: ["Amber", "Tonka Bean", "Musk"] },
    size: "250ml", rating: 4.3, stock: 55,
  },
  {
    id: "73", name: "Body Philosophy Odyssey Wild One", price: 129.25, image: bodysplash18, category: "signature-scents", gender: "men", subcategory: "body-splash", family: "Oriental",
    description: "A daring body splash combining vibrant citrus, spicy accords, and rugged woods for a bold and adventurous fragrance.",
    notes: { top: ["Grapefruit", "Lemon"], middle: ["Black Pepper", "Lavender"], base: ["Cedarwood", "Patchouli", "Amber"] },
    size: "250ml", rating: 4.7, stock: 32,
  },
  {
    id: "65", name: "Body Philosophy Odyssey Homme", price: 129.25, image: bodysplash19, category: "signature-scents", gender: "unisex", subcategory: "body-splash", family: "Oriental",
    description: "A refined masculine body splash blending aromatic spices, smooth amber, and warm woods for a confident everyday scent.",
    notes: { top: ["Bergamot", "Pink Pepper"], middle: ["Lavender", "Geranium"], base: ["Amber", "Vetiver", "Sandalwood"] },
    size: "250ml", rating: 4.7, stock: 35,
  },
];
