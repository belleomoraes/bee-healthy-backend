import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { validateBody } from "@/middlewares/validation-middleware";
import { getMeasurement, createNewMeasurement, updateMeasurement, deleteMeasurement } from "@/controllers";
import { createMeasurementSchema } from "@/schemas";

const measurementRouter = Router();

measurementRouter
  .all("/*", authenticateToken)
  .get("/:measurementType", getMeasurement)
  .post("/:measurementType", validateBody(createMeasurementSchema), createNewMeasurement)
  .put("/:measurementType", validateBody(createMeasurementSchema), updateMeasurement)
  .delete("/:measurementType", deleteMeasurement);

export { measurementRouter };
