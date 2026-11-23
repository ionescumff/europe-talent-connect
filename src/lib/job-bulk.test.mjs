import { test, expect } from "bun:test";
import { emptyBulkJob, matchJobColumns, mapJobRow, reviewBulkJobs, bulkJobRecord } from "./job-bulk.ts";

const job = { ...emptyBulkJob(), title: "TEST Warehouse operator", sector: "Logistics", city: "Test City", country: "Netherlands", salary: "TEST confirmed rate" };
test("Romanian and English headers map without inventing missing values", () => {
  const mapping = matchJobColumns(["Titlu", "Oraș", "Salary", "Angajator"]);
  expect(mapJobRow(["Operator", "Venlo", "€15/hour", "Employer"], mapping).city).toBe("Venlo");
  expect(mapJobRow(["Operator", "Venlo", "€15/hour", "Employer"], mapping).housing).toBe("");
});
test("title, city, pay and sector are required", () => {
  expect(reviewBulkJobs([{ ...job, title: "", city: "", salary: "", sector: "" }], [])[0]).toHaveLength(4);
});
test("duplicate title, employer and city are blocked in the file and existing jobs", () => {
  expect(reviewBulkJobs([job, { ...job, title: " test warehouse operator " }], [])[1]).toContain("Duplicate row in this file");
  expect(reviewBulkJobs([job], [{ ...job, company_name: null }])[0]).toContain("Already exists in CRM");
});
test("draft batches stay hidden while published batches go live", () => {
  expect(bulkJobRecord(job, false).published).toBe(false);
  expect(bulkJobRecord(job, true).published).toBe(true);
});
test("Romanian fields are stored beside English without altering job identity", () => {
  const row = bulkJobRecord({ ...job, ro_title: "Operator depozit", ro_tasks: "Pregătire;Ambalare" }, false);
  expect(row.title).toBe("TEST Warehouse operator");
  expect(row.translations.ro).toEqual({ title: "Operator depozit", tasks: ["Pregătire", "Ambalare"] });
});