export type CategoryId = "obst-gemuese" | "milch-eier" | "brot" | "fleisch" | "getraenke" | "vorrat"

export type Category = {
  id: CategoryId
  label: string
  image: string
}

export type Product = {
  id: string
  name: string
  /** Package size, prefixed with "ca." for weighed items. */
  amount: string
  /** Price in EUR for the given amount. */
  price: number
  oldPrice?: number
  discountLabel?: string
  unitPrice: string
  weighed: boolean
  /** Deposit in EUR per unit. */
  pfand?: number
  category: CategoryId
  image: string
}

export const CATEGORIES: Category[] = [
  { id: "obst-gemuese", label: "Obst & Gemüse", image: "/products/aepfel.png" },
  { id: "milch-eier", label: "Milch, Käse & Eier", image: "/products/gouda.png" },
  { id: "brot", label: "Brot & Gebäck", image: "/products/brot.png" },
  { id: "fleisch", label: "Fleisch", image: "/products/haehnchen.png" },
  { id: "getraenke", label: "Getränke", image: "/products/wasser.png" },
  { id: "vorrat", label: "Vorrat", image: "/products/spaghetti.png" },
]

export const PRODUCTS: Product[] = [
  { id: "bananen", name: "Bananen", amount: "ca. 1 kg", price: 1.99, unitPrice: "1,99 €/kg", weighed: true, category: "obst-gemuese", image: "/products/bananen.png" },
  { id: "aepfel", name: "Äpfel Elstar", amount: "ca. 1 kg", price: 2.99, oldPrice: 3.32, discountLabel: "-10 % für dich", unitPrice: "2,99 €/kg", weighed: true, category: "obst-gemuese", image: "/products/aepfel.png" },
  { id: "tomaten", name: "Rispentomaten", amount: "ca. 500 g", price: 1.79, unitPrice: "3,58 €/kg", weighed: true, category: "obst-gemuese", image: "/products/tomaten.png" },
  { id: "gurke", name: "Salatgurke", amount: "1 Stück", price: 0.79, unitPrice: "0,79 €/Stück", weighed: false, category: "obst-gemuese", image: "/products/gurke.png" },
  { id: "avocado", name: "Avocado Hass", amount: "2 Stück", price: 2.49, oldPrice: 2.99, discountLabel: "-16 %", unitPrice: "1,25 €/Stück", weighed: false, category: "obst-gemuese", image: "/products/avocado.png" },
  { id: "milch", name: "Bio Vollmilch 3,8 %", amount: "1 l", price: 1.39, unitPrice: "1,39 €/l", weighed: false, category: "milch-eier", image: "/products/milch.png" },
  { id: "butter", name: "Süßrahmbutter", amount: "250 g", price: 2.29, oldPrice: 2.59, discountLabel: "-11 %", unitPrice: "9,16 €/kg", weighed: false, category: "milch-eier", image: "/products/butter.png" },
  { id: "gouda", name: "Gouda jung, Käsetheke", amount: "ca. 300 g", price: 3.29, unitPrice: "10,97 €/kg", weighed: true, category: "milch-eier", image: "/products/gouda.png" },
  { id: "eier", name: "Freilandeier Größe M", amount: "10 Stück", price: 3.19, unitPrice: "0,32 €/Stück", weighed: false, category: "milch-eier", image: "/products/eier.png" },
  { id: "brot", name: "Bauernbrot", amount: "750 g", price: 3.49, unitPrice: "4,65 €/kg", weighed: false, category: "brot", image: "/products/brot.png" },
  { id: "croissants", name: "Buttercroissants", amount: "4 Stück", price: 2.79, oldPrice: 3.1, discountLabel: "-10 % für dich", unitPrice: "0,70 €/Stück", weighed: false, category: "brot", image: "/products/croissants.png" },
  { id: "haehnchen", name: "Hähnchenbrustfilet", amount: "ca. 400 g", price: 5.99, unitPrice: "14,98 €/kg", weighed: true, category: "fleisch", image: "/products/haehnchen.png" },
  { id: "wasser", name: "Mineralwasser", amount: "6 x 1,5 l", price: 3.54, unitPrice: "0,39 €/l", weighed: false, pfand: 1.5, category: "getraenke", image: "/products/wasser.png" },
  { id: "orangensaft", name: "Orangensaft direkt gepresst", amount: "1 l", price: 2.49, unitPrice: "2,49 €/l", weighed: false, category: "getraenke", image: "/products/orangensaft.png" },
  { id: "spaghetti", name: "Spaghetti", amount: "500 g", price: 1.29, unitPrice: "2,58 €/kg", weighed: false, category: "vorrat", image: "/products/spaghetti.png" },
  { id: "kaffee", name: "Kaffee ganze Bohne", amount: "1 kg", price: 12.99, oldPrice: 14.49, discountLabel: "-10 %", unitPrice: "12,99 €/kg", weighed: false, category: "vorrat", image: "/products/kaffee.png" },
]

const productsById = new Map(PRODUCTS.map((product) => [product.id, product]))

export function getProduct(id: string) {
  return productsById.get(id)
}
