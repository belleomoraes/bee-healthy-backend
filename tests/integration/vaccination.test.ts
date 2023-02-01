import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { createVaccinationData } from "../factories";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /vaccination", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/vaccination");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/vaccination").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/vaccination").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when there is no vaccination data for given user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/vaccination").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and vaccination data  when there is an vaccination information for given user", async () => {
      const user = await createUser();
      const firstVaccine = await createVaccinationData(user);
      const secondVaccine = await createVaccinationData(user);
      const token = await generateValidToken(user);

      const response = await server.get("/vaccination").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: firstVaccine.id,
          name: firstVaccine.name,
          lot: firstVaccine.lot,
          manufacturer: firstVaccine.manufacturer,
          dose: firstVaccine.dose,
          userId: firstVaccine.userId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: secondVaccine.id,
          name: secondVaccine.name,
          lot: secondVaccine.lot,
          manufacturer: secondVaccine.manufacturer,
          dose: secondVaccine.dose,
          userId: secondVaccine.userId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });
});

describe("GET /vaccination/:vaccinationId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/vaccination/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/vaccination/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/vaccination/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when vaccinationId does not exist (= 0)", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/vaccination/0").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when vaccinationId does not exist (> 1)", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/vaccination/1").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user is not vaccination owner", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const otherUser = await createUser();
      const vaccination = await createVaccinationData(otherUser);
      const response = await server.get(`/vaccination/${vaccination.id}`).set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and vaccination data", async () => {
      const user = await createUser();
      const vaccination = await createVaccinationData(user);
      const token = await generateValidToken(user);
      const response = await server.get(`/vaccination/${vaccination.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: vaccination.id,
        name: vaccination.name,
        lot: vaccination.lot,
        manufacturer: vaccination.manufacturer,
        dose: vaccination.dose,
        userId: vaccination.userId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});

describe("POST /vaccination", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/vaccination");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/vaccination").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/vaccination").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 when body is not present", async () => {
      const token = await generateValidToken();

      const response = await server.post("/vaccination").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post("/vaccination").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const generateValidBody = () => ({
        name: faker.name.findName(),
        lot: faker.name.findName(),
        manufacturer: faker.name.findName(),
        dose: faker.name.findName(),
      });

      it("should respond with status 201 and create new vaccination", async () => {
        const body = generateValidBody();
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.post("/vaccination").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.OK);
      });
    });
  });
});

describe("PUT /vaccination/:vaccinationId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.put("/vaccination/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.put("/vaccination/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put("/vaccination/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 when body is invalid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const vaccination = await createVaccinationData(user);
      const body = { [faker.lorem.word()]: faker.lorem.word() };
      const response = await server
        .put(`/vaccination/${vaccination.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(body);
      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const generateValidBody = () => ({
        name: faker.name.findName(),
        lot: faker.name.findName(),
        manufacturer: faker.name.findName(),
        dose: faker.name.findName(),
      });

      it("should respond with status 404 when vaccinationId does not exist (= 0)", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = generateValidBody();

        const response = await server.put("/vaccination/0").set("Authorization", `Bearer ${token}`).send(body);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it("should respond with status 404 when vaccinationId does not exist (> 1)", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = generateValidBody();

        const response = await server.put("/vaccination/1").set("Authorization", `Bearer ${token}`).send(body);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      describe("when vaccinationId is valid", () => {
        it("should respond with status 404 when user is not vaccination owner", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const body = generateValidBody();
          const otherUser = await createUser();
          const vaccination = await createVaccinationData(otherUser);

          const response = await server
            .put(`/vaccination/${vaccination.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(body);
          expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
        });

        describe("when user is vaccination owner", () => {
          it("should respond with status 200", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const vaccination = await createVaccinationData(user);
            const body = generateValidBody();

            const response = await server
              .put(`/vaccination/${vaccination.id}`)
              .set("Authorization", `Bearer ${token}`)
              .send(body);
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
              id: vaccination.id,
              name: body.name,
              lot: body.lot,
              manufacturer: body.manufacturer,
              dose: body.dose,
              userId: vaccination.userId,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
          });
        });
      });
    });
  });
});

describe("DELETE /vaccination/:vaccinationId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.delete("/vaccination/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.delete("/vaccination/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.delete("/vaccination/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when vaccinationId does not exist (= 0)", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.delete("/vaccination/0").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when vaccinationId does not exist (> 1)", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.delete("/vaccination/1").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    describe("when vaccinationId is valid", () => {
      it("should respond with status 404 when user is not vaccination owner", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const otherUser = await createUser();
        const vaccination = await createVaccinationData(otherUser);

        const response = await server.delete(`/vaccination/${vaccination.id}`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
      });

      it("should respond with status 200", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const vaccination = await createVaccinationData(user);
        const response = await server.delete(`/vaccination/${vaccination.id}`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.OK);
      });
    });
  });
});
