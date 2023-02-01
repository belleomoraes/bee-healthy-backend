import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { validateBody } from "@/middlewares/validation-middleware";
import {
  getVaccination,
  createNewVaccination,
  updateVaccination,
  getVaccinationById,
  deleteVaccination,
} from "@/controllers";
import { createVaccinationSchema } from "@/schemas";

const vaccinationRouter = Router();

vaccinationRouter
  .all("/*", authenticateToken)
  .get("/", getVaccination)
  .get("/:vaccinationId", getVaccinationById)
  .post("/", validateBody(createVaccinationSchema), createNewVaccination)
  .put("/:vaccinationId", validateBody(createVaccinationSchema), updateVaccination)
  .delete("/:vaccinationId", deleteVaccination);

export { vaccinationRouter };
