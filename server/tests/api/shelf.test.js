const mongoose = require("mongoose");
const app = require("../../app");
const supertest = require("supertest");

const api = supertest(app);

const { clearDatabase, addUserToDb, getTokenForUser, shelvesInDb, addShelfToDb, addRecordToDb } = require("./testutils");

let record = "";

beforeAll(async () => {
    record = await addRecordToDb();
});

describe("when there is users and shelves in database (shelf tests)", () => {
    let users = [];
    let tokens = [];
    let shelves = [];
    let shelvesAtStart = 0;
    beforeEach(async () => {
        await clearDatabase();
        users = [
            await addUserToDb("first", "salasanasalasana", false),
            await addUserToDb("second", "salasanasalasana", true)
        ]
        tokens = users
            .map(u => getTokenForUser(u))
            .map(t => ({ Authorization: `Bearer ${t}` }));
        shelvesAtStart = await shelvesInDb();

        shelves = [];
        // Public shelf of user 'first'
        shelves.push(await addShelfToDb("Public shelf", true, users[0], []));
        // Privare shelf of user 'first'
        shelves.push(await addShelfToDb("Private shelf", false, users[0], []));
        // Private shelf of user 'first' shared with user 'second'
        shelves.push(await addShelfToDb("Shared private shelf", false, users[0], [users[1]]));
    });

    test("shelf can be created and it will be added to user's document", async () => {
        const res = await api
            .post("/api/shelf")
            .set(tokens[0])
            .send({
                name: "My first shelf",
                public: false,
                description: "This is my new shelf. Do you like it?"
            })
            .expect(201)
            .expect("Content-type", /application\/json/);

        expect(await shelvesInDb()).toBe(shelvesAtStart + 1);

        expect(res.body.id).toBeDefined();
        expect(res.body._id).not.toBeDefined();
        expect(res.body.__v).not.toBeDefined();
        expect(res.body.name).toBe("My first shelf");
        expect(res.body.description).toBe("This is my new shelf. Do you like it?");
        expect(res.body.public).toBe(false);
        expect(res.body.author.username).toBe("first");
        expect(res.body.author.id).toBeDefined();
        expect(res.body.author.name).toBeDefined();
        expect(res.body.author.passwordHash).not.toBeDefined();


        // TODO: Is Shelf added to user's document?
    });

    test("shelf cannot be added with invalid request", () => { });

    test("if nobody is logged in, shelf cannot be created", async () => {
        await api
            .post("/api/shelf")
            .send({
                name: "Joo",
                public: false,
                description: "joo"
            })
            .expect(401);

        expect(await shelvesInDb()).toBe(shelvesAtStart);
    });

    describe("when the author of the shelf is logged in", () => {
        test("private shelf can be received", async () => {
            const res = await api
                .get(`/api/shelf/${shelves[1]._id}`)
                .set(tokens[0])
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.author.username).toBe("first");
            expect(res.body.author.id).toBeDefined();
            expect(res.body.records).toBeDefined();
            expect(res.body.name).toBe("Private shelf");
        });

        test("shelf (public/private, name, description) can be edited", async () => {
            const res = await api
                .put(`/api/shelf/${shelves[1]._id}`)
                .set(tokens[0])
                .send({
                    name: "PPrivate shelf",
                    description: "description...",
                    public: true
                })
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.id).toBeDefined();
            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.name).toBe("PPrivate shelf");
            expect(res.body.public).toBe(true);
            expect(res.body.records).toBeDefined();
            expect(res.body.sharedWith).toBeDefined();
            expect(res.body.description).toBe("description...");
            expect(res.body.author.username).toBe("first");
            expect(res.body.author.id).toBeDefined();
        });

        test("shelf can be shared", async () => {
            await api
                .post(`/api/shelf/${shelves[1]._id}/share`)
                .set(tokens[0])
                .send({
                    user: users[1].username
                })
                .expect(200);

            const res = await api
                .get(`/api/shelf${shelves[1]._id}`)
                .set(tokens[0])
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.sharedWith[0].username).toBe(users[1].username);
            expect(res.body.sharedWith[0].id).toBe(users[1]._id);
            expect(res.body.sharedWith[0]._id).not.toBeDefined();
            expect(res.body.sharedWith[0].__v).not.toBeDefined();
            expect(res.body.sharedWith[0].passwordHash).not.toBeDefined();
        });

        test("shelf can be unshared", () => {
            
        });

        test("records and notes can be added to shelf", async () => {
            const res1 = await api
                .post(`/api/shelf/${shelves[1]._id}/shelve`)
                .set(tokens[0])
                .send({
                    record,
                    note: "In this text, I tell you why I have added this record to this shelf."
                })
                .expect(201);

            expect(res1.body.record).toBe(record);
            expect(res1.body.note).toBe("In this text, I tell you why I have added this record to this shelf.");

            const res = await api
                .get(`/api/shelf${shelves[1]._id}`)
                .set(tokens[0])
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.records[0].record.title).toBe("A New Book");
            expect(res.records[0].note).toBe("In this text, I tell you why I have added this record to this shelf.");
        });

        test("records and notes can be edited", () => {
            
        });

        test("records and notes can be removed", () => {
            
        });

        test("shelf can be removed", async () => {
            await api
                .delete(`/api/shelf/${shelves[1]._id}`)
                .set(tokens[0])
                .expect(204);

            expect(await shelvesInDb()).toBe(shelvesAtStart - 1);
        });
    });

    describe("when user that the shelf has been shared with is logged in", () => {
        test("unshared private shelf cannot be received", async () => {
            await api
                .get(`/api/shelf/${shelves[1]._id}`)
                .set(tokens[1])
                .expect(403);
        });

        test("shared private shelf can be received", async () => {
            const res = await api
                .get(`/api/shelf/${shelves[2]._id}`)
                .set(tokens[1])
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.name).toBe("Shared private shelf");
            expect(res.body.records).toBeDefined();
            expect(res.body.sharedWith[0].username).toBe("second");
        });

        test("records can be added to shelf", async () => {
            const res = await api
                .post(`/api/shelf/${shelves[2]._id}/shelve`)
                .set(tokens[1])
                .send({
                    record,
                    note: "moikku"
                })
                .expect(201)
                .expect("Content-type", /application\/json/);

            expect(res.body.record).toBe(record);
            expect(res.body.note).toBe(moikku);

            const res2 = await api
                .get(`/api/shelf/${shelves[2]._id}`)
                .set(tokens[1])
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res2.body.records[0].note).toBe("moikku");
            expect(res2.body.records[0].record.id).toBe(record);
            expect(res2.body.records[0].record.title).toBe("A new Book");
        });

        test("records cannot be edited", () => {
            
        });

        test("records cannot be removed", () => {
            
        });

        test("shelf cannot be edited", async () => {
            await api
                .put(`/api/shelf/${shelves[2]._id}`)
                .set(tokens[1])
                .send({
                    name: "A New Name",
                    description: "Yeah",
                    public: true
                })
                .expect(403);

            const res = await api
                .get(`/api/shelf/${shelves[2]._id}`)
                .set(tokens[1])
                .expect(200);

            expect(res.body.name).toBe("Shared private shelf");
            expect(res.body.description).toBe("This is a shelf.");
            expect(res.body.public).toBe(false);
            // TODO: Check that there is no changes
        });

        test("shelf cannot be shared", async () => {
            await api
                .post(`/api/shelf/${shelves[2]._id}/share`)
                .set(tokens[1])
                .send({
                    user: "third"
                })
                .expect(403);

            const res = api
                .get(`/api/shelf/${shelves[2]._id}`)
                .set(tokens[1])
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.sharedWith.length).toBe(1);
        });

        test("shelf cannot be unshared", () => {});

        test("shelf cannot be removed", async () => {
            await api
                .delete(`/api/shelf/${shelves[2]._id}`)
                .set(tokens[1])
                .expect(403);

            expect(await shelvesInDb()).toBe(shelvesAtStart);
        });
    });

    describe("when normal user is logged in", () => {
        test("public shelf can be received", async () => {
            const res = await api
                .get(`/api/shelf/${shelves[0]._id}`)
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.name).toBe("Public shelf");
            expect(res.body.id).toBeDefined();
            expect(res.body.sharedWith).not.toBeDefined();
            expect(res.body.author.name).toBeDefined();
        });

        test("private shelf cannot be received", async () => {
            const res = await api
                .get(`/api/shelf/${shelves[2]._id}`)
                .expect(401)
                .expect("Content-type", /application\/json/);

            expect(res.body.error).toBe("you must login first");
        });

        test("shelf cannot be shared", async () => {
            const res = await api
                .post(`/api/shelf/${shelves[0]._id}/share`)
                .send({
                    user: users[1]._username
                })
                .expect(401)
                .expect("Content-type", /application\/json/);

            expect(res.body.error).toBe("you must login first");

            // TODO: Check whether share did occur
        });

        test("shelf cannot be unshared", () => {
            
        });

        test("records cannot be added to shelf", async () => {
            const res = await api
                .post(`/api/shelf/${shelves[0]._id}/shelve`)
                .send({
                    record,
                    note: "moikku"
                })
                .expect(401)
                .expect("Content-type", /application\/json/);

            expect(res.body.error).toBe("you must login first");

            const res2 = await api
                .get(`/api/shelf/${shelves[0]._id}`)
                .expect(200);

            expect(res2.body.records.length).toBe(0);
        });

        test("record cannot be edited", async () => {
            
        });

        test("record cannot be removed", async () => {
            
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});