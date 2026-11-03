import { expect, test } from "bun:test";
import { localizeJob } from "./jobs.ts";

const job = { slug: "triangle-painter", title: "Painter", sector: "Construction support", country: "Netherlands", city: "Apeldoorn", pay: "€2,600–€3,200 gross/month", contract: "", schedule: "40 hours/week", start: "", housing: "", transport: "", language: "Dutch", openings: 0, summary: "Painting buildings", tasks: ["Prepare surfaces"], requirements: ["Dutch required"], offer: [], translations: { ro: { title: "Zugrav", summary: "Zugrăvirea clădirilor", tasks: ["Pregătirea suprafețelor"], language: "Limba olandeză" } } };

test("Romanian translates vacancy content while preserving the application slug and source pay", () => {
  const result = localizeJob(job, "ro");
  expect(result.title).toBe("Zugrav");
  expect(result.tasks).toEqual(["Pregătirea suprafețelor"]);
  expect(result.slug).toBe("triangle-painter");
  expect(result.pay).toBe("€2,600–€3,200 gross/month");
});

test("English retains the canonical vacancy", () => {
  expect(localizeJob(job, "en").title).toBe("Painter");
  expect(localizeJob(job, "en").language).toBe("Dutch");
});

test("missing housing is explicitly unconfirmed, not a promised benefit", () => {
  expect(localizeJob(job, "ro").housing).toBe("Nu este precizat; de confirmat înainte de plecare");
  expect(localizeJob(job, "en").housing).toBe("Not specified; confirm before travel");
});