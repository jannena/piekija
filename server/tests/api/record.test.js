const mongoose = require("mongoose");
const app = require("../../app");
const supertest = require("supertest");

const api = supertest(app);

const { addUserToDb, clearDatabase, getTokenForUser, initMARC21Data, recordsInDb, addRecordToDb } = require("./testutils");

let staffToken = "";
let token = "";

beforeAll(async () => {
    await clearDatabase();
    staffToken = getTokenForUser(await addUserToDb("fullaccess", "m4ns1kk1", true));
    token = getTokenForUser(await addUserToDb("basic", "m4ns1kk1", false));
})

describe("record tests", () => {
    describe("when non-staff user is logged in", () => {
        test("record can be added in marc21 format and it will be read correctly", async () => {
            const recordsAtStart = await recordsInDb();
            const res = await api
                .post("/api/record")
                .set({ Authorization: `Bearer ${staffToken}` })
                .send({
                    type: "marc21",
                    data: initMARC21Data[0]
                })
                .expect(201)
                .expect("Content-type", /application\/json/);

            // console.log("response", res);
            expect(await recordsInDb()).toBe(recordsAtStart + 1);

            // TODO: Remove last chars (/ and , etc.)
            expect(res.body.title).toBe("Liitu-ukko /");
            expect(res.body.author).toBe("Tudor, C. J.,");
            expect(res.body.subjects).toEqual([
                "Eddie",
                "salaisuudet",
                "viestit",
                "déjà vu -ilmiö",
                "murha",
                "aikatasot"
            ]);
            // TODO: Remove last chars
            expect(res.body.authors).toEqual([
                "Salminen, Raimo,",
                "Tudor, C. J.,"
            ]);
            expect(res.body.languages).toEqual([
                "fin",
                "eng"
            ]);
            expect(res.body.year).toBe(2018);
            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
        });

        describe("and when there is records in the databse", () => {
            const recordId = "";

            beforeEach(async () => {
                recordId = await addRecordToDb();
            });

            test("record can be edited with new marc21 data", async () => {
                const recordsAtStart = await recordsInDb();
                const res = await api
                    .put(`/api/record/${recordId}`)
                    .send(initMARC21Data[1])
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                expect(await recordId()).toBe(recordsAtStart);
                expect(res.body.id).toBeDefined();
                expect(res.body._id).not.toBeDefined();
                expect(res.body.__v).not.toBeDefined();

                // TODO: Remove last characters
                expect(res.body.title).toBe("Imaginaerum /");
                expect(res.body.authors).toEqual([
                    "Nightwish,",
                    "Shearman, James,"
                ]);

                expect(res.body.subjects).toEqual([
                    "heavy-rock",
                    "rock",
                    "progressiivinen rock",
                    "kuorot",
                    "orkesterit",
                    "kelttiläinen kansanmusiikki"
                ]);
                expect(res.body.year).toBe(2011);
            });
            test("record can be removed", async () => {
                const recordsAtStart = await recordsInDb();
                await api
                    .delete(`/api/record/${recordId}`)
                    .expect(204);
                expect(await recordsInDb()).toBe(recordsAtStart - 1);
            });
            test("record cannot be removed if there is items arttached to the record", () => {
                // TODO: Do the test
            });
        });
    });

    describe("when non-staff user is logged in", () => {
        test("new record cannot be added", async () => {
            const recordAtStart = await recordsInDb();
            await api
                .post("/api/record")
                .send(initMARC21Data[0])
                .expect(403);

            expect(await recordsInDb()).toBe(recordAtStart);
        });

        describe("and when there is record in database", () => {
            const recordId = "";

            beforeEach(async () => {
                recordId = await addRecordToDb();
            });

            test("record can be received", async () => {
                const res = await api
                    .get(`/api/record/${recordId}`)
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                expect(res.body.id).toBeDefined();
                expect(res.body._id).not.toBeDefined();
                expect(res.body.__v).not.toBeDefined();
                expect(res.body.title).toBe("A New Book");
            });

            test("record cannot be removed", async () => {
                const recordAtStart = await recordsInDb();
                await api
                    .delete(`/api/record/${recordId}`)
                    .expect(403);

                expect(await recordsInDb()).toBe(recordAtStart);
            });

            test("record cannot be edited", async () => {
                await api
                    .put(`/api/record/${recordId}`)
                    .send(initMARC21Data[0])
                    .expect(403);
                // TODO: Check whether there is actually no changes in the database!
            });
        });
    });

    describe("when user is not logged in", () => {
        test("new record cannot be added", async () => {
            const res = await api
                .post("/api/record")
                .expect(401);

            expect(res.body.error).toBe("you must login first");
        });

        describe("and when there is record in database", () => {
            const recordId = "";

            beforeEach(async () => {
                recordId = await addRecordToDb();
            });

            test("record can be received", async () => {
                const res = await api
                    .get(`/api/record/${recordId}`)
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                expect(res.body.id).toBeDefined();
                expect(res.body.title).toBe("A New Book");
            });

            test("record cannot be removed", async () => {
                const recordAtStart = await recordsInDb();
                await api
                    .delete(`/api/record/${recordId}`)
                    .expect(401);

                expect(await recordsInDb()).toBe(recordAtStart);
            });

            test("record cannot be edited", async () => {
                await api
                    .put(`/api/record/${recordId}`)
                    .send(initMARC21Data[0])
                    .expect(401);
                // TODO: Check whether there is actually no changes in the database!
            });
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
})