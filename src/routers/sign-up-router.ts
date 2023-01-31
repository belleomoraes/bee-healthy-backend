import { Router } from "express";
import { createUserSchema } from "@/schemas/users-schemas";
import { validateBody } from "@/middlewares/validation-middleware";
import { signUp } from "@/controllers";

const signUpRouter = Router();

signUpRouter.post("/", validateBody(createUserSchema), signUp);

export { signUpRouter };
