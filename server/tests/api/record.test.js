const mongoose = require("mongoose");
const app = require("../../app");
const supertest = require("supertest");

const api = supertest(app);

const { addUserToDb, clearDatabase, getTokenForUser, initMARC21Data } = require("./testutils");

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
            expect(res.body.id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
        });

        test("record can be edited with new marc21 data", () => {});
        test("record can be removed", () => {});
        test("removing record removes also items that are attached to the record", () => {});

        // TODO: Check whether there is actually a new record in db. !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    });

    describe("when user is not logged in", () => {
        test("new record cannot be added", async () => {
            const res = await api
                .post("/api/record")
                .expect(401);

            expect(res.body.error).toBe("you must login first");
        });

        test("record cannot be removed", () => {});
        test("record cannot be edited", () => {});
    });
});

afterAll(() => {
    mongoose.connection.close();
})