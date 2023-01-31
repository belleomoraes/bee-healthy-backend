import faker from "@faker-js/faker";
import { generateCPF } from "@brazilian-utils/brazilian-utils";
import { User } from "@prisma/client";

import { createUser } from "./users-factory";
import { prisma } from "@/config";

export async function createProfileData(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.patientInformation.create({
    data: {
      name: faker.name.findName(),
      cpf: generateCPF(),
      birthday: faker.date.past(),
      phone: faker.phone.phoneNumber("(##) 9####-####"),
      userId: incomingUser.id,
      sex: "female",
      blood: "A",
    },
  });
}
