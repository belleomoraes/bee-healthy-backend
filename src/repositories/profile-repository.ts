import { prisma } from "@/config";
import { PatientInformation } from "@prisma/client";

async function findPersonalInformation(userId: number) {
  return prisma.patientInformation.findFirst({
    where: {
      userId: userId,
    },
  });
}

async function upsertPersonalInformation(userId: number, createdBody: CreateBodyParams, updatedBody: UpdateBodyParams) {
  return prisma.patientInformation.upsert({
    where: {
      userId: userId,
    },
    create: createdBody,
    update: updatedBody,
  });
}

export type PersonalInformationBody = Omit<PatientInformation, "createdAt" | "updatedAt">;
export type CreateBodyParams = Omit<PatientInformation, "id" | "createdAt" | "updatedAt">;
export type UpdateBodyParams = Omit<PatientInformation, "userId" | "createdAt" | "updatedAt">;

const profileRepository = { findPersonalInformation, upsertPersonalInformation };

export default profileRepository;
