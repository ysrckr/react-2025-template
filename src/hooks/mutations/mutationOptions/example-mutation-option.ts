import { ExampleMutationKey } from "@/keys/mutationKeys/example-mutation-key";

export const exampleMutationOptions = () => {
  return {
    mutationKey: [ExampleMutationKey.Decrement],
    mutationFn: (data:string) => fetch('/api/decrement', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(res => res.json()),
  };
};
