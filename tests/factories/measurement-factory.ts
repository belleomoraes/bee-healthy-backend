import faker from "@faker-js/faker";
import { User } from "@prisma/client";
import { createUser } from "./users-factory";
import { prisma } from "@/config";

export async function createExamData(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.measurement.create({
    data: {
      observation: faker.name.findName(),
      morning: faker.name.findName(),
      afternoon: faker.name.findName(),
      night: faker.name.findName(),
      userId: incomingUser.id,
    },
  });
}
