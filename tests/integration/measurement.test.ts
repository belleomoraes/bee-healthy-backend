import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import {
  createPressureMeasurementData,
  createGlucoseMeasurementData,
  createOxygenMeasurementData,
} from "../factories/measurement-factory";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);
describe("GET /measurement/:measurementType", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/measurement/blood-pressure");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/measurement/blood-pressure").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/measurement/blood-pressure").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 and empty array when there is no measurement data for given user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/measurement/blood-pressure").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and measurement data  when there is an measurement information for given user - blood pressure", async () => {
      const user = await createUser();
      const firstMeasurement = await createPressureMeasurementData(user);
      await createGlucoseMeasurementData(user);
      await createOxygenMeasurementData(user);
      const token = await generateValidToken(user);

      const response = await server.get("/measurement/blood-pressure").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: firstMeasurement.id,
          observation: firstMeasurement.observation,
          morning: firstMeasurement.morning,
          afternoon: firstMeasurement.afternoon,
          night: firstMeasurement.night,
          type: firstMeasurement.type,
          userId: firstMeasurement.userId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });

    it("should respond with status 200 and measurement data  when there is an measurement information for given user - glucose", async () => {
      const user = await createUser();
      const firstMeasurement = await createGlucoseMeasurementData(user);
      await createPressureMeasurementData(user);
      await createOxygenMeasurementData(user);
      const token = await generateValidToken(user);

      const response = await server.get("/measurement/glucose").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: firstMeasurement.id,
          observation: firstMeasurement.observation,
          morning: firstMeasurement.morning,
          afternoon: firstMeasurement.afternoon,
          night: firstMeasurement.night,
          type: firstMeasurement.type,
          userId: firstMeasurement.userId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });

    it("should respond with status 200 and measurement data  when there is an measurement information for given user - oxygen", async () => {
      const user = await createUser();
      const firstMeasurement = await createOxygenMeasurementData(user);
      await createPressureMeasurementData(user);
      await createGlucoseMeasurementData(user);
      const token = await generateValidToken(user);

      const response = await server.get("/measurement/oxygen").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: firstMeasurement.id,
          observation: firstMeasurement.observation,
          morning: firstMeasurement.morning,
          afternoon: firstMeasurement.afternoon,
          night: firstMeasurement.night,
          type: firstMeasurement.type,
          userId: firstMeasurement.userId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });

    describe("when looking for a specific measurementId", () => {
      it("should respond with status 404 when measurementId does not exist (= 0)", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server
          .get("/measurement/oxygen?measurementId=0")
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it("should respond with status 404 when measurementId does not exist (> 1)", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.get("/measurement/oxygen?measurementId1").set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it("should respond with status 404 when user is not measurement owner", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const otherUser = await createUser();
        const measurement = await createOxygenMeasurementData(otherUser);
        const response = await server
          .get(`/measurement/oxygen?measurementId=${measurement.id}`)
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
      });

      it("should respond with status 200 and measurement data", async () => {
        const user = await createUser();
        const measurement = await createOxygenMeasurementData(user);
        const token = await generateValidToken(user);
        const response = await server
          .get(`/measurement/oxygen?measurementId=${measurement.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: measurement.id,
          observation: measurement.observation,
          morning: measurement.morning,
          afternoon: measurement.afternoon,
          night: measurement.night,
          type: measurement.type,
          userId: measurement.userId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });
  });
});

describe("POST /measurement/:measurementType", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/measurement/blood-pressure");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/measurement/blood-pressure").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/measurement/blood-pressure").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 when body is not present", async () => {
      const token = await generateValidToken();

      const response = await server.post("/measurement/blood-pressure").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .post("/measurement/blood-pressure")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const generateValidBody = () => ({
        observation: faker.name.findName(),
        morning: faker.name.findName(),
        afternoon: faker.name.findName(),
        night: faker.name.findName(),
      });

      it("should respond with status 201 and create new measurement - blood pressure", async () => {
        const body = generateValidBody();
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server
          .post("/measurement/blood-pressure")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: expect.any(Number),
          observation: body.observation,
          morning: body.morning,
          afternoon: body.afternoon,
          night: body.night,
          type: "PA",
          userId: user.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });

      it("should respond with status 201 and create new measurement - glucose", async () => {
        const body = generateValidBody();
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.post("/measurement/glucose").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: expect.any(Number),
          observation: body.observation,
          morning: body.morning,
          afternoon: body.afternoon,
          night: body.night,
          type: "GLUCOSE",
          userId: user.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });

      it("should respond with status 201 and create new measurement - oxygen", async () => {
        const body = generateValidBody();
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.post("/measurement/oxygen").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: expect.any(Number),
          observation: body.observation,
          morning: body.morning,
          afternoon: body.afternoon,
          night: body.night,
          type: "OXYGEN",
          userId: user.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });
  });
});

describe("PUT /measurement/:measurementType", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.put("/measurement/blood-pressure?measurementId=1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
 
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.put("/measurement/blood-pressure?measurementId=1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put("/measurement/blood-pressure?measurementId=1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 when body is invalid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const measurement = await createPressureMeasurementData(user);
      const body = { [faker.lorem.word()]: faker.lorem.word() };
      const response = await server
        .put( `/measurement/blood-pressure?measurementId=${measurement.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(body);
      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const generateValidBody = () => ({
        observation: faker.name.findName(),
        morning: faker.name.findName(),
        afternoon: faker.name.findName(),
        night: faker.name.findName(),
      });

      it("should respond with status 404 when measurementId does not exist (= 0)", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = generateValidBody();

        const response = await server
          .put("/measurement/blood-pressure?measurementId=0")
          .set("Authorization", `Bearer ${token}`)
          .send(body);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it("should respond with status 404 when measurementId does not exist (> 1)", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = generateValidBody();

        const response = await server
          .put("/measurement/blood-pressure?measurementId=1")
          .set("Authorization", `Bearer ${token}`)
          .send(body);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      describe("when measurementId is valid", () => {
        it("should respond with status 404 when user is not measurement owner", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const body = generateValidBody();
          const otherUser = await createUser();
          const measurement = await createPressureMeasurementData(otherUser);

          const response = await server
            .put(`/measurement/blood-pressure?measurementId=${measurement.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(body);
          expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
        });

        describe("when user is measurement owner - blood pressure", () => {
          it("should respond with status 200", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const measurement = await createPressureMeasurementData(user);
            const body = generateValidBody();

            const response = await server
              .put(`/measurement/blood-pressure?measurementId=${measurement.id}`)
              .set("Authorization", `Bearer ${token}`)
              .send(body);
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
              id: measurement.id,
              observation: body.observation,
              morning: body.morning,
              afternoon: body.afternoon,
              night: body.night,
              type: measurement.type,
              userId: measurement.userId,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
          });
        });

        describe("when user is measurement owner - oxygen", () => {
          it("should respond with status 200", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const measurement = await createOxygenMeasurementData(user);
            const body = generateValidBody();

            const response = await server
              .put(`/measurement/oxygen?measurementId=${measurement.id}`)
              .set("Authorization", `Bearer ${token}`)
              .send(body);
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
              id: measurement.id,
              observation: body.observation,
              morning: body.morning,
              afternoon: body.afternoon,
              night: body.night,
              type: measurement.type,
              userId: measurement.userId,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
          });
        });

        describe("when user is measurement owner - glucose", () => {
          it("should respond with status 200", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const measurement = await createGlucoseMeasurementData(user);
            const body = generateValidBody();

            const response = await server
              .put(`/measurement/glucose?measurementId=${measurement.id}`)
              .set("Authorization", `Bearer ${token}`)
              .send(body);
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
              id: measurement.id,
              observation: body.observation,
              morning: body.morning,
              afternoon: body.afternoon,
              night: body.night,
              type: measurement.type,
              userId: measurement.userId,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
          });
        });
      });
    });
  });
});

describe("DELETE /measurement/:measurementType", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.delete("/measurement/blood-pressure?measurementId=1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.delete("/measurement/blood-pressure?measurementId=1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.delete("/measurement/blood-pressure?measurementId=1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when measurementId does not exist (= 0)", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.delete("/measurement/blood-pressure?measurementId=0").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when measurementId does not exist (> 1)", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.delete("/measurement/blood-pressure?measurementId=1").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    describe("when measurementId is valid", () => {
      it("should respond with status 404 when user is not measurement owner", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const otherUser = await createUser();
        const measurement = await createPressureMeasurementData(otherUser);

        const response = await server.delete(`/measurement/blood-pressure?measurementId=${measurement.id}`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
      });

      it("should respond with status 200 - blood pressure", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const measurement = await createPressureMeasurementData(user);
        const response = await server.delete(`/measurement/blood-pressure?measurementId=${measurement.id}`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.OK);
      });

      it("should respond with status 200 - oxygen", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const measurement = await createOxygenMeasurementData(user);
        const response = await server.delete(`/measurement/oxygen?measurementId=${measurement.id}`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.OK);
      });

      it("should respond with status 200 - glucose", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const measurement = await createGlucoseMeasurementData(user);
        const response = await server.delete(`/measurement/glucose?measurementId=${measurement.id}`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.OK);
      });
    });
  });
});
