import faker from "@faker-js/faker";
import { User } from "@prisma/client";
import { createUser } from "./users-factory";
import { prisma } from "@/config";

export async function createVaccinationData(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.vaccination.create({
    data: {
      name: faker.name.findName(),
      lot: faker.name.findName(),
      manufacturer: faker.name.findName(),
      dose: faker.name.findName(),
      userId: incomingUser.id,
    },
  });
}
