import { expect, test } from "bun:test";
import { jobPostingSchema, serializeJobSchema } from "./job-schema.ts";

const job = { slug: "painter-apeldoorn", title: "Painter", sector: "Construction", country: "Netherlands", city: "Apeldoorn", pay: "€2,600–€3,200 gross/month", contract: "", schedule: "40 hours/week", start: "", housing: "", transport: "", language: "Dutch", openings: 1, summary: "Painting buildings", tasks: ["Prepare surfaces"], requirements: ["Dutch required"], offer: [], company: "Triangle Intérim", datePosted: "2026-11-20", translations: { ro: { title: "Zugrav", summary: "Zugrăvirea clădirilor", tasks: ["Pregătirea suprafețelor"], requirements: ["Limba olandeză"] } } };

test("Google Jobs describes the Romanian vacancy with its real employer and work location", () => {
  const schema = jobPostingSchema(job);
  expect(schema['@type']).toBe("JobPosting");
  expect(schema.title).toBe("Zugrav");
  expect(schema.description).toContain("<li>Pregătirea suprafețelor</li>");
  expect(schema.hiringOrganization.name).toBe("Triangle Intérim");
  expect(schema.jobLocation.address).toEqual({ '@type': "PostalAddress", addressLocality: "Apeldoorn", addressCountry: "NL" });
});
test("verified date is retained; missing dates and unknown expiry are never invented", () => {
  expect(jobPostingSchema(job).datePosted).toBe("2026-11-20");
  expect(jobPostingSchema({ ...job, datePosted: undefined })).not.toHaveProperty("datePosted");
  expect(jobPostingSchema(job)).not.toHaveProperty("validThrough");
});
test("recruiter is not misrepresented as employer and pay is not guessed as baseSalary", () => {
  expect(jobPostingSchema({ ...job, company: undefined })).not.toHaveProperty("hiringOrganization");
  expect(jobPostingSchema(job)).not.toHaveProperty("baseSalary");
  expect(jobPostingSchema(job)).not.toHaveProperty("applicantLocationRequirements");
});
test("canonical job URL is self-referencing and script contents cannot break out", () => {
  expect(jobPostingSchema(job).url).toBe("https://www.vreaujobs.com/jobs/painter-apeldoorn");
  const json = serializeJobSchema(jobPostingSchema({ ...job, company: '</script><script>alert(1)</script>' }));
  expect(json).not.toContain("</script>");
  expect(JSON.parse(json).hiringOrganization.name).toBe('</script><script>alert(1)</script>');
});