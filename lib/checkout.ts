import { DELIVERABLE_POSTCODES, DELIVERY_CITY } from "@/config"
import { isDeliverablePostcode, isValidPostcodeFormat } from "@/lib/pricing"

export type SectionStatus = "done" | "open" | "error"

export type Address = { street: string; number: string; postcode: string; city: string }
export type Contact = { firstName: string; lastName: string; email: string; phone: string }

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export function validateAddress(a: Address): FieldErrors<Address> {
  const errors: FieldErrors<Address> = {}
  if (!a.street.trim()) errors.street = "Bitte gib deine Straße an."
  else if (/\d/.test(a.street)) errors.street = "Bitte die Hausnummer ins eigene Feld eintragen."
  if (!a.number.trim()) errors.number = "Bitte gib die Hausnummer an."
  else if (!/^\d+\s?[a-zA-Z]?(\s?[-/]\s?\d+[a-zA-Z]?)?$/.test(a.number.trim()))
    errors.number = "Bitte z. B. 12 oder 12a eingeben."
  if (!a.postcode.trim()) errors.postcode = "Bitte gib deine PLZ an."
  else if (!isValidPostcodeFormat(a.postcode.trim())) errors.postcode = "Die PLZ hat 5 Ziffern."
  else if (!isDeliverablePostcode(a.postcode.trim()))
    errors.postcode = `Wir liefern nur nach ${DELIVERY_CITY} (${DELIVERABLE_POSTCODES.from}–${DELIVERABLE_POSTCODES.to}).`
  if (!a.city.trim()) errors.city = "Bitte gib den Ort an."
  return errors
}

export function validateContact(c: Contact): FieldErrors<Contact> {
  const errors: FieldErrors<Contact> = {}
  if (!c.firstName.trim()) errors.firstName = "Bitte gib deinen Vornamen an."
  if (!c.lastName.trim()) errors.lastName = "Bitte gib deinen Nachnamen an."
  if (!c.email.trim()) errors.email = "Bitte gib deine E-Mail-Adresse an."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim())) errors.email = "Bitte prüfe die E-Mail-Adresse."
  if (!c.phone.trim()) errors.phone = "Für Rückfragen des Kuriers brauchen wir deine Nummer."
  else if (!/^\+?[\d\s/-]{6,20}$/.test(c.phone.trim())) errors.phone = "Bitte z. B. 0151 2345678 eingeben."
  return errors
}
