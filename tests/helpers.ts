import { prisma } from "@/config";

export async function cleanDb() {
  await prisma.measurement.deleteMany({});
  await prisma.vaccination.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.patientInformation.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
}
