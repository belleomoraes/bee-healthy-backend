import Joi from "joi";
import { Measurement } from "@prisma/client";

export const createMeasurementSchema = Joi.object<MeasurementBody>({
  observation: Joi.string().required(),
  morning: Joi.string().required(),
  afternoon: Joi.string().required(),
  night: Joi.string().required(),
});

export type MeasurementBody = Omit<Measurement, "createdAt" | "updatedAt" | "id" | "userId" | "type">;
