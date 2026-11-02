import type { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout/checkout-form"

export const metadata: Metadata = { title: "Kasse – Grocery Prototype" }

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-8 lg:py-8">
      <CheckoutForm />
    </div>
  )
}
