import { expect, test, type Page } from "@playwright/test"

test.use({ reducedMotion: "reduce" })

function normalize(text: string) {
  return text.replace(/\u00a0/g, " ").trim()
}

async function addProduct(page: Page, name: string, times: number) {
  await page.getByRole("button", { name: `${name} in den Warenkorb legen` }).click()
  const more = page.getByRole("button", { name: `${name}: eins mehr` })
  for (let i = 1; i < times; i++) await more.click()
  await expect(page.getByRole("group", { name: `Menge ${name}` })).toContainText(String(times))
}

test("reduced motion shows the finished confirmation immediately", async ({ page }) => {
  test.setTimeout(60_000)
  await page.goto("/")
  await page.getByRole("button", { name: "80331 eintragen und prüfen (Liefergebiet)" }).click()
  await page.getByRole("button", { name: "Jetzt einkaufen" }).click()

  await addProduct(page, "Kaffee ganze Bohne", 2)
  await page.getByRole("button", { name: /Warenkorb öffnen/ }).click()
  await page.getByRole("link", { name: /Weiter zum Warenkorb/ }).click()
  await page.getByRole("region", { name: "Zusammenfassung" }).getByRole("link", { name: "Zur Kasse", exact: true }).click()
  await expect(page).toHaveURL(/\/kasse$/)

  await page.getByRole("button", { name: "Standort verwenden" }).click()
  await expect(page.getByText("Demo: Beispieladresse")).toBeVisible()
  await page.getByLabel("Vorname").fill("Ada")
  await page.getByLabel("Nachname").fill("Lovelace")
  await page.getByLabel("E-Mail").fill("ada@example.com")
  await page.getByLabel("Telefon").fill("0151 2345678")
  await page.locator("label", { hasText: "14–15 Uhr" }).click()
  await page.locator("label", { hasText: "PayPal" }).click()

  const orderButton = page.locator("#bestellen-button")
  await expect(orderButton).toContainText("Kostenpflichtig bestellen")
  const expected = normalize((await orderButton.innerText()).split("–").pop() ?? "")
  expect(expected).toMatch(/\d+,\d{2} €$/)

  await orderButton.click()
  await expect(page.getByRole("heading", { level: 1, name: /Danke, Ada!/ })).toBeVisible()

  const snapshot = await page.evaluate(() => {
    const amount = document.querySelector("[data-confirm-amount]")?.textContent ?? ""
    const row = document.querySelector(".confirm-row")
    const opacity = row ? getComputedStyle(row).opacity : ""
    const path = document.querySelector("svg.confirm-check path")?.getAttribute("d") ?? ""
    const circleOffset = document.querySelector("svg.confirm-check circle")?.getAttribute("stroke-dashoffset")
    return { amount, opacity, path, circleOffset }
  })

  expect(normalize(snapshot.amount)).toBe(expected)
  expect(snapshot.amount).not.toContain("0,00")
  expect(snapshot.opacity).toBe("1")
  expect(snapshot.path).toBe("M9.00 12.00L11.00 14.00L15.00 10.00")
  expect(snapshot.circleOffset).toBeNull()

  await expect(page.getByText("Lieferung", { exact: true })).toBeVisible()
  await expect(page.getByText("Adresse", { exact: true })).toBeVisible()
  await expect(page.getByText("Zahlung", { exact: true })).toBeVisible()
  await expect(page.getByText(/Gesamt \(2 Artikel\)/)).toBeVisible()
  await expect(page.getByText("Marienplatz 1, 80331 München")).toBeVisible()
  await expect(page.getByText("PayPal", { exact: true })).toBeVisible()
})
