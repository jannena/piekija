const mongoose = require("mongoose");
const app = require("../../app");
const supertest = require("supertest");
const escapeJSON = require("../../utils/escape-json");

console.log(escapeJSON.toString());

const [test, afterAll] = [it, after];
const expect = require("expect");

const api = supertest(app);

const { addUserToDb, clearDatabase, getTokenForUser, initMARC21Data, escapedMARC21Data, recordsInDb, addRecordToDb, addLoantypeToDb, addLocationToDb, addItemToDb }
    = require("./testutils");

let recordsAtStart = 0;
let staffToken = "";
let token = "";

describe("record tests", () => {
    beforeEach(async () => {
        await clearDatabase();
        staffToken = "Bearer " + getTokenForUser(await addUserToDb("fullaccess", "m4ns1kk1", true));
        token = "Bearer " + getTokenForUser(await addUserToDb("basic", "m4ns1kk1", false));

        recordsAtStart = await recordsInDb();
    });
    describe("when staff user is logged in", () => {
        test("record can be added in marc21 format and it will be read correctly", async () => {
            const res = await api
                .post("/api/record")
                .set({ Authorization: staffToken })
                .send({
                    type: "marc21",
                    data: escapedMARC21Data[0]
                })
                .expect(201)
                .expect("Content-type", /application\/json/);

            // console.log("response", res);
            expect(await recordsInDb()).toBe(recordsAtStart + 1);

            expect(res.body.title).toBe("Liitu-ukko");
            expect(res.body.author).toBe("Tudor, C. J"); // TODO: Last .
            expect(res.body.subjects).toEqual([
                "Eddie",
                "salaisuudet",
                "viestit",
                "déjà vu -ilmiö",
                "murha",
                "aikatasot",
                "psykologinen jännityskirjallisuus",
                "jännityskirjallisuus",
                "esikoisteokset",
                "romaanit",
                "kaunokirjallisuus"
            ]);
            expect(res.body.authors).toEqual([
                "Tudor, C. J", // TODO: Last .
                "Salminen, Raimo"
            ]);
            expect(res.body.languages).toEqual([
                "fin",
                "eng"
            ]);
            expect(res.body.image).toBe("http://data.kirjavalitys.fi/data/servlets/ProductRequestServlet?action=getimage&ISBN=9789510425299");
            expect(res.body.previewText).toEqual([
                ["Not made in Finland.", null, null],
                ["Verkkoaineisto", "http://hopero.dev", "Linkki"]
            ]);
            expect(res.body.country).toBe("fi ");
            expect(res.body.year).toBe(2018);
            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();

            const res2 = await api
                .post("/api/record")
                .set({ Authorization: staffToken })
                .send({
                    type: "marc21",
                    data: escapedMARC21Data[2]
                })
                .expect(201)
                .expect("Content-type", /application\/json/);

            expect(res2.body.alphabetizableTitle).toBe("joulukalenteri");
            expect(await recordsInDb()).toBe(recordsAtStart + 2);
        });

        describe("and when there is records in the database", () => {
            let recordId = "";

            beforeEach(async () => {
                recordId = await addRecordToDb();
                recordsAtStart = await recordsInDb();
            });

            test("record can be edited with new marc21 data", async () => {
                const res = await api
                    .put(`/api/record/${recordId}`)
                    .set({ Authorization: staffToken })
                    .send(
                        {
                            type: "marc21",
                            data: escapedMARC21Data[1]
                        })
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                expect(await recordsInDb()).toBe(recordsAtStart);
                expect(res.body.id).toBeDefined();
                expect(res.body._id).not.toBeDefined();
                expect(res.body.__v).not.toBeDefined();

                expect(res.body.title).toBe("Imaginaerum");
                expect(res.body.authors).toEqual([
                    "Nightwish",
                    "Shearman, James"
                ]);

                expect(res.body.subjects).toEqual([
                    "heavy rock",
                    "rock",
                    "progressiivinen rock",
                    "kuorot",
                    "orkesterit",
                    "kelttiläinen kansanmusiikki"
                ]);
                expect(res.body.year).toBe(2011);
            });
            test("record can be removed", async () => {
                await api
                    .delete(`/api/record/${recordId}`)
                    .set({ Authorization: staffToken })
                    .expect(204);
                expect(await recordsInDb()).toBe(recordsAtStart - 1);
            });
            test("record cannot be removed if there is items attached to the record", async () => {
                await addItemToDb(recordId, await addLocationToDb("Joo"), (await addLoantypeToDb(true, true, 10, 10))._id);

                const res = await api
                    .delete(`/api/record/${recordId}`)
                    .set({ Authorization: staffToken })
                    .expect(409);

                expect(res.body.error).toBe("there are items attached to this record");
                expect(await recordsInDb()).toBe(recordsAtStart);
            });
        });
    });

    describe("when non-staff user is logged in", () => {
        test("new record cannot be added", async () => {
            await api
                .post("/api/record")
                .set({ Authorization: token })
                .send(initMARC21Data[0])
                .expect(403);

            expect(await recordsInDb()).toBe(recordsAtStart);
        });

        describe("and when there is record in database", () => {
            let recordId = "";

            beforeEach(async () => {
                recordId = await addRecordToDb();
                recordsAtStart = await recordsInDb();
            });

            test("record can be received", async () => {
                const res = await api
                    .get(`/api/record/${recordId}`)
                    .set({ Authorization: token })
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                expect(res.body.id).toBeDefined();
                expect(res.body._id).not.toBeDefined();
                expect(res.body.__v).not.toBeDefined();
                expect(res.body.title).toBe("A New Book");
            });

            test("record cannot be removed", async () => {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", recordId);
                await api
                    .delete(`/api/record/${recordId}`)
                    .set({ Authorization: token })
                    .expect(403);

                expect(await recordsInDb()).toBe(recordsAtStart);
            });

            test("record cannot be edited", async () => {
                await api
                    .put(`/api/record/${recordId}`)
                    .set({ Authorization: token })
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
            let recordId = "";

            beforeEach(async () => {
                recordId = await addRecordToDb();
                recordsAtStart = await recordsInDb();
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
                await api
                    .delete(`/api/record/${recordId}`)
                    .expect(401);

                expect(await recordsInDb()).toBe(recordsAtStart);
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