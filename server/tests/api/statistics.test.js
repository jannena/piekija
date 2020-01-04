const mongoose = require("mongoose");
const app = require("../../app");
const supertest = require("supertest");

const Item = require("../../models/Item");

const [test, afterAll] = [it, after];
const expect = require("expect");

const api = supertest(app);
const { addItemToDb, addLoantypeToDb, addLocationToDb, addRecordToDb, addUserToDb, loanItemTo, clearDatabase, getTokenForUser } = require("./testutils");

let users = [];
let tokens = [];
let locations = [];
let loantype = null;
let record = null;
let items = null;

describe("when there are some users and records and items in the database (statistics tests)", () => {
    beforeEach(async () => {
        await clearDatabase();

        users = [
            await addUserToDb("admin", "password", true),
            await addUserToDb("kissa", "kissakissa", false)
        ];
        tokens = users
            .map(u => getTokenForUser(u))
            .map(t => ({ Authorization: `Bearer ${t}` }));

        locations = [
            await addLocationToDb("Location 1"),
            await addLocationToDb("Location 2")
        ];

        loantype = await addLoantypeToDb(true, true, 10, 28);

        record = await addRecordToDb();

        items = [
            await addItemToDb(record, locations[0], loantype._id),
            await addItemToDb(record, locations[0], loantype._id),
            await addItemToDb(record, locations[0], loantype._id),

            await addItemToDb(record, locations[1], loantype._id),
            await addItemToDb(record, locations[1], loantype._id),
            await addItemToDb(record, locations[1], loantype._id)
        ];
    });

    describe("and when staff user is logged in", () => {
        test("total returns totals", async () => {
            const res = await api
                .post("/api/statistics/total")
                .set(tokens[0])
                .send()
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(res.body).toEqual({
                items: 6,
                users: 2,
                records: 1
            });
        });

        describe("and when items have been loaned several times", () => {
            beforeEach(async () => {
                console.log("item and user", users[1]._id, items[0]._id);
                await api
                    .post("/api/circulation/loan")
                    .set(tokens[0])
                    .send({
                        user: users[1]._id,
                        item: items[0]._id
                    })
                    .expect(200);
                await api
                    .post("/api/circulation/loan")
                    .set(tokens[0])
                    .send({
                        user: users[0]._id,
                        item: items[2]._id
                    })
                    .expect(200);
                await api
                    .post("/api/circulation/loan")
                    .set(tokens[0])
                    .send({
                        user: users[1]._id,
                        item: items[3]._id
                    })
                    .expect(200);
                // await loanItemTo(users[1], items[0]._id);
                // await loanItemTo(users[1], items[2]._id);
                // await loanItemTo(users[1], items[3]._id);

                await Item.findByIdAndUpdate(items[0]._id, { $set: { lastLoaned: new Date("2017-08-08") } });
                await Item.findByIdAndUpdate(items[2]._id, { $set: { lastLoaned: new Date("2019-12-12") } });
                await Item.findByIdAndUpdate(items[3]._id, { $set: { lastLoaned: new Date("2019-12-12") } });
            });

            test("total loans returns total loans", async () => {
                const res = await api
                    .post("/api/statistics/totalLoans")
                    .set(tokens[0])
                    .send()
                    .expect(200)
                    .expect("Content-Type", /application\/json/);

                expect(res.body).toEqual([
                    ["Location 1", 2],
                    ["Location 2", 1]
                ]);
            });

            test("not loaned since returns not loaned since", async () => {
                const res = await api
                    .post("/api/statistics/notLoanedSince")
                    .set(tokens[0])
                    .send({
                        location: locations[0],
                        date: new Date("2019-12-10").toISOString()
                    })
                    .expect(200)
                    .expect("Content-Type", /application\/json/);

                console.log(res.body);

                expect(res.body.title).toBeDefined();
                expect(res.body.items.length).toBe(2);
                expect(res.body.items[0][0]).toBe(items[0].barcode);
                expect(res.body.items[1][0]).toBe(items[1].barcode);

                const res2 = await api
                    .post("/api/statistics/notLoanedSince")
                    .set(tokens[0])
                    .send({
                        location: locations[1],
                        date: new Date("2019-12-10").toISOString()
                    })
                    .expect(200)
                    .expect("Content-Type", /application\/json/);

                expect(res2.body.title).toBeDefined();
                expect(res2.body.items.length).toBe(2);
            });
        });
    });




    describe("and when staff user is not logged in", () => {
        test("/total cannot be received", async () => {
            await api
                .post("/api/statistics/total")
                .set(tokens[1])
                .send()
                .expect(403);
            await api
                .post("/api/statistics/total")
                .send()
                .expect(401);
        });

        test("/totalLoans cannot be received", async () => {
            await api
                .post("/api/statistics/notLoanedSince")
                .set(tokens[1])
                .send()
                .expect(403);
            await api
                .post("/api/statistics/totalLoans")
                .send()
                .expect(401);
        });
        test("/notLoanedSince cannot be received", async () => {
            await api
                .post("/api/statistics/notLoanedSince")
                .set(tokens[1])
                .send({
                    location: locations[0],
                    date: new Date().toISOString()
                })
                .expect(403);
            await api
                .post("/api/statistics/notLoanedSince")
                .set({ Authorization: "moi" })
                .send({
                    location: locations[0],
                    date: new Date().toISOString()
                })
                .expect(401);
        });
    });

});

afterAll(() => {
    mongoose.connection.close();
});