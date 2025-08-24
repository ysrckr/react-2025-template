import { ExampleQueryKey } from "@/keys/queryKeys/example-query-key";

export const exampleQueryOptions = () => {
  return {
    queryKey: [ExampleQueryKey.Count],
    queryFn: () => fetch('/api/count').then(res => res.json()),
  };
};
