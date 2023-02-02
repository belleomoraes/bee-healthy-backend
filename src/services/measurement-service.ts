import measurementRepository from "@/repositories/measurement-repository";
import { Measurement } from "@prisma/client";
import { notFoundError, unauthorizedError } from "@/errors";
import { exclude } from "@/utils/prisma-utils";
import { MeasurementType } from "@prisma/client";

const measurementType = "blood-pressure" || "glucose" || "oxygen";
async function getMeasurement(userId: number): Promise<Measurement[]> {
  const measurement = await measurementRepository.findManyMeasurement(userId);

  if (measurement.length === 0) {
    throw notFoundError;
  }
  return measurement;
}

async function createNewMeasurement(params: MeasurementBody, type: string): Promise<MeasurementPromise> {
  let newType;
  if (type === "blood-pressure") {
    newType = MeasurementType.PA;
    return;
  }
  if (type === "glucose") {
    newType = MeasurementType.GLUCOSE;
    return;
  }
  if (type === "oxygen") {
    newType = MeasurementType.OXYGEN;
    return;
  }

  const measurementData = {
    ...params,
    type: newType,
  };

  return await measurementRepository.createMeasurement(measurementData);
}

async function updateMeasurement(params: MeasurementBodyUpdate): Promise<MeasurementPromise> {
  await getOrcheckMeasurementId(params.id, params.userId);

  return await measurementRepository.updateMeasurement(params.id, exclude(params, "id", "userId"));
}

async function getOrcheckMeasurementId(measurementId: number, userId: number): Promise<Measurement> {
  const isMeasurementExists = await measurementRepository.findMeasurementById(measurementId);

  if (!isMeasurementExists) {
    throw notFoundError();
  }

  if (isMeasurementExists.userId !== userId) {
    throw unauthorizedError();
  }
  return isMeasurementExists;
}

async function deleteMeasurement(measurementId: number, userId: number) {
  await getOrcheckMeasurementId(measurementId, userId);

  return await measurementRepository.deleteMeasurement(measurementId);
}

export type MeasurementPromise = Omit<Measurement, "createdAt" | "updatedAt" | "userId">;
export type MeasurementBody = Omit<Measurement, "createdAt" | "updatedAt" | "id" | "type">;
export type MeasurementBodyUpdate = Omit<Measurement, "createdAt" | "updatedAt">;

const measurementService = {
  getMeasurement,
  createNewMeasurement,
  updateMeasurement,
  getOrcheckMeasurementId,
  deleteMeasurement,
};

export default measurementService;
