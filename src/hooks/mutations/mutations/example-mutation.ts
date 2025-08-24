import { exampleMutationOptions } from "../mutationOptions/example-mutation-option";
import { useMutation } from "@tanstack/react-query";

export const useExampleMutation = () => {
  return useMutation(exampleMutationOptions());
};