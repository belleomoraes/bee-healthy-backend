import profileRepository from "@/repositories/profile-repository";
import { PatientInformation } from "@prisma/client";
import { notFoundError } from "@/errors";
import { exclude } from "@/utils/prisma-utils";

async function getPersonalInformation(userId: number): Promise<PersonalInformationParams> {
  const personalInformation = await profileRepository.findPersonalInformation(userId);
  if (!personalInformation) {
    throw notFoundError();
  }

  return {
    id: personalInformation.id,
    name: personalInformation.name,
    cpf: personalInformation.cpf,
    birthday: personalInformation.birthday,
    phone: personalInformation.phone,
    sex: personalInformation.sex,
    blood: personalInformation.blood,
  };
}

async function createPersonalInformation(params: PersonalInformationBody): Promise<PersonalInformationParams> {
  const personalInformation = await profileRepository.upsertPersonalInformation(
    params.userId,
    params,
    exclude(params, "userId"),
  );

  if (!personalInformation) {
    throw notFoundError();
  }

  return {
    id: personalInformation.id,
    name: personalInformation.name,
    cpf: personalInformation.cpf,
    birthday: personalInformation.birthday,
    phone: personalInformation.phone,
    sex: personalInformation.sex,
    blood: personalInformation.blood,
  };
}

export type PersonalInformationParams = Omit<PatientInformation, "createdAt" | "updatedAt" | "userId">;
export type PersonalInformationBody = Omit<PatientInformation, "createdAt" | "updatedAt">;
const profileService = {
  getPersonalInformation,
  createPersonalInformation,
};

export default profileService;
