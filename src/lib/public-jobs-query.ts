import { queryOptions } from "@tanstack/react-query";
import { listPublishedJobs } from "./jobposts.functions";

export const publicJobsQuery = queryOptions({
  queryKey: ["public", "active-jobs"],
  queryFn: () => listPublishedJobs(),
  staleTime: 30_000,
});