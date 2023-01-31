import { signIn } from "@/controllers";
import { validateBody } from "@/middlewares/validation-middleware";
import { signInSchema } from "@/schemas/sign-in-schemas";
import { Router } from "express";

const signInRouter = Router();

signInRouter.post("/", validateBody(signInSchema), signIn);

export { signInRouter };
