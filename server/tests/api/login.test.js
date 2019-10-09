const mongoose = require("mongoose");
const app = require("../../app");
const supertest = require("supertest");

const api = supertest(app);

const { addUserToDb, clearDatabase, generateCode } = require("./testutils");

let tfaCode = "";

describe("when there is users in the db (login tests)", () => {
    beforeAll(async () => {
        await clearDatabase();
        await addUserToDb("root", "salasana", false);
        tfaCode = (await addUserToDb("2fauth", "salissana", false, true)).TFACode;
    });

    describe("and 2 factor authentication is enabled", () => {
        describe("and code is not given", () => {
            test("server returns code request message", async () => {
                const result = await api
                    .post("/api/login")
                    .send({
                        username: "2fauth",
                        password: "salissana"
                    })
                    .expect(400)
                    .expect("Content-type", /application\/json/);

                expect(result.body.error).toBe("code needed");
            })
        });

        describe("and code is given", () => {
            test("user can log in with correct credentials and code", async () => {
                const code = generateCode(tfaCode);
                const result = await api
                    .post("/api/login")
                    .send({
                        username: "2fauth",
                        password: "salissana",
                        code
                    })
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                expect(result.body.token).toBeDefined();
            });
            test("user cannot log in with incorrect credentials and correct code", async () => {
                const code = generateCode(tfaCode);
                const result = await api
                    .post("/api/login")
                    .send({
                        username: "2fauth",
                        password: "salissanaonvaara!!!Hehe.",
                        code
                    })
                    .expect(401)
                    .expect("Content-type", /application\/json/);

                expect(result.body.token).not.toBeDefined();
                expect(result.body.error).toBe("wrong username or password");
            });
            test("user cannot log in with correct credentials and incorrect code", async () => {
                const result = await api
                    .post("/api/login")
                    .send({
                        username: "2fauth",
                        password: "salissana",
                        code: "177837"
                    })
                    .expect(401)
                    .expect("Content-type", /application\/json/);

                expect(result.body.error).toBe("invalid code");
            });
        })
    });

    describe("and 2 factor authentication is disabled", () => {
        test("can log in with correct credentials without token and return token", async () => {
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


});

afterAll(() => {
    mongoose.connection.close();
});