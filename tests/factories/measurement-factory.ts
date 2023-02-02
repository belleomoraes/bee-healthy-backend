import faker from "@faker-js/faker";
import { User } from "@prisma/client";
import { createUser } from "./users-factory";
import { prisma } from "@/config";

export async function createPressureMeasurementData(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.measurement.create({
    data: {
      observation: faker.name.findName(),
      morning: faker.name.findName(),
      afternoon: faker.name.findName(),
      night: faker.name.findName(),
      userId: incomingUser.id,
      type: "PA",
    },
  });
}

export async function createGlucoseMeasurementData(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.measurement.create({
    data: {
      observation: faker.name.findName(),
      morning: faker.name.findName(),
      afternoon: faker.name.findName(),
      night: faker.name.findName(),
      userId: incomingUser.id,
      type: "GLUCOSE",
    },
  });
}

export async function createOxygenMeasurementData(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.measurement.create({
    data: {
      observation: faker.name.findName(),
      morning: faker.name.findName(),
      afternoon: faker.name.findName(),
      night: faker.name.findName(),
      userId: incomingUser.id,
      type: "OXYGEN",
    },
  });
}
