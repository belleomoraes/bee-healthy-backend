import profileRepository from "@/repositories/profile-repository";
import { PatientInformation } from "@prisma/client";
import { notFoundError } from "@/errors";

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

export type PersonalInformationParams = Omit<PatientInformation, "createdAt" | "updatedAt" | "userId">;
const profileService = {
  getPersonalInformation,
};

export default profileService;
