import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import measurementService from "@/services/measurement-service";

export async function getMeasurement(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { measurementType } = req.params;
  const { measurementId } = req.query;

  try {
    let measurement;
    if (measurementId) {
      measurement = await measurementService.getOrcheckMeasurementId(Number(measurementId), userId);
    } else {
      measurement = await measurementService.getMeasurementByType(userId, measurementType);
    }

    return res.status(httpStatus.OK).send(measurement);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createNewMeasurement(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { measurementType } = req.params;

  try {
    const measurement = await measurementService.createNewMeasurement({ ...req.body, userId }, String(measurementType));

    return res.status(httpStatus.OK).send(measurement);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function updateMeasurement(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { measurementId } = req.query;

  try {
    const measurement = await measurementService.updateMeasurement({ ...req.body, userId, id: Number(measurementId) });

    return res.status(httpStatus.OK).send(measurement);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function deleteMeasurement(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { measurementId } = req.query;

  try {
    await measurementService.deleteMeasurement(Number(measurementId), userId);

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
