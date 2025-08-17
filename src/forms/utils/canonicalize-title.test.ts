import { canonicalizeTitle } from "./canonicalize-title";

describe("canonicalizeTitle", () => {
  it.each([
    ["Email/ Correo electrónico", "Email / Correo electrónico"],
    ["Email /Correo electrónico", "Email / Correo electrónico"],
    ["Email /  Correo electrónico", "Email / Correo electrónico"],
    ["Email／Correo electrónico", "Email / Correo electrónico"], // full-width slash
    [
      "  Phone Number  /  Número de teléfono  ",
      "Phone Number / Número de teléfono",
    ],
    ["Website / Sitio web", "Website / Sitio web"], // already correct
    ["Address / Dirección", "Address / Dirección"], // already correct
    ["", ""], // empty string
    ["No slash here", "No slash here"], // no slash
    ["Multiple   spaces   here", "Multiple spaces here"], // multiple spaces
  ])("normalizes '%s' to '%s'", (input, expected) => {
    expect(canonicalizeTitle(input)).toBe(expected);
  });

  it("handles null and undefined", () => {
    expect(canonicalizeTitle(null as any)).toBe("");
    expect(canonicalizeTitle(undefined as any)).toBe("");
  });
});
