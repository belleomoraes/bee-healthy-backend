import { prisma } from "@/config";
import { Measurement, MeasurementType } from "@prisma/client";

async function findManyMeasurement(userId: number, type: MeasurementType) {
  return prisma.measurement.findMany({
    where: {
      userId: userId,
      type: type,
    },
  });
}

async function findMeasurementById(measurementId: number) {
  return prisma.measurement.findFirst({
    where: {
      id: measurementId,
    },
  });
}

async function createMeasurement(measurement: MeasurementBody) {
  return prisma.measurement.create({
    data: measurement,
  });
}

async function updateMeasurement(measurementId: number, measurement: MeasurementBodyUpdate) {
  return prisma.measurement.update({
    where: {
      id: measurementId,
    },
    data: measurement,
  });
}

async function deleteMeasurement(measurementId: number) {
  return prisma.measurement.delete({
    where: {
      id: measurementId,
    },
  });
}

export type MeasurementBody = Omit<Measurement, "createdAt" | "updatedAt" | "id">;
export type MeasurementBodyUpdate = Omit<Measurement, "createdAt" | "updatedAt" | "id" | "userId">;

const measurementRepository = {
  findManyMeasurement,
  createMeasurement,
  updateMeasurement,
  findMeasurementById,
  deleteMeasurement,
};

export default measurementRepository;
