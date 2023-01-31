import { prisma } from "@/config";

async function findManyExams(userId: number) {
  return prisma.exam.findMany({
    where: {
      userId: userId,
    },
  });
}

const examRepository = {
  findManyExams,
};

export default examRepository;
