import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import vaccinationService from "@/services/vaccination-service";

export async function getVaccination(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const vaccination = await vaccinationService.getVaccination(userId);
    return res.status(httpStatus.OK).send(vaccination);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getVaccinationById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { vaccinationId } = req.params;

  try {
    const vaccination = await vaccinationService.getOrcheckVaccinationId(Number(vaccinationId), userId);
    return res.status(httpStatus.OK).send(vaccination);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createNewVaccination(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const vaccination = await vaccinationService.createNewVaccination({ ...req.body, userId });

    return res.status(httpStatus.OK).send(vaccination);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function updateVaccination(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { vaccinationId } = req.params;

  try {
    const vaccination = await vaccinationService.updateVaccination({ ...req.body, userId, id: Number(vaccinationId) });

    return res.status(httpStatus.OK).send(vaccination);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function deleteVaccination(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { vaccinationId } = req.params;

  try {
    await vaccinationService.deleteVaccination(Number(vaccinationId), userId);

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
