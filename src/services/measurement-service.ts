import measurementRepository from "@/repositories/measurement-repository";
import { Measurement } from "@prisma/client";
import { notFoundError, unauthorizedError } from "@/errors";
import { exclude } from "@/utils/prisma-utils";
import { MeasurementType } from "@prisma/client";

async function getMeasurementByType(userId: number, measurementType: string): Promise<Measurement[]> {
  const type = catchMeasurementType(measurementType);
  const measurement = await measurementRepository.findManyMeasurement(userId, type);

  if (measurement.length === 0) {
    throw notFoundError;
  }
  return measurement;
}

async function createNewMeasurement(params: MeasurementBody, type: string): Promise<MeasurementPromise> {
  const measurementType = catchMeasurementType(type);

  const measurementData = {
    ...params,
    type: measurementType,
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

function catchMeasurementType(type: string) {
  if (type === "blood-pressure") {
    return MeasurementType.PA;
  }
  if (type === "glucose") {
    return MeasurementType.GLUCOSE;
  }
  if (type === "oxygen") {
    return MeasurementType.OXYGEN;
  }
}

export type MeasurementPromise = Omit<Measurement, "createdAt" | "updatedAt" | "userId">;
export type MeasurementBody = Omit<Measurement, "createdAt" | "updatedAt" | "id" | "type">;
export type MeasurementBodyUpdate = Omit<Measurement, "createdAt" | "updatedAt" | "type">;

const measurementService = {
  getMeasurementByType,
  createNewMeasurement,
  updateMeasurement,
  getOrcheckMeasurementId,
  deleteMeasurement,
};

export default measurementService;
