import {z} from 'zod';

export const ExampleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().min(0).optional(),
});
