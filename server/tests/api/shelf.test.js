const mongoose = require("mongoose");
const app = require("../../app");
const supertest = require("supertest");

const api = supertest(app);

const Shelf = require("../../models/Shelf");
const { clearDatabase, addUserToDb, getTokenForUser, shelvesInDb, addShelfToDb, addRecordToDb, getUser, getShelf, addRecordToShelf, shareShelfWith } = require("./testutils");


let users = [];
let tokens = [];
let shelves = [];
let shelvesAtStart = 0;
let records = [];

describe("when there is users and shelves in database (shelf tests)", () => {
    beforeEach(async (done) => {
        await clearDatabase();
        users = [
            await addUserToDb("first", "salasanasalasana", false),
            await addUserToDb("second", "salasanasalasana", true),
            await addUserToDb("third", "salasanasalasana", false)
        ]
        tokens = users
            .map(u => getTokenForUser(u))
            .map(t => ({ Authorization: `Bearer ${t}` }));

        shelves = [];
        shelves[0] = await addShelfToDb("Public shelf", true, users[0], []);
        shelves[1] = await addShelfToDb("Private shelf", false, users[0], []);
        shelves[2] = await addShelfToDb("Shared private shelf", false, users[0], [users[1]]);
        shelves[3] = await addShelfToDb("Public private shelf", true, users[0], [users[1]]);
        shelvesAtStart = await shelvesInDb();
        records[0] = await addRecordToDb();
        records[1] = await addRecordToDb();

        done();
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
        expect(res.body.author.tfa).not.toBeDefined();
        expect(res.body.author.TFACode).not.toBeDefined();


        const user = await getUser(users[0]._id);
        const shelf = user.shelves[user.shelves.length - 1];
        expect(shelf.id.name).toBe("My first shelf");
        expect(shelf.id.id).toBe(res.body.id);
        expect(shelf.author).toBe(true);
    });

    test("shelf cannot be created with invalid request", async () => {
        const res = await api
            .post("/api/shelf")
            .set(tokens[0])
            .send({
                name: "My",
                public: false
            })
            .expect(400)
            .expect("Content-type", /application\/json/);

        expect(res.body.error).toBe("name must be at least three characters long");
    });

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
                    username: users[1].username
                })
                .expect(201);

            const res = await api
                .get(`/api/shelf/${shelves[1]._id}`)
                .set(tokens[0])
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.sharedWith[0].username).toBe(users[1].username);
            expect(res.body.sharedWith[0].id).toBe(users[1]._id.toString());
            expect(res.body.sharedWith[0]._id).not.toBeDefined();
            expect(res.body.sharedWith[0].__v).not.toBeDefined();
            expect(res.body.sharedWith[0].passwordHash).not.toBeDefined();
            expect(res.body.sharedWith[0].tfa).not.toBeDefined();
            expect(res.body.sharedWith[0].TFACode).not.toBeDefined();

            const shelves = (await getUser(users[1])).shelves;
            expect(shelves.length).toBe(2);
            expect(shelves[1].author).toBe(false);
            expect(shelves[1].id.id).toBe(shelves[1]._id.toString());
        });

        test("shelf cannot be shared with non-existsing user", async () => {

        });

        describe("and when shelf has been shared with someome", () => {
            beforeEach(async () => {
                await shareShelfWith(shelves[1]._id, users[1]);
                await shareShelfWith(shelves[1]._id, users[2]);
            });

            test("shelf can be unshared", async () => {
                await api
                    .delete(`/api/shelf/${shelves[1]._id}/share`)
                    .set(tokens[0])
                    .send({
                        username: "third"
                    })
                    .expect(204);

                const res = await api
                    .get(`/api/shelf/${shelves[1]._id}`)
                    .set(tokens[0])
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                expect(res.body.sharedWith.length).toBe(1);
                expect(res.body.sharedWith[0].username).toBe("second");

                const shelves = (await getUser(users[2])).shelves;
                expect(shelves.length).toBe(0);
            });
        });

        describe("and when there is records added to shelf", () => {
            beforeEach(async () => {
                await addRecordToShelf(shelves[1]._id, records[0], "Hello.");
            });

            test("records and notes can be added to shelf", async () => {
                const res1 = await api
                    .post(`/api/shelf/${shelves[1]._id}/shelve`)
                    .set(tokens[0])
                    .send({
                        record: records[1],
                        note: "In this text, I tell you why I have added this record to this shelf."
                    })
                    .expect(201)
                    .expect("Content-type", /application\/json/);

                expect(res1.body.record.id).toBe(records[1].toString());
                expect(res1.body.note).toBe("In this text, I tell you why I have added this record to this shelf.");

                const res = await api
                    .get(`/api/shelf/${shelves[1]._id}`)
                    .set(tokens[0])
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                console.log(res.body);

                expect(res.body.records.length).toBe(2);
                expect(res.body.records[0].record.id).toBe(records[0].toString());
                expect(res.body.records[0].note).toBe("Hello.");
                expect(res.body.records[1].record.title).toBe("A New Book");
                expect(res.body.records[1].note).toBe("In this text, I tell you why I have added this record to this shelf.");
            });

            test("record cannot be added if it does not exist", async () => {
                const res = await api
                    .post(`/api/shelf/${shelves[1]._id}/shelve`)
                    .set(tokens[0])
                    .send({
                        record: "5d5981d0a68cb331d841e4d5",
                        note: "asdfjkl"
                    })
                    .expect(400)
                    .expect("Content-type", /application\/json/);

                expect(res.body.error).toBe("record does not exist");
            });

            test("record cannot be added if it already has been added to the same shelf", async () => {
                const res = await api
                    .post(`/api/shelf/${shelves[1]._id}/shelve`)
                    .set(tokens[0])
                    .send({
                        record: records[0],
                        note: "asdfjkl"
                    })
                    .expect(400)
                    .expect("Content-type", /application\/json/);

                expect(res.body.error).toBe("record has already been added to this shelf");
            });

            test("records and notes can be edited", async () => {
                await addRecordToShelf(shelves[1], records[1], "Great book about WYSIWYG editors");
                await api
                    .put(`/api/shelf/${shelves[1]._id}/shelve`)
                    .set(tokens[0])
                    .send({
                        record: records[1],
                        note: "This is a new note."
                    })
                    .expect(200);

                const res = await api
                    .get(`/api/shelf/${shelves[1]._id}`)
                    .set(tokens[0])
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                expect(res.body.records.length).toBe(2);
                expect(res.body.records[0].note).toBe("Hello.");
                expect(res.body.records[0].record.id).toBe(records[0].toString());
                expect(res.body.records[1].note).toBe("This is a new note.");
                expect(res.body.records[1].record.id).toBe(records[1].toString());

                // Let's try it again:
                await api
                    .put(`/api/shelf/${shelves[1]._id}/shelve`)
                    .set(tokens[0])
                    .send({
                        record: records[0],
                        note: "I do not really like this book."
                    })
                    .expect(200);

                const res2 = await api
                    .get(`/api/shelf/${shelves[1]._id}`)
                    .set(tokens[0])
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                expect(res2.body.records.length).toBe(2);
                expect(res2.body.records[0].note).toBe("I do not really like this book.");
                expect(res2.body.records[0].record.id).toBe(records[0].toString());
                expect(res2.body.records[1].note).toBe("This is a new note.");
                expect(res2.body.records[1].record.id).toBe(records[1].toString());
            });

            test("records and notes can be removed", async () => {
                await addRecordToShelf(shelves[1], records[1], "Great book about WYSIWYG editors");
                await api
                    .delete(`/api/shelf/${shelves[1]._id}/shelve`)
                    .set(tokens[0])
                    .send({
                        record: records[0]
                    })
                    .expect(204);

                const res = await api
                    .get(`/api/shelf/${shelves[1]._id}`)
                    .set(tokens[0])
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                expect(res.body.records.length).toBe(1);
                expect(res.body.records[0].note).toBe("Great book about WYSIWYG editors");
                expect(res.body.records[0].record.id).toBe(records[1].toString());

                // Let's try it again:
                await api
                    .delete(`/api/shelf/${shelves[1]._id}/shelve`)
                    .set(tokens[0])
                    .send({
                        record: records[1]
                    })
                    .expect(204);

                const res2 = await api
                    .get(`/api/shelf/${shelves[1]._id}`)
                    .set(tokens[0])
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                expect(res2.body.records.length).toBe(0);
            });
        });



        test("shelf can be removed", async () => {
            await api
                .delete(`/api/shelf/${shelves[1]._id}`)
                .set(tokens[0])
                .expect(204);

            expect(await shelvesInDb()).toBe(shelvesAtStart - 1);

            // TODO: Is shelves removed from documents of owner and contributor?
        });
    });











    describe("when user that the shelf has been shared with is logged in", () => {
        test("unshared private shelf cannot be received", async () => {
            console.log(shelves[0], shelves[1]);
            const res = await api
                .get(`/api/shelf/${shelves[1]._id}`)
                .set(tokens[1])
                .expect(404);

            expect(res.body.id).not.toBeDefined();
            expect(res.body.name).not.toBeDefined();
        });

        test("shared private shelf can be received", async () => {
            const res = await api
                .get(`/api/shelf/${shelves[2]._id}`)
                .set(tokens[1])
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect(res.body.name).toBe("Shared private shelf");
            expect(res.body.records).toBeDefined();
        });

        describe("and when there is records in shared shelf", () => {
            beforeEach(async () => { });

            test("records can be added to shelf", async () => {
                const res = await api
                    .post(`/api/shelf/${shelves[2]._id}/shelve`)
                    .set(tokens[1])
                    .send({
                        record: records[1],
                        note: "moikku"
                    })
                    .expect(201)
                    .expect("Content-type", /application\/json/);

                expect(res.body.record).toBe(records[1].toString());
                expect(res.body.note).toBe("moikku");

                const res2 = await api
                    .get(`/api/shelf/${shelves[2]._id}`)
                    .set(tokens[1])
                    .expect(200)
                    .expect("Content-type", /application\/json/);

                expect(res2.body.records[0].note).toBe("moikku");
                expect(res2.body.records[0].record.id).toBe(records[1].toString());
                expect(res2.body.records[0].record.title).toBe("A New Book");
            });

            test("records can be edited", () => {
                // TODO: Do the test
                expect(1).toBe(1);
            });

            test("records can be removed", () => {
                // TODO: Do the test
                expect(1).toBe(1);
            });
        });

        describe("when there is records in not-shared public shelf", () => {
            beforeEach(async () => {});

            test("records cannot be added to unshared shelf", () => {
                // TODO: Do the test
                expect(1).toBe(1);
            });

            test("records cannot be removed from unshared shelf", () => {
                // TODO: Do the test
            });

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
                    username: "third"
                })
                .expect(403);

            const res = await api
                .get(`/api/shelf/${shelves[2]._id}`)
                .set(tokens[1])
                .expect(200)
                .expect("Content-type", /application\/json/);

            expect((await Shelf.findById(res.body.id)).sharedWith.length).toBe(1);
        });

        describe("and when shelf is shared with someone else", () => {
            beforeEach(async () => {

            });

            test("shelf cannot be unshared", () => { });

        });

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
                .set(tokens[2])
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
                .set(tokens[2])
                .expect(404);

            expect(res.body.id).not.toBeDefined();
            expect(res.body.name).not.toBeDefined();
        });

        test("shelf cannot be shared", async () => {
            await api
                .post(`/api/shelf/${shelves[0]._id}/share`)
                .set(tokens[2])
                .send({
                    username: users[1].username
                })
                .expect(403)
                .expect("Content-type", /application\/json/);

            const sharedWith = (await getShelf(shelves[0]._id)).sharedWith;
            expect(sharedWith.length).toBe(0);
        });

        describe("and when shelf is shared with somebody", () => {
            beforeEach(async () => {
                await shareShelfWith(shelves[0]._id, users[2]);
            });

            test("shelf cannot be unshared", async () => {
                await api
                    .delete(`/api/shelf/${shelves[0]._id}/share`)
                    .set(tokens[2])
                    .send({
                        username: "second"
                    })
                    .expect(403);

                const shelf = (await getShelf(shelves[3]._id)).sharedWith;
                expect(shelf.length).toBe(1);
                expect(shelf[0].username).toBe("third");
            });
        });

        describe("and when there are records in the shelf", () => {
            beforeEach(async () => {
                await addRecordToShelf(shelves[3]._id, records[0], "Hello world!");
            });

            test("records cannot be added to shelf", async () => {
                const res = await api
                    .post(`/api/shelf/${shelves[3]._id}/shelve`)
                    .set(tokens[2])
                    .send({
                        record: records[1],
                        note: "moikku"
                    })
                    .expect(403)
                    .expect("Content-type", /application\/json/);

                expect(res.body.error).toBe("you do not have permission to do that");

                const shelf = (await getShelf(shelves[3]._id)).records;
                expect(shelf.length).toBe(1);
                expect(shelf[0].record._id.toString()).toBe(records[0].toString());
            });

            test("record cannot be edited", async () => {
                await api
                    .put(`/api/shelf/${shelves[3]._id}/shelve`)
                    .set(tokens[2])
                    .send({
                        record: records[0],
                        note: "iiiiiiiik"
                    })
                    .expect(403);

                const shelf = (await getShelf(shelves[3]._id)).records;
                expect(shelf.length).toBe(1);
                expect(shelf[0].note).toBe("Hello world!");
                expect(shelf[0].record._id.toString()).toBe(records[0].toString());
            });

            test("record cannot be removed", async () => {
                await api
                    .delete(`/api/shelf/${shelves[3]._id}/shelve`)
                    .set(tokens[2])
                    .send({
                        record: records[0]
                    })
                    .expect(403);


                const shelf = (await getShelf(shelves[3]._id)).records;
                expect(shelf.length).toBe(1);
                expect(shelf[0].record._id.toString()).toBe(records[0].toString());
            });
        });

        test("shelf cannot be edited", async () => {
            // TODO: do the test
        });

        test("shelf cannot be removed", async () => {
            await api
                .delete(`/api/shelf/${shelves[2]._id}`)
                .set(tokens[2])
                .expect(403);

            expect(await shelvesInDb()).toBe(shelvesAtStart);
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});