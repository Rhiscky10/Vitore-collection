export type { Product, ProductCategory, ProductGender, ProductSubcategory } from "./types";
export { categoryLabels, subcategoryLabels } from "./types";

import { signatureScentProducts } from "./signature-scents";
import { beautyEssentialsProducts } from "./beauty-essentials";
import { everydayStyleProducts } from "./everyday-style";
import { footwearApparelProducts } from "./footwear-apparel";
import { comfortCareProducts } from "./comfort-care";

export const products = [
  ...signatureScentProducts,
  ...beautyEssentialsProducts,
  ...everydayStyleProducts,
  ...footwearApparelProducts,
  ...comfortCareProducts,
];
