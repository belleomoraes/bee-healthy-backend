import vaccinationRepository from "@/repositories/vaccination-repository";
import { Vaccination } from "@prisma/client";
import { notFoundError, unauthorizedError } from "@/errors";
import { exclude } from "@/utils/prisma-utils";

async function getVaccination(userId: number): Promise<Vaccination[]> {
  const vaccination = await vaccinationRepository.findManyVaccination(userId);

  if (vaccination.length === 0) {
    throw notFoundError;
  }
  return vaccination;
}

async function getFilteredVaccination(search: string, userId: number): Promise<Vaccination[]> {
  const vaccination = await vaccinationRepository.findManyFilteredVaccination(search, userId);

  if (vaccination.length === 0) {
    throw notFoundError;
  }
  return vaccination;
}

async function createNewVaccination(params: VaccinationBody): Promise<VaccinationPromise> {
  return await vaccinationRepository.createVaccination(params);
}

async function updateVaccination(params: VaccinationBodyUpdate): Promise<VaccinationPromise> {
  await getOrcheckVaccinationId(params.id, params.userId);

  return await vaccinationRepository.updateVaccination(params.id, exclude(params, "id", "userId"));
}

async function getOrcheckVaccinationId(vaccinationId: number, userId: number): Promise<Vaccination> {
  const isVaccinationExists = await vaccinationRepository.findVaccinationById(vaccinationId);

  if (!isVaccinationExists) {
    throw notFoundError();
  }

  if (isVaccinationExists.userId !== userId) {
    throw unauthorizedError();
  }
  return isVaccinationExists;
}

async function deleteVaccination(vaccinationId: number, userId: number) {
  await getOrcheckVaccinationId(vaccinationId, userId);

  return await vaccinationRepository.deleteVaccination(vaccinationId);
}

export type VaccinationPromise = Omit<Vaccination, "createdAt" | "updatedAt" | "userId">;
export type VaccinationBody = Omit<Vaccination, "createdAt" | "updatedAt" | "id">;
export type VaccinationBodyUpdate = Omit<Vaccination, "createdAt" | "updatedAt">;

const vaccinationService = {
  getVaccination,
  getFilteredVaccination,
  createNewVaccination,
  updateVaccination,
  getOrcheckVaccinationId,
  deleteVaccination,
};

export default vaccinationService;
