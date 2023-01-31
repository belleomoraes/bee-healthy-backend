import { prisma } from "@/config";
async function findPersonalInformation(userId: number) {
  return prisma.patientInformation.findFirst({
    where: {
      userId: userId,
    },
  });
}

const profileRepository = { findPersonalInformation };

export default profileRepository;
