import { test, expect } from "bun:test";
import { citySlug, jobsInCity, vacancyCities, isCityCountry } from "./city-jobs.ts";

const jobs = [
  { country: "Netherlands", city: "Apeldoorn", slug: "nl-one" },
  { country: "Netherlands", city: " Apeldoorn ", slug: "nl-two" },
  { country: "Germany", city: "Apeldoorn", slug: "de-one" },
  { country: "Netherlands", city: "Apeldoorn Zuid", slug: "nl-other" },
];
test("city search keeps country boundaries and exact city matches", () => {
  expect(jobsInCity(jobs, "netherlands", "apeldoorn").map(j => j.slug)).toEqual(["nl-one", "nl-two"]);
  expect(jobsInCity(jobs, "germany", "apeldoorn").map(j => j.slug)).toEqual(["de-one"]);
});
test("cities without active vacancies remain empty", () => {
  expect(jobsInCity(jobs, "germany", "berlin")).toEqual([]);
});
test("city URLs normalize accents, spaces and punctuation", () => {
  expect(citySlug("München")).toBe("munchen");
  expect(citySlug(" 's-Hertogenbosch ")).toBe("s-hertogenbosch");
});
test("city directory derives counts only from supplied active jobs", () => {
  expect(vacancyCities(jobs).find(city => city.country === "netherlands" && city.slug === "apeldoorn")?.count).toBe(2);
  expect(vacancyCities([])).toEqual([]);
});
test("only Netherlands and Germany country paths are supported", () => {
  expect(isCityCountry("netherlands")).toBe(true);
  expect(isCityCountry("germany")).toBe(true);
  expect(isCityCountry("france")).toBe(false);
});