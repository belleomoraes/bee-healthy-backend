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
          description: firstExam.description,
          local: firstExam.local,
          userId: firstExam.userId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: secondExam.id,
          name: secondExam.name,
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

describe("GET /exam/:examId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/exam/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/exam/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/exam/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when examId does not exist (= 0)", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/exam/0").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when examId does not exist (> 1)", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/exam/1").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user is not exam owner", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const otherUser = await createUser();
      const exam = await createExamData(otherUser);
      const response = await server.get(`/exam/${exam.id}`).set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and exam data", async () => {
      const user = await createUser();
      const exam = await createExamData(user);
      const token = await generateValidToken(user);
      const response = await server.get(`/exam/${exam.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: exam.id,
        name: exam.name,
        description: exam.description,
        local: exam.local,
        userId: exam.userId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});

describe("POST /exam", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/exam");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/exam").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/exam").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 when body is not present", async () => {
      const token = await generateValidToken();

      const response = await server.post("/exam").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post("/exam").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const generateValidBody = () => ({
        name: faker.name.findName(),
        description: faker.name.findName(),
        local: faker.name.findName(),
      });

      it("should respond with status 201 and create new exam", async () => {
        const body = generateValidBody();
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.post("/exam").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.OK);
      });
    });
  });
});

describe("PUT /exam/:examId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.put("/exam/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.put("/exam/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put("/exam/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 when body is invalid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const exam = await createExamData(user);
      const body = { [faker.lorem.word()]: faker.lorem.word() };
      const response = await server.put(`/exam/${exam.id}`).set("Authorization", `Bearer ${token}`).send(body);
      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const generateValidBody = () => ({
        name: faker.name.findName(),
        description: faker.name.findName(),
        local: faker.name.findName(),
      });

      it("should respond with status 404 when examId does not exist (= 0)", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = generateValidBody();

        const response = await server.put("/exam/0").set("Authorization", `Bearer ${token}`).send(body);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it("should respond with status 404 when examId does not exist (> 1)", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = generateValidBody();

        const response = await server.put("/exam/1").set("Authorization", `Bearer ${token}`).send(body);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      describe("when examId is valid", () => {
        it("should respond with status 404 when user is not exam owner", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const body = generateValidBody();
          const otherUser = await createUser();
          const exam = await createExamData(otherUser);

          const response = await server.put(`/exam/${exam.id}`).set("Authorization", `Bearer ${token}`).send(body);
          expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
        });

        describe("when user is exam owner", () => {
          it("should respond with status 200", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const exam = await createExamData(user);
            const body = generateValidBody();

            const response = await server.put(`/exam/${exam.id}`).set("Authorization", `Bearer ${token}`).send(body);
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
              id: exam.id,
              name: body.name,
              description: body.description,
              local: body.local,
              userId: exam.userId,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
          });
        });
      });
    });
  });
});

describe("DELETE /exam/:examId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.delete("/exam/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.delete("/exam/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.delete("/exam/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when examId does not exist (= 0)", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.delete("/exam/0").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when examId does not exist (> 1)", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.delete("/exam/1").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    describe("when examId is valid", () => {
      it("should respond with status 404 when user is not exam owner", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const otherUser = await createUser();
        const exam = await createExamData(otherUser);

        const response = await server.delete(`/exam/${exam.id}`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
      });

      it("should respond with status 200", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const exam = await createExamData(user);
        const response = await server.delete(`/exam/${exam.id}`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.OK);
      });
    });
  });
});
