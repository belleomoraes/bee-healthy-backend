import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import profileService from "@/services/profile-service";

export async function getPersonalInformation(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const profileInformation = await profileService.getPersonalInformation(userId);
    return res.status(httpStatus.OK).send(profileInformation);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createPersonalInformation(req: AuthenticatedRequest, res: Response) {
  //   const { userId } = req;
  //   try {
  //     const dates = await activitiesService.getActivitiesDates(userId);
  //     return res.status(httpStatus.OK).send(dates);
  //   } catch (error) {
  //     if (error.name === "UnauthorizedError") {
  //       return res.sendStatus(httpStatus.UNAUTHORIZED);
  //     }
  //     if (error.name === "CannotSelectActivitiesError") {
  //       return res.sendStatus(httpStatus.BAD_REQUEST);
  //     }
  //     return res.sendStatus(httpStatus.NOT_FOUND);
  //   }
}
