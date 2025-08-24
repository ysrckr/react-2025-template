import { exampleQueryOptions } from "@/hooks/queries/queryOptions/example-query-option";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useExampleQuery = () => {
  return useSuspenseQuery(exampleQueryOptions());
};
