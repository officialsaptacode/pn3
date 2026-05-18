import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string(),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
// export default loginSchema;
