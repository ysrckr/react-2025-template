import { ExampleSchema } from "../schemas/example-schema";
import { z } from "zod";

export type ExampleType = z.infer<typeof ExampleSchema>;