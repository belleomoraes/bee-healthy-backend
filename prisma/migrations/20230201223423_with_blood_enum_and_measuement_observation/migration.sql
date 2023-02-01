/*
  Warnings:

  - You are about to drop the column `examType` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Measurement` table. All the data in the column will be lost.
  - Added the required column `observation` to the `Measurement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Measurement` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `blood` on the `PatientInformation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MeasurementType" AS ENUM ('PA', 'GLUCOSE', 'OXYGEN');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A', 'B', 'AB', 'O');

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "examType";

-- AlterTable
ALTER TABLE "Measurement" DROP COLUMN "name",
ADD COLUMN     "observation" VARCHAR(255) NOT NULL,
ADD COLUMN     "type" "MeasurementType" NOT NULL;

-- AlterTable
ALTER TABLE "PatientInformation" DROP COLUMN "blood",
ADD COLUMN     "blood" "BloodType" NOT NULL;
