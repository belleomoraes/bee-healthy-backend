import Joi from "joi";
import { Vaccination } from "@prisma/client";

export const createVaccinationSchema = Joi.object<VaccinationBody>({
  name: Joi.string().required(),
  dose: Joi.string().required(),
  manufacturer: Joi.string().required(),
  lot: Joi.string().required(),
});

export type VaccinationBody = Omit<Vaccination, "createdAt" | "updatedAt" | "id" | "userId">;
