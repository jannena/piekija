const mongoose = require("mongoose");
const app = require("../../app");
const supertest = require("supertest");

const [test, afterAll] = [it, after];
const expect = require("expect");

const api = supertest(app);
const { notesInDb, addNoteToDb, clearDatabase, addUserToDb, getTokenForUser } = require("./testutils");

let users = [];
let tokens = [];
let notesAtStart = 0;
let note = null;

describe("when there are users in database", () => {
    beforeEach(async () => {
        await clearDatabase();

        users = [
            await addUserToDb("admin", "password", true),
            await addUserToDb("kissa", "kissakissa", false)
        ];
        tokens = users
            .map(u => getTokenForUser(u))
            .map(t => ({ Authorization: `Bearer ${t}` }));

        note = await addNoteToDb();
        notesAtStart = await notesInDb();
    });

    describe("when staff user is logged in", () => {
        test("note can be created", async () => {
            const res = await api
                .post("/api/note")
                .set(tokens[0])
                .send({
                    title: "This is a new note",
                    content: "My newest book 'The Perks of Being a John Doe' will be published soon!"
                })
                .expect(201)
                .expect("Content-Type", /application\/json/);

            expect(res.body._id).not.toBeDefined();
            expect(res.body.__v).not.toBeDefined();
            expect(res.body.id).toBeDefined();
            expect(res.body.title).toBeDefined();
            expect(res.body.content).toBeDefined();

            expect(await notesInDb()).toBe(notesAtStart + 1);
        });

        test("note can be updated", async () => {
            const res = await api
                .put(`/api/note/${note._id}`)
                .set(tokens[0])
                .send({
                    title: "This is a new note",
                    content: "My newest book 'The Perks of Being a John Doe' will be published soon!"
                })
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(res.body.title).toBe("This is a new note");
            expect(res.body.content).toBe("My newest book 'The Perks of Being a John Doe' will be published soon!");
            expect(res.body.created.toString()).not.toBe(res.body.modified.toString());
        });

        test("note can be removed", async () => {
            await api
                .delete(`/api/note/${note._id}`)
                .set(tokens[0])
                .expect(204);

            expect(await notesInDb()).toBe(notesAtStart - 1);
        });
    });

    describe("when staff user is not logged in", () => {
        test("last 5 notes can be received", async () => {
            await addNoteToDb();
            await addNoteToDb();
            await addNoteToDb();
            await addNoteToDb();
            await addNoteToDb();
            await addNoteToDb();
            await addNoteToDb();

            const res = await api
                .get("/api/note/last")
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(res.body.length).toBe(5);
            expect(res.body[0].__v).not.toBeDefined();
            expect(res.body[0]._id).not.toBeDefined();
            expect(res.body[0].id).toBeDefined();
        });

        test("all notes cannot be received", async () => {
            await api
                .get("/api/note")
                .expect(401);
            await api
                .get("/api/note")
                .set(tokens[1])
                .expect(403);
        });

        test("note cannot be created", async () => {
            await api
                .post("/api/note")
                .set(tokens[1])
                .send({
                    title: "This is a new note",
                    content: "My newest book 'The Perks of Being a John Doe' will be published soon!"
                })
                .expect(403);

            await api
                .post("/api/note")
                .send({
                    title: "This is a new note",
                    content: "My newest book 'The Perks of Being a John Doe' will be published soon!"
                })
                .expect(401);

            expect(await notesInDb()).toBe(notesAtStart);
        });

        test("note cannot be updated", async () => {
            await api
                .put(`/api/note/${note._id}`)
                .set(tokens[1])
                .send({
                    title: "This is a new note",
                    content: "My newest book 'The Perks of Being a John Doe' will be published soon!"
                })
                .expect(403);

            await api
                .put(`/api/note/${note._id}`)
                .send({
                    title: "This is a new note",
                    content: "My newest book 'The Perks of Being a John Doe' will be published soon!"
                })
                .expect(401);
        });

        test("note cannot be removed", async () => {
            await api
                .delete(`/api/note/${note._id}`)
                .set(tokens[1])
                .expect(403);

            await api
                .delete(`/api/note/${note._id}`)
                .expect(401);

            expect(await notesInDb()).toBe(notesAtStart);
        });
    });
});

afterAll(async () => {
    mongoose.connection.close();
});