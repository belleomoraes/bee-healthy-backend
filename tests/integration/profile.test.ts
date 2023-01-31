import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { createProfileData } from "../factories/profile-factory";
import { generateCPF } from "@brazilian-utils/brazilian-utils";
import { prisma } from "@/config";
import dayjs from "dayjs";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /profile", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/profile");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/profile").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/profile").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 401 and empty array when there is no profile data for given user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/profile").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and profile data  when there is a profile information for given user", async () => {
      const user = await createUser();
      const profile = await createProfileData(user);
      const token = await generateValidToken(user);

      const response = await server.get("/profile").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: profile.id,
        name: profile.name,
        cpf: profile.cpf,
        birthday: profile.birthday.toISOString(),
        phone: profile.phone,
        blood: profile.blood,
        sex: profile.sex,
      });
    });
  });
});

describe("POST /profile", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/profile");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/profile").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/profile").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 when body is not present", async () => {
      const token = await generateValidToken();

      const response = await server.post("/profile").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post("/profile").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const generateValidBody = () => ({
        name: faker.name.findName(),
        cpf: generateCPF(),
        birthday: faker.date.past().toISOString(),
        phone: "(21) 98999-9999",
        blood: "A",
        sex: "female",
      });

      it("should respond with status 201 and create new profile information if there is not any", async () => {
        const body = generateValidBody();

        const token = await generateValidToken();

        const response = await server.post("/profile").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.OK);
        const profileInformation = await prisma.patientInformation.findFirst({ where: { cpf: body.cpf } });

        expect(profileInformation).toBeDefined();
      });

      it("should respond with status 200 and update profile information if there is one already", async () => {
        const user = await createUser();
        await createProfileData(user);
        const body = generateValidBody();
        const token = await generateValidToken(user);

        const response = await server.post("/profile").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.OK);
        const updatedProfile = await prisma.patientInformation.findUnique({ where: { userId: user.id } });

        expect(updatedProfile).toBeDefined();
        expect(updatedProfile).toEqual(
          expect.objectContaining({
            name: body.name,
            cpf: body.cpf,
            birthday: dayjs(body.birthday).toDate(),
            phone: body.phone,
            blood: body.blood,
            sex: body.sex,
          }),
        );
      });
    });
  });
});
