const mongoose = require("mongoose");
const app = require("../../app");
const supertest = require("supertest");

const api = supertest(app);

const { addUserToDb, clearDatabase } = require("./testutils");

describe("when there is users in the db", () => {
    beforeAll(async () => {
        await clearDatabase();
        await addUserToDb("root", "salasana", false);
    });

    test("can log in with correct credentials and return token", async () => {
        const res = await api
            .post("/api/login")
            .send({
                username: "root",
                password: "salasana"
            })
            .expect(200)
            .expect("Content-type", /application\/json/);

        expect(res.body.token).toBeDefined();
    });

    test("cannot log in with invalid credentials", async () => {
        const res = await api
            .post("/api/login")
            .send({
                username: "anneli",
                password: "salasana"
            })
            .expect(401)
            .expect("Content-type", /application\/json/);

        expect(res.body.error).toBe("wrong username or password");
    });
});

afterAll(() => {
    mongoose.connection.close();
});