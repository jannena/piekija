const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");
const Item = require("../../models/Item");

const { getTokenForUser, clearDatabase, addItemToDb, addLoantypeToDb, addLocationToDb, addRecordToDb, addUserToDb, loanItemTo, itemIsLoanedBy, itemIsNotLoanedBy } = require("./testutils");

const [test, afterAll] = [it, after];
const expect = require("expect");

const api = supertest(app);

let users = [];
let items = [];
let tokens = [];

const RENEW_TIMES = 3;

describe("when there are users, records, items, locations and loantypes initially in the database (circulation tests)", () => {
    beforeEach(async () => {
        await clearDatabase();
        users = [
            await addUserToDb("staff", "salasana", true, null),
            await addUserToDb("basic", "sanasala", false, null),
            await addUserToDb("basic2", "sanasala", false, null)
        ];
        tokens = users
            .map(u => getTokenForUser(u))
            .map(t => ({ Authorization: `Bearer ${t}` }));
        const record = await addRecordToDb();
        const loanableLoantype = await addLoantypeToDb(true, true, RENEW_TIMES, 5);
        const notLoanableLoantype = await addLoantypeToDb(false, false, RENEW_TIMES, 5);
        const location = await addLocationToDb("Location #1");
        items = [
            await addItemToDb(record, location._id, loanableLoantype._id),
            await addItemToDb(record, location._id, loanableLoantype._id),
            await addItemToDb(record, location._id, notLoanableLoantype._id)
        ];
    });

    describe("and staff user is logged in", () => {
        test("not loaned and loanable item can be loaned and it will be added to user loans and user will be added to item", async () => {
            const res = await api
                .post("/api/circulation/loan")
                .set(tokens[0])
                .send({ user: users[1]._id, item: items[0]._id })
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(res.body.item.stateDueDate).toBeDefined(); // TODO: Check if due date is correct
            expect(res.body.item.statePersonInCharge).toBe(users[1]._id.toString());

            /* const user = await User.findById(users[1]._id);
            const item = await Item.findById(items[0]._id);

            expect(user.loans.length).toBe(1);
            expect(user.loans[0]).toBe(items[0]._id);
            expect(item.statePersonInCharge).toBe(users[1]._id);
            expect(item.state).toBe("loaned");
            expect(item.stateTimesRenewed).toBe(0); */
            expect(await itemIsLoanedBy(users[1]._id, items[0]._id)).toBe(true);
        });

        test("item cannot be loaned if it has not suitable loantype", async () => {
            const res = await api
                .post("/api/circulation/loan")
                .set(tokens[0])
                .send({ user: users[1]._id, item: items[2]._id })
                .expect(400)
                .expect("Content-Type", /application\/json/);

            expect(res.body.error).toBe("item cannot be loaned because of loantype");
            expect(await itemIsNotLoanedBy(users[1]._id, items[2]._id)).toBe(true);
        });

        test("loaned item cannot be loaned", async () => {
            await loanItemTo(users[2]._id, items[0]._id);

            const res = await api
                .post("/api/circulation/loan")
                .set(tokens[0])
                .send({ user: users[1]._id, item: items[0]._id })
                .expect(400)
                .expect("Content-Type", /application\/json/);

            expect(res.body.error).toBe("item has already been loaned");

            expect(await itemIsLoanedBy(users[2]._id, items[0]._id)).toBe(true);
            expect(await itemIsLoanedBy(users[1]._id, items[0]._id)).toBe(false);
        });

        test("item cannot be loaned if user does not exist", async () => {
            const res = await api
                .post("/api/circulation/loan")
                .set(tokens[0])
                .send({ user: users[1]._id.toString().split("").reverse().join(""), item: items[0]._id })
                .expect(400)
                .expect("Content-Type", /application\/json/);

            expect(res.body.error).toBe("user does not exist");
            expect(await itemIsNotLoanedBy(users[1]._id, items[2]._id)).toBe(true);
        });

        test("item cannot be loaned if item does not exist", async () => {
            const res = await api
                .post("/api/circulation/loan")
                .set(tokens[0])
                .send({ user: users[1]._id, item: items[2]._id.toString().split("").reverse().join("") })
                .expect(400)
                .expect("Content-Type", /application\/json/);

            expect(res.body.error).toBe("item does not exist");
            expect(await itemIsNotLoanedBy(users[1]._id, items[2]._id)).toBe(true);
        });

        test("item can be returned and it will be removed from users loans list and user will be removed from item", async () => {
            await loanItemTo(users[1]._id, items[0]._id);

            const res = await api
                .post("/api/circulation/return")
                .set(tokens[0])
                .send({ user: users[1]._id, item: items[0]._id })
                .expect(200);

            expect(await itemIsNotLoanedBy(users[1]._id, items[2]._id)).toBe(true);
        });

        test(`item can be renewed ${RENEW_TIMES} times but no more`, async () => {
            await loanItemTo(users[1]._id, items[0]._id);

            for (let i = 1; i <= RENEW_TIMES; i++) {
                const res = await api
                    .post("/api/circulation/renew")
                    .set(tokens[0])
                    .send({ item: items[0]._id })
                    .expect(200)
                    .expect("Content-Type", /application\/json/);

                // TODO: ?Check if new dueDate is calculated correctly?

                const item = await Item.findById(items[0]._id);
                expect(item.stateTimesRenewed).toBe(i);
            }

            const res = await api
                .post("/api/circulation/renew")
                .set(tokens[0])
                .send({ item: items[0]._id })
                .expect(400)
                .expect("Content-Type", /application\/json/);

            expect(res.body.error).toBe("renewTimes exeeded");
            // TODO: ??Check if anything changed??
        });
    });








    describe("and user is logged in", () => {
        test("item cannot be loaned", async () => {
            await api
                .post("/api/circulation/loan")
                .set(tokens[1])
                .send({ user: users[1]._id, item: items[0]._id })
                .expect(403)
                .expect("Content-Type", /application\/json/);

            expect(await itemIsNotLoanedBy(users[1]._id, items[0]._id)).toBe(true);
        });

        test("item cannot be returned", async () => {
            await loanItemTo(users[1]._id, items[0]._id);

            await api
                .post("/api/circulation/return")
                .set(tokens[1])
                .send({ item: items[0]._id })
                .expect(403)
                .expect("Content-Type", /application\/json/);

            expect(await itemIsLoanedBy(users[1]._id, items[0]._id)).toBe(true);
        });

        describe("and this user has loaned the item", () => {
            beforeEach(async () => {
                await loanItemTo(users[1]._id, items[0]._id);
            });

            test(`item can be renewed ${RENEW_TIMES} times but no more`, async () => {
                await loanItemTo(users[1]._id, items[0]._id);

                for (let i = 1; i <= RENEW_TIMES; i++) {
                    const res = await api
                        .post("/api/circulation/renew")
                        .set(tokens[1])
                        .send({ item: items[0]._id })
                        .expect(200)
                        .expect("Content-Type", /application\/json/);

                    // TODO: ?Check if new dueDate is calculated correctly?

                    const item = await Item.findById(items[0]._id);
                    expect(item.stateTimesRenewed).toBe(i);
                }

                const res = await api
                    .post("/api/circulation/renew")
                    .set(tokens[1])
                    .send({ item: items[0]._id })
                    .expect(400)
                    .expect("Content-Type", /application\/json/);

                expect(res.body.error).toBe("renewTimes exeeded");
                // TODO: ??Check if anything changed??
            });
        });

        describe("and other user has loaned the item", () => {
            beforeEach(async () => {
                await loanItemTo(users[2]._id, items[0]._id);
            });

            test("user cannot renew the item", async () => {
                const res = await api
                    .post("/api/circulation/renew")
                    .set(tokens[1])
                    .send({ item: items[0]._id })
                    .expect(403)
                    .expect("Content-Type", /application\/json/);

                expect(res.body.error).toBe("you cannot renew this loan");
            });
        });
    });








    describe("and no one is logged in", () => {
        test("cannot reach /loan", async () => {
            await api
                .post("/api/circulation/loan")
                .send({ user: users[0]._id, item: items[0]._id })
                .expect(401);
        });
        test("cannot reach /return", async () => {
            await api
                .post("/api/circulation/return")
                .send({ item: items[0]._id })
                .expect(401);
        });
        test("cannot reach /renew", async () => {
            await api
                .post("/api/circulation/renew")
                .send({ item: items[0]._id })
                .expect(401);
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});