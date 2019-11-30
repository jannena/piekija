const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");

const { clearDatabase, addUserToDb, addLoantypeToDb, addLocationToDb, getTokenForUser, loantypesInDb, addItemToDb, addRecordToDb } = require("./testutils");

const [test, afterAll] = [it, after];
const expect = require("expect");

const api = supertest(app);

describe("when there is users and loantypes in db (loantype tests)", () => {
    let staffToken = "";
    let userToken = "";
    let loantypesAtStart = 0;
    let loantypeIds = [];
    beforeEach(async () => {
        await clearDatabase();
        staffToken = "Bearer " + getTokenForUser(await addUserToDb("admin", "password", true));
        userToken = "Bearer " + getTokenForUser(await addUserToDb("user", "salis", false));
        loantypeIds = [];
        loantypeIds.push((await addLoantypeToDb(true, false, 10, 10))._id);
        loantypeIds.push((await addLoantypeToDb(false, false, 0, 0))._id);
        loantypesAtStart = await loantypesInDb();
    });

    describe("and staff user is logged in", () => {
        test("all loantypes can be received", async () => {
            const res = await api
                .get("/api/loantype")
                .set({ Authorization: staffToken })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.length).toBe(2);
            expect(res.body[0].name).toBe("This is a loantype");
            expect(res.body[0].id).toBeDefined();
            expect(res.body[0]._id).not.toBeDefined();
            expect(res.body[0].__v).not.toBeDefined();
        });

        test("loantype can be received", async () => {
            const res = await api
                .get(`/api/loantype/${loantypeIds[0]}`)
                .set({ Authorization: staffToken })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.name).toBe("This is a loantype");
            expect(res.body.canBeLoaned).toBe(true);
            expect(res.body.canBePlacedAHold).toBe(false);
            expect(res.body.renewTimes).toBe(10);
            expect(res.body.loanTime).toBe(10);
            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
        });

        test("loantype cannot be added with invalid data", async () => {
            const res = await api
                .post("/api/loantype")
                .set({ Authorization: staffToken })
                .send({
                    name: "loantype",
                    canBeLoaned: true,
                    canBePlacedAHold: false,
                    renewTimes: 0,
                    loanTim: 2
                })
                .expect(400)
                .expect("Content-type", /application\/json/);

            expect(await loantypesInDb()).toBe(loantypesAtStart);
            expect(res.body.error).toBe("name or canBePlacedAHold or canBeLoaned or renewTimes or loanTime is missing");
        });

        test("loantype can be added with valid data", async () => {
            const res = await api
                .post("/api/loantype")
                .set({ Authorization: staffToken })
                .send({
                    name: "A New Loantype",
                    canBeLoaned: true,
                    canBePlacedAHold: false,
                    renewTimes: 0,
                    loanTime: 2
                })
                .expect(201)
                .expect("Content-type", /application\/json/);

            expect(await loantypesInDb()).toBe(loantypesAtStart + 1);

            expect(res.body.name).toBe("A New Loantype");
            expect(res.body.canBeLoaned).toBe(true);
            expect(res.body.canBePlacedAHold).toBe(false);
            expect(res.body.renewTimes).toBe(0);
            expect(res.body.loanTime).toBe(2);
            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
        });

        test("loantype can be edited", async () => {
            const res = await api
                .put(`/api/loantype/${loantypeIds[0]}`)
                .set({ Authorization: staffToken })
                .send({
                    name: "The new name of the loantype",
                    canBeLoaned: true,
                    canBePlacedAHold: true,
                    loanTime: 100,
                    renewTimes: 100
                })
                .expect(200)
                .expect("Content-type", /application\/json/)

            expect(await loantypesInDb()).toBe(loantypesAtStart);
            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.name).toBe("The new name of the loantype");
            expect(res.body.canBeLoaned).toBe(true);
            expect(res.body.canBePlacedAHold).toBe(true);
            expect(res.body.renewTimes).toBe(100);
            expect(res.body.loanTime).toBe(100);

            const res2 = await api
                .get(`/api/loantype/${loantypeIds[0]}`)
                .expect(200);

            expect(res2.body.name).toBe("The new name of the loantype");
            expect(res2.body.canBeLoaned).toBe(true);
            expect(res2.body.canBePlacedAHold).toBe(true);
            expect(res2.body.renewTimes).toBe(100);
            expect(res2.body.loanTime).toBe(100);
        });

        test("useless loantype can be removed", async () => {
            await api
                .delete(`/api/loantype/${loantypeIds[0]}`)
                .set({ Authorization: staffToken })
                .expect(204);

            expect(await loantypesInDb()).toBe(loantypesAtStart - 1);
        });

        describe("and there is items that uses the loantype", () => {
            beforeEach(async () => {
                const record = await addRecordToDb();
                const location = await addLocationToDb("A New Location");
                const item = await addItemToDb(record, location, loantypeIds[0]);
                console.log(item);
            });

            test("loantype cannot be removed", async () => {
                console.log("This is the loantypeId", loantypeIds[0]);
                const result = await api
                    .delete(`/api/loantype/${loantypeIds[0]}`)
                    .set({ Authorization: staffToken })
                    .expect(409)
                    .expect("Content-type", /application\/json/);

                expect(result.body.error).toBe("there are items using this loantype");
            });
        });
    });




    describe("and non-staff user is logged in", () => {
        test("loantype can be received", async () => {
            const res = await api
                .get(`/api/loantype/${loantypeIds[0]}`)
                .set({ Authorization: userToken })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.name).toBe("This is a loantype");
            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
        });

        test("loantype cannot be added", async () => {
            await api
                .post("/api/loantype")
                .set({ Authorization: userToken })
                .send({
                    name: "New loantype"
                })
                .expect(403)
                .expect("Content-type", /application\/json/)
        });
        test("loantype cannot be edited", async () => {
            await api
                .put(`/api/loantype/${loantypeIds[0]}`)
                .set({ Authorization: userToken })
                .send({
                    name: "The new name"
                })
                .expect(403)
                .expect("Content-type", /application\/json/);
        });
        test("loantype cannot be removed", async () => {
            await api
                .delete(`/api/loantype/${loantypeIds[0]}`)
                .set({ Authorization: userToken })
                .expect(403)
                .expect("Content-type", /application\/json/);
        });
    });




    describe("and user is not logged in", () => {
        test("loantype can be received", async () => {
            const res = await api
                .get(`/api/loantype/${loantypeIds[0]}`)
                .set({ Authorization: userToken })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.name).toBe("This is a loantype");
            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
        });
        test("loantype cannot be added", async () => {
            await api
                .post("/api/loantype")
                .send({
                    name: "New loantype"
                })
                .expect(401);
        });
        test("loantype cannot be edited", async () => {
            await api
                .put(`/api/loantype/${loantypeIds[0]}`)
                .send({
                    name: "New loantype"
                })
                .expect(401);
        });
        test("loantype cannot be removed", async () => {
            await api
                .delete(`/api/loantype/${loantypeIds[0]}`)
                .expect(401);
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});