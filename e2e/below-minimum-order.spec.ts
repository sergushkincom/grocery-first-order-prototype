import { expect, test, type Locator, type Page } from "@playwright/test"

/**
 * Five bottles of Mineralwasser: the goods stay under the €20 minimum while the
 * bottle deposit (Pfand) would push the basket over it. The order control must
 * stay disabled and name the gap. Counting Pfand toward the minimum, or dropping
 * the guard, turns "Zur Kasse" into a link and this test fails.
 * One more catalog item then crosses the minimum on goods alone, and checkout opens.
 */

function euroAmounts(text: string) {
  return [...text.matchAll(/(\d{1,3}(?:\.\d{3})*,\d{2})/g)].map((match) =>
    Number(match[1].replaceAll(".", "").replace(",", ".")),
  )
}

function oneEuro(text: string) {
  const amounts = euroAmounts(text)
  if (amounts.length !== 1) throw new Error(`Expected one euro amount in: ${text}`)
  return amounts[0]
}

function gapAndMinimum(text: string) {
  const amounts = euroAmounts(text)
  if (amounts.length !== 2) throw new Error(`Expected the missing amount and the minimum in: ${text}`)
  return { remaining: amounts[0], minimum: amounts[1] }
}

async function amountBeside(summary: Locator, label: string) {
  const labelNode = summary.getByText(label, { exact: true })
  const text = await labelNode.evaluate((element) => element.nextElementSibling?.textContent ?? "")
  return oneEuro(text)
}

async function addProduct(page: Page, name: string, times: number) {
  await page.getByRole("button", { name: `${name} in den Warenkorb legen` }).click()
  const more = page.getByRole("button", { name: `${name}: eins mehr` })
  for (let i = 1; i < times; i++) await more.click()
  await expect(page.getByRole("group", { name: `Menge ${name}` })).toContainText(String(times))
}

async function openCart(page: Page) {
  await page.getByRole("button", { name: /Warenkorb öffnen/ }).click()
  await page.getByRole("link", { name: /Weiter zum Warenkorb/ }).click()
  await expect(page).toHaveURL(/\/warenkorb$/)
  await expect(page.getByRole("heading", { level: 1, name: "Warenkorb" })).toBeVisible()
}

test("postcode 80331 blocks ordering below the minimum, then allows it", async ({ page }) => {
  test.setTimeout(60_000)
  await page.goto("/")

  await page.getByRole("button", { name: "80331 eintragen und prüfen (Liefergebiet)" }).click()
  await expect(page.getByText("Super, wir liefern nach 80331 München!")).toBeVisible()
  await page.getByRole("button", { name: "Jetzt einkaufen" }).click()
  await expect(page.getByRole("button", { name: "Postleitzahl 80331 ändern" })).toBeVisible()

  await addProduct(page, "Mineralwasser", 5)
  await openCart(page)

  const summary = page.getByRole("region", { name: "Zusammenfassung" })
  const orderButton = summary.getByRole("button", { name: "Zur Kasse", exact: true })
  await expect(orderButton).toBeDisabled()
  await expect(orderButton).toHaveAccessibleDescription(/Noch .+ bis zum Mindestbestellwert/)
  await expect(summary.getByRole("link", { name: "Zur Kasse", exact: true })).toHaveCount(0)

  const gap = summary.getByRole("paragraph").filter({ hasText: "Mindestbestellwert" })
  await expect(gap).toBeVisible()
  const { remaining, minimum } = gapAndMinimum(await gap.innerText())
  const goods = await amountBeside(summary, "Warenwert")
  const deposit = await amountBeside(summary, "Pfand")

  expect(goods).toBeLessThan(minimum)
  expect(goods + deposit).toBeGreaterThanOrEqual(minimum)
  expect(remaining).toBeCloseTo(minimum - goods, 2)

  await page.getByRole("link", { name: "Weiter einkaufen" }).click()
  await expect(page).toHaveURL(/\/$/)
  await addProduct(page, "Kaffee ganze Bohne", 1)
  await openCart(page)

  const unlocked = page.getByRole("region", { name: "Zusammenfassung" })
  const checkout = unlocked.getByRole("link", { name: "Zur Kasse", exact: true })
  await expect(checkout).toBeVisible()
  await expect(unlocked.getByRole("button", { name: "Zur Kasse", exact: true })).toHaveCount(0)
  await expect(unlocked.getByRole("paragraph").filter({ hasText: "Mindestbestellwert" })).toHaveCount(0)
  expect(await amountBeside(unlocked, "Warenwert")).toBeGreaterThanOrEqual(minimum)

  await checkout.click()
  await expect(page).toHaveURL(/\/kasse$/)
  await expect(page.getByRole("heading", { level: 1, name: "Kasse" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Noch nicht bereit für die Kasse" })).toHaveCount(0)
  await expect(page.locator("#bestellen-button")).toBeVisible()
  await expect(page.locator("#bestellen-button")).not.toContainText("Mindestbestellwert")
})
