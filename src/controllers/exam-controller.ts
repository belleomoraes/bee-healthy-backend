import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import examService from "@/services/exam-service";

export async function getExams(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const exams = await examService.getExams(userId);
    return res.status(httpStatus.OK).send(exams);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createNewExam(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const exams = await examService.createNewExam({ ...req.body, userId });

    return res.status(httpStatus.OK).send(exams);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
