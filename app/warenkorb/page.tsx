import type { Metadata } from "next"
import { CartPageContent } from "@/components/cart/cart-page-content"

export const metadata: Metadata = { title: "Warenkorb – Grocery Prototype" }

export default function CartPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-8 lg:py-8">
      <CartPageContent />
    </div>
  )
}
