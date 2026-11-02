import type { Metadata } from "next"
import { OrderConfirmation } from "@/components/order-confirmation"

export const metadata: Metadata = { title: "Bestellung bestätigt – Grocery Prototype" }

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <OrderConfirmation />
    </div>
  )
}
