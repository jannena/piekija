const mongoose = require("mongoose");
const app = require("../../app");
const supertest = require("supertest");

const [test, afterAll] = [it, after];
const expect = require("expect");

const api = supertest(app);

const { clearDatabase, addUserToDb, getTokenForUser, usersInDb, addShelfToDb, shelvesInDb, addRecordToDb, addItemToDb, addLoantypeToDb, addLocationToDb, loanItemTo } = require("./testutils");

// TODO: Tests for /api/user/search

describe("when there is users in database (user tests)", () => {
    let staffToken = "";
    let userToken = "";
    let usersAtStart = 0;
    let userId = "";
    beforeEach(async () => {
        await clearDatabase();
        const user = await addUserToDb("user", "password", false);
        userId = user._id;
        staffToken = "Bearer " + getTokenForUser(await addUserToDb("admin", "password", true));
        userToken = "Bearer " + getTokenForUser(user);
        usersAtStart = await usersInDb();
    });

    describe("and when staff user is logged in", () => {
        test("other users can be received", async () => {
            // const res = await api
            //     .get("/api/user")
            //     .set({ Authorization: staffToken })
            //     .expect(200)
            //     .expect("Content-type", /application\/json/);

            // expect(res.body.length).toBe(usersAtStart);
            // expect(res.body[0].id).toBeDefined();

            const res2 = await api
                .get(`/api/user/${userId}`)
                .set({ Authorization: staffToken })
                .expect(200)
                .expect("Content-type", /application\/json/);

            console.log("Mikä mättää?", res2.body);
            expect(res2.body.id).toBeDefined();
            expect(res2.body._id).not.toBeDefined();
            expect(res2.body.__v).not.toBeDefined();
            expect(res2.body.passwordHash).not.toBeDefined();
            expect(res2.body.username).toBe("user");
            expect(res2.body.staff).toBe(false);
            expect(res2.body.barcode).toBeDefined();
            expect(res2.body.loans).toBeDefined();
            expect(res2.body.name).toBeDefined();
            expect(res2.body.shelves).toBeDefined();
            expect(res2.body.tfa).not.toBeDefined();
            expect(res2.body.TFACode).not.toBeDefined();
        });

        test("me can be received", async () => {
            const res = await api
                .get("/api/user/me")
                .set({ Authorization: staffToken })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.passwordHash).not.toBeDefined();
            expect(res.body.username).toBe("admin");
            expect(res.body.staff).toBe(true);
            expect(res.body.barcode).toBeDefined();
            expect(res.body.loans).toBeDefined();
            expect(res.body.name).toBeDefined();
            expect(res.body.shelves).toBeDefined();
            expect(res.body.TFACode).not.toBeDefined();
            // expect(res.body.tfa).not.toBeDefined();
        });

        test("user cannot be added with invalid data", async () => {
            const res = await api
                .post("/api/user")
                .set({ Authorization: staffToken })
                .send({
                    username: "uniqueIsThis"
                })
                .expect(400)
                .expect("Content-type", /application\/json/);

            expect(await usersInDb()).toBe(usersAtStart);
            expect(res.body.error).toMatch("is missing");
        });

        test("user cannot be added if username is already registered", async () => {
            const res = await api
                .post("/api/user")
                .set({ Authorization: staffToken })
                .send({
                    username: "user",
                    name: "Joo",
                    barcode: "asdasd92",
                    staff: false,
                    password: "kissamenikauppaanJyväskylässä"
                })
                .expect(400)
                .expect("Content-type", /application\/json/);

            expect(await usersInDb()).toBe(usersAtStart);
            expect(res.body.error).toMatch("unique");
        });

        test("user can be added with valid data", async () => {
            const res = await api
                .post("/api/user")
                .set({ Authorization: staffToken })
                .send({
                    name: "Joku",
                    username: "uniqueThisIs",
                    password: "1234567890",
                    staff: false,
                    barcode: "12312344343"
                })
                .expect(201)
                .expect("Content-type", /application\/json/);

            expect(await usersInDb()).toBe(usersAtStart + 1);

            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.passwordHash).not.toBeDefined();
            expect(res.body.username).toBe("uniqueThisIs");
            expect(res.body.staff).toBe(false);
            expect(res.body.barcode).toBe("12312344343")
            expect(res.body.loans).toEqual([]);
            expect(res.body.name).toBe("Joku");
            expect(res.body.shelves).toEqual([]);
        });

        test("user can be edited", async () => {
            const res = await api
                .put(`/api/user/${userId}`)
                .set({ Authorization: staffToken })
                .send({
                    name: "uusi",
                    barcode: "23812iodjkashd2",
                    username: "new",
                    password: "12312312321323",
                    staff: true
                })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.passwordHash).not.toBeDefined();
            expect(res.body.username).toBe("new");
            expect(res.body.staff).toBe(true);
            expect(res.body.barcode).toBe("23812iodjkashd2");
            expect(res.body.loans).toEqual([]);
            expect(res.body.name).toBe("uusi");
            expect(res.body.shelves).toEqual([]);
            expect(res.body.tfa).not.toBeDefined();
            expect(res.body.TFACode).not.toBeDefined();
        });

        test("user can be removed if they have not loaned anything and shelves of this user will be removed too", async () => {
            await addShelfToDb("Hylly", false, userId, []);
            expect(await shelvesInDb()).toBe(1);

            await api
                .delete(`/api/user/${userId}`)
                .set({ Authorization: staffToken })
                .expect(204);

            expect(await shelvesInDb()).toBe(0);
            expect(await usersInDb()).toBe(usersAtStart - 1);
        });

        test("user cannot be removed if they have loaned something", async () => {
            await addShelfToDb("Hylly", false, userId, []);
            const item = await addItemToDb(await addRecordToDb(), await addLocationToDb(), (await addLoantypeToDb(true, true, 10, 10))._id);
            await loanItemTo(userId, item._id);

            await api
                .delete(`/api/user/${userId}`)
                .set({ Authorization: staffToken })
                .expect(409);

            expect(await shelvesInDb()).toBe(1);
            expect(await usersInDb()).toBe(usersAtStart);
        });
    });



    describe("and when non-staff user is logged in", () => {
        test("other users cannot be received", async () => {
            await api
                .get("/api/user")
                .set({ Authorization: userToken })
                .expect(403)
                .expect("Content-type", /application\/json/);

            await api
                .get(`/api/user/${userId}`)
                .set({ Authorization: userToken })
                .expect(403)
                .expect("Content-type", /application\/json/);
        });

        test("me can be received", async () => {
            const res = await api
                .get("/api/user/me")
                .set({ Authorization: userToken })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.passwordHash).not.toBeDefined();
            expect(res.body.username).toBe("user");
            expect(res.body.staff).toBe(false);
            expect(res.body.barcode).toBeDefined();
            expect(res.body.loans).toEqual([]);
            expect(res.body.name).toBeDefined();
            expect(res.body.shelves).toEqual([]);
            expect(res.body.tfa).toBeDefined();
            expect(res.body.TFACode).not.toBeDefined();
        });

        test("user cannot be added", async () => {
            await api
                .put(`/api/user/${userId}`)
                .set({ Authorization: userToken })
                .send({
                    name: "Nimi",
                    username: "newUsername",
                    password: "TheBetPasswordEver(TBPE)",
                    barcode: "joooooooooo",
                    staff: true
                })
                .expect(403);

            expect(await usersInDb()).toBe(usersAtStart);
        });

        test("me (name and password) can be edited", async () => {
            const res = await api
                .put("/api/user/me")
                .set({ Authorization: userToken })
                .send({
                    name: "My new name",
                    password: "MyNewPassword(MNP)",
                    oldPassword: "password"
                })
                .expect(200)
                .expect("Content-type", /application\/json/)

            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.passwordHash).not.toBeDefined();
            expect(res.body.username).toBe("user");
            expect(res.body.staff).toBe(false);
            expect(res.body.barcode).toBeDefined();
            expect(res.body.loans).toEqual([]);
            expect(res.body.name).toBeDefined();
            expect(res.body.shelves).toEqual([]);

            const login = await api
                .post("/api/login")
                .send({
                    username: "user",
                    password: "MyNewPassword(MNP)"
                })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(login.body.token).toBeDefined();
        });

        test("password cannot be changed with wrong oldPassword", async () => {
            const res = await api
                .put("/api/user/me")
                .set({ Authorization: userToken })
                .send({
                    password: "kissanviikset",
                    oldPassword: "password123123"
                })
                .expect(403)
                .expect("Content-type", /application\/json/);

            expect(res.body.error).toBe("wrong oldPassword");
        });

        test("password cannot be changed without oldPassword", async () => {
            const res = await api
                .put("/api/user/me")
                .set({ Authorization: userToken })
                .send({
                    password: "kissanviikset"
                })
                .expect(400)
                .expect("Content-type", /application\/json/);

            expect(res.body.error).toBe("oldPassword is missing");
        });

        test("two-factor authenticaion can be enabled", async () => {
            const res = await api
                .put("/api/user/me")
                .set({ Authorization: userToken })
                .send({
                    tfa: true,
                    oldPassword: "password"
                })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.TFAQR).toBeDefined();
            expect(res.body.TFAQR.length).toBeGreaterThan(30);
        });

        test("two-factor authentication can be disabled after enablation", async () => {
            await api
                .put("/api/user/me")
                .set({ Authorization: userToken })
                .send({
                    tfa: true,
                    oldPassword: "password"
                })
                .expect(200)
                .expect("Content-type", /application\/json/);

            const res = await api
                .put("/api/user/me")
                .set({ Authorization: userToken })
                .send({
                    tfa: false,
                    oldPassword: "password"
                })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.tfa).toBe(false);
        });

        test("me password must be over 10 characters", async () => {
            const res = await api
                .put("/api/user/me")
                .set({ Authorization: userToken })
                .send({
                    password: "short",
                    oldPassword: "password"
                })
                .expect(400)
                .expect("Content-type", /application\/json/);

            expect(res.body.error).toBe("password too short");
        });

        test("me staff cannot be edited", async () => {
            const res = await api
                .put("/api/user/me")
                .set({ Authorization: userToken })
                .send({
                    name: "Joo",
                    oldPassword: "password",
                    staff: true
                })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.staff).toBe(false);
        });

        test("other user cannot be edited", async () => {
            await api
                .put(`/api/user/${userId}`)
                .set({ Authorization: userToken })
                .send({
                    name: "moi"
                })
                .expect(403);
        });

        test("other user cannot be removed", async () => {
            await api
                .delete(`/api/user/${userId}`)
                .set({ Authorization: userToken })
                .expect(403);

            expect(await usersInDb()).toBe(usersAtStart);
        });
    });



    describe("and when user is not logged in", () => {
        test("other users cannot be received", async () => {
            await api
                .get("/api/user")
                .expect(401)
                .expect("Content-type", /application\/json/);
        });

        test("me cannot be received", async () => {
            await api
                .get("/api/user/me")
                .expect(401)
                .expect("Content-type", /application\/json/);
        });
        test("user cannot be added", async () => {
            await api
                .post("/api/user")
                .send({
                    name: "name",
                    username: "username",
                    staff: true
                })
                .expect(401)
                .expect("Content-type", /application\/json/);

            expect(await usersInDb()).toBe(usersAtStart);
        });

        test("user cannot be edited", async () => {
            await api
                .put(`/api/user/${userId}`)
                .send({
                    password: "newPassword",
                    name: "MyName"
                })
                .expect(401)
                .expect("Content-type", /application\/json/);
        });

        test("user cannot be removed", async () => {
            await api
                .delete(`/api/user/${userId}`)
                .expect(401)
                .expect("Content-type", /application\/json/);

            expect(await usersInDb()).toBe(usersAtStart);
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});