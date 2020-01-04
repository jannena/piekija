const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");

const { clearDatabase, loanItemTo, addUserToDb, addLocationToDb, getTokenForUser, itemsInDb, addItemToDb, addLoantypeToDb, addRecordToDb } = require("./testutils");

const [test, afterAll] = [it, after];
const expect = require("expect");

const api = supertest(app);

let users = [];
let tokens = [];
let recordId, loantypeId, locationId;
let item = [];
let itemsAtStart = 0;

describe("when there are everything in the database (item tests)", () => {
    beforeEach(async () => {
        await clearDatabase();
        users = [
            await addUserToDb("admin", "password", true),
            await addUserToDb("kissa", "kissakissa", false)
        ]
        tokens = users
            .map(u => getTokenForUser(u))
            .map(t => ({ Authorization: `Bearer ${t}` }));

        recordId = await addRecordToDb();
        loantypeId = (await addLoantypeToDb(true, true, 10, 10))._id;
        locationId = await addLocationToDb("Joo")
        item = await addItemToDb(recordId, locationId, loantypeId);

        itemsAtStart = await itemsInDb();
    });

    describe("and when staff user is logged in", () => {
        test("item can be created", async () => {
            const res = await api
                .post("/api/item")
                .set(tokens[0])
                .send({
                    record: recordId,
                    loantype: loantypeId,
                    location: locationId,
                    barcode: "123454321",
                    shelfLocation: "84.2 TUD",
                    state: "not loaned",
                    note: "Joo"
                })
                .expect(201)
                .expect("Content-Type", /application\/json/);

            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.location.name).toBe("Joo")
            expect(res.body.location.loanTimes).not.toBeDefined();
            expect(res.body.loantype.name).toBeDefined();

            expect(await itemsInDb()).toBe(itemsAtStart + 1);
        });

        test("item can be updated", async () => {
            const res = await api
                .put(`/api/item/${item._id}`)
                .set(tokens[0])
                .send({
                    loantype: loantypeId,
                    location: locationId,
                    shelfLocation: "84.2 TUD",
                    state: "not loaned",
                    note: "Joo"
                })
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.location.name).toBe("Joo")
            expect(res.body.location.loanTimes).not.toBeDefined();
            expect(res.body.loantype.name).toBeDefined();
        });

        describe("and when item is loaned to user", () => {
            beforeEach(async () => {
                await loanItemTo(users[0]._id, item._id);
            });
            test("item cannot be removed", async () => {
                const res = await api
                    .delete(`/api/item/${item._id}`)
                    .set(tokens[0])
                    .expect(400)
                    .expect("Content-Type", /application\/json/);

                expect(res.body.error).toBe("item is loaned to a user");
                expect(await itemsInDb()).toBe(itemsAtStart);
            });
        });

        test("item can be removed", async () => {
            await api
                .delete(`/api/item/${item._id}`)
                .set(tokens[0])
                .expect(204);

            expect(await itemsInDb()).toBe(itemsAtStart - 1);
        });

        test("item can be searched", async () => {
            const res = await api
                .post("/api/item/search")
                .set(tokens[0])
                .send({
                    barcode: item.barcode
                })
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.location.name).toBe("Joo")
            expect(res.body.location.loanTimes).not.toBeDefined();
            expect(res.body.loantype.name).toBeDefined();
        });
    });

    describe("and staff user is not logged in", () => {
        test("item cannot be created", async () => {
            await api
                .post(`/api/item`)
                .send({
                    title: "moi"
                })
                .expect(401);

            await api
                .post(`/api/item/`)
                .set(tokens[1])
                .send({
                    title: "moi"
                })
                .expect(403);

            expect(await itemsInDb()).toBe(itemsAtStart);
        });
        test("item cannot be updated", async () => {
            await api
                .put(`/api/item/${item._id}`)
                .send({
                    title: "moi"
                })
                .expect(401);

            await api
                .put(`/api/item/${item._id}`)
                .set(tokens[1])
                .send({
                    title: "moi"
                })
                .expect(403);
        });
        test("item cannot be removed", async () => {
            await api
                .delete(`/api/item/${item._id}`)
                .expect(401);

            await api
                .delete(`/api/item/${item._id}`)
                .set(tokens[1])
                .expect(403);

            expect(await itemsInDb()).toBe(itemsAtStart);
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});