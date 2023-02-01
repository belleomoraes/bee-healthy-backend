import { prisma } from "@/config";
import { Vaccination } from "@prisma/client";

async function findManyVaccination(userId: number) {
  return prisma.vaccination.findMany({
    where: {
      userId: userId,
    },
  });
}

async function findVaccinationById(vaccinationId: number) {
  return prisma.vaccination.findFirst({
    where: {
      id: vaccinationId,
    },
  });
}

async function createVaccination(vaccination: VaccinationBody) {
  return prisma.vaccination.create({
    data: vaccination,
  });
}

async function updateVaccination(vaccinationId: number, vaccination: VaccinationBodyUpdate) {
  return prisma.vaccination.update({
    where: {
      id: vaccinationId,
    },
    data: vaccination,
  });
}

async function deleteVaccination(vaccinationId: number) {
  return prisma.vaccination.delete({
    where: {
      id: vaccinationId,
    },
  });
}

export type VaccinationBody = Omit<Vaccination, "createdAt" | "updatedAt" | "id">;
export type VaccinationBodyUpdate = Omit<Vaccination, "createdAt" | "updatedAt" | "id" | "userId">;

const vaccinationRepository = {
  findManyVaccination,
  createVaccination,
  updateVaccination,
  findVaccinationById,
  deleteVaccination,
};

export default vaccinationRepository;
