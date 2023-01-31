import faker from "@faker-js/faker";
import { User } from "@prisma/client";
import { createUser } from "./users-factory";
import { prisma } from "@/config";

export async function createExamData(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.exam.create({
    data: {
      name: faker.name.findName(),
      examType: faker.name.findName(),
      description: faker.name.findName(),
      local: faker.name.findName(),
      userId: incomingUser.id,
    },
  });
}
