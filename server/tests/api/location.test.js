const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");

const { clearDatabase, addUserToDb, addLocationToDb, getTokenForUser, locationsInDb, addItemToDb, addLoantypeToDb, addRecordToDb } = require("./testutils");

const api = supertest(app);

describe("when there is users and locations in db (location tests)", () => {
    let staffToken = "";
    let userToken = "";
    let locationsAtStart = 0;
    let locationIds = [];
    beforeEach(async () => {
        await clearDatabase();
        staffToken = "Bearer " + getTokenForUser(await addUserToDb("admin", "password", true));
        userToken = "Bearer " + getTokenForUser(await addUserToDb("user", "salis", false));
        locationIds = [];
        locationIds.push(await addLocationToDb("Living room shelf"));
        locationIds.push(await addLocationToDb("Bedroom shelf"));
        locationsAtStart = await locationsInDb();
    });

    describe("and staff user is logged in", () => {
        test("location can be received", async () => {
            const res = await api
                .get(`/api/location/${locationIds[0]}`)
                .set({ Authorization: staffToken })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.name).toBe("Living room shelf");
            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
        });

        test("location cannot be added with invalid data", async () => {
            const res = await api
                .post("/api/location")
                .set({ Authorization: staffToken })
                .send({
                    nam: "A new Location"
                })
                .expect(400)
                .expect("Content-type", /application\/json/);

            expect(await locationsInDb()).toBe(locationsAtStart);
            expect(res.body.error).toBe("name is missing");
        });

        test("location can be added with valid data", async () => {
            const res = await api
                .post("/api/location")
                .set({ Authorization: staffToken })
                .send({
                    name: "A New Location"
                })
                .expect(201)
                .expect("Content-type", /application\/json/);

            expect(await locationsInDb()).toBe(locationsAtStart + 1);

            expect(res.body.name).toBe("A New Location");
            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
        });

        test("location can be edited", async () => {
            const res = await api
                .put(`/api/location/${locationIds[0]}`)
                .set({ Authorization: staffToken })
                .send({
                    name: "The new name of the location"
                })
                .expect(200)
                .expect("Content-type", /application\/json/)

            expect(await locationsInDb()).toBe(locationsAtStart);
            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.name).toBe("The new name of the location");

            const res2 = await api
                .get(`/api/location/${locationIds[0]}`)
                .expect(200);

            expect(res2.body.name).toBe("The new name of the location");
        });

        test("useless location can be removed", async () => {
            await api
                .delete(`/api/location/${locationIds[0]}`)
                .set({ Authorization: staffToken })
                .expect(204);

            expect(await locationsInDb()).toBe(locationsAtStart - 1);
        });

        describe("and there is items that uses the location", () => {
            beforeEach(async () => {
                const record = await addRecordToDb();
                const loantype = await addLoantypeToDb(true, true, 4, 28);
                const item = await addItemToDb(record, locationIds[0], loantype._id);
                console.log("ITEM!!!!!!!!!!", record, loantype._id, locationIds[0]);
            });
            test("location cannot be removed", async () => {
                console.log("This is the locationId", locationIds[0]);
                const result = await api
                    .delete(`/api/location/${locationIds[0]}`)
                    .set({ Authorization: staffToken })
                    .expect(409)
                    .expect("Content-type", /application\/json/);

                expect(result.body.error).toBe("there are items using this location");
            });
        });
    });

    describe("and non-staff user is logged in", () => {
        test("location can be received", async () => {
            const res = await api
                .get(`/api/location/${locationIds[0]}`)
                .set({ Authorization: userToken })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.name).toBe("Living room shelf");
            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
        });

        test("location cannot be added", async () => {
            await api
                .post("/api/location")
                .set({ Authorization: userToken })
                .send({
                    name: "New location"
                })
                .expect(403)
                .expect("Content-type", /application\/json/)
        });
        test("location cannot be edited", async () => {
            await api
                .put(`/api/location/${locationIds[0]}`)
                .set({ Authorization: userToken })
                .send({
                    name: "The new name"
                })
                .expect(403)
                .expect("Content-type", /application\/json/);
        });
        test("location cannot be removed", async () => {
            await api
                .delete(`/api/location/${locationIds[0]}`)
                .set({ Authorization: userToken })
                .expect(403)
                .expect("Content-type", /application\/json/);
        });
    });

    describe("and user is not logged in", () => {
        test("location can be received", async () => {
            const res = await api
                .get(`/api/location/${locationIds[0]}`)
                .set({ Authorization: userToken })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.name).toBe("Living room shelf");
            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
        });
        test("location cannot be added", async () => {
            await api
                .post("/api/location")
                .send({
                    name: "New location"
                })
                .expect(401);
        });
        test("location cannot be edited", async () => {
            await api
                .put(`/api/location/${locationIds[0]}`)
                .send({
                    name: "New location"
                })
                .expect(401);
        });
        test("location cannot be removed", async () => {
            await api
                .delete(`/api/location/${locationIds[0]}`)
                .expect(401);
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});