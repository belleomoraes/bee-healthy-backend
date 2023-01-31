import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { createExamData } from "../factories/exam-factory";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /exam", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/exam");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/exam").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/exam").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 and empty array when there is no exam data for given user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/exam").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and exam data  when there is an exam information for given user", async () => {
      const user = await createUser();
      const firstExam = await createExamData(user);
      const secondExam = await createExamData(user);
      const token = await generateValidToken(user);

      const response = await server.get("/exam").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: firstExam.id,
          name: firstExam.name,
          examType: firstExam.examType,
          description: firstExam.description,
          local: firstExam.local,
          userId: firstExam.userId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: secondExam.id,
          name: secondExam.name,
          examType: secondExam.examType,
          description: secondExam.description,
          local: secondExam.local,
          userId: secondExam.userId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });
});
