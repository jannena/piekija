const { ApolloServer, PubSub, ForbiddenError, UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require("../utils/config");

const Record = require("../models/Record");
const Shelf = require("../models/Shelf");
const User = require("../models/User");
const Item = require("../models/Item");
const Location = require("../models/Location");
const Loantype = require("../models/Loantype");

const typeDefs = require("./typeDefs");

const { validateAdvancedQuery } = require("../utils/queryValidator");
const { PERFORMANCE_LIMIT } = require("../utils/config");

const pubsub = new PubSub();



const userHasNotPermissionToModifyShelf = (shelf, user) =>
    shelf.author.toString() !== user._id.toString() && !shelf.sharedWith.some(u => u.toString() === user._id.toString());

const isSameUserLoggedIn = (user, root) => user && user._id && user._id.toString() === root._id.toString();

const ifReturnElseError = (condition, toBeReturned, name, who) => condition
    ? toBeReturned
    : (() => { throw new ForbiddenError(`${name} can be received only by ${who}`) })()

const resolvers = {
    Query: {
        record: (root, args, { staff }) => {
            return Record.findById(args.id).populate("items");
        },
        shelf: (root, args, { staff }) => {
            if (!staff) throw new ForbiddenError("staff only");
            return Shelf.findById(args.id)
        },
        user: (root, args, { staff }) => {
            if (!staff) throw new ForbiddenError("staff only");
            return User.findById(args.id)
        },
        me: (root, args, { user }) => {
            if (!user) throw new ForbiddenError("you must login first");
            return user;
        },
        search: async (root, { query, page = 0, sort = "timeAdded", filter = false }) => {
            const firstTime = process.hrtime();

            const readyQuery = validateAdvancedQuery(query);
            const searchResultsPerPage = 20;

            const found = await Record.countDocuments(readyQuery).then(number => number);

            const sortObject = (() => {
                switch (sort) {
                    case "year":
                    case "relevance":
                        return { year: -1 };
                    case "yeardesc":
                        return { year: 1 };
                    case "timeAdded":
                        return { _id: -1 };
                    case "alphapetical":
                        return { alphabetizableTitle: 1 };
                    case "alphapeticaldesc":
                        return { alphabetizableTitle: -1 };
                }
            })();

            const result = await Record
                .find(readyQuery) // , { title: 1, author: 1, contentType: 1, year: 1, previewText: 1, image: 1 }
                .sort(sortObject)
                .skip(searchResultsPerPage * page)
                .limit(searchResultsPerPage);

            let filters = null;
            if (found && filter && PERFORMANCE_LIMIT >= found) {
                const subjects = await Record.aggregate([
                    { $match: readyQuery },
                    { $unwind: "$subjects" },
                    { $sortByCount: "$subjects" },
                    { $limit: 100 }
                ]);
                const authors = await Record.aggregate([
                    { $match: readyQuery },
                    { $unwind: "$authors" },
                    { $sortByCount: "$authors" },
                    { $limit: 100 }
                ]);
                const years = await Record.aggregate([
                    { $match: readyQuery },
                    { $sortByCount: "$year" },
                    { $limit: 100 }
                ]);
                const languages = await Record.aggregate([
                    { $match: readyQuery },
                    { $unwind: "$languages" },
                    { $sortByCount: "$languages" },
                    { $limit: 100 }
                ]);

                filters = {
                    subjects,
                    authors,
                    years,
                    languages
                };
            }

            const secondTime = process.hrtime(firstTime);

            return {
                result,
                filters,
                found,
                time: (secondTime[0] * 1e9 + secondTime[1]) * 1e-6
            };
        }
    },

    Mutation: {
        login: async (root, { username, password }) => {
            try {
                const userLoggingIn = await User.findOne({ username });
                const passwordCorrect = await bcrypt.compare(password, userLoggingIn.passwordHash);

                if (!passwordCorrect) throw new AuthenticationError("wrong username or password");

                const token = jwt.sign({
                    id: userLoggingIn._id,
                    username,
                    name: userLoggingIn.name
                }, config.SECRET);

                return {
                    token,
                    me: userLoggingIn
                };
            }
            catch (err) {
                console.log(err);
            }
        },

        shelveRecord: async (root, { shelf: shelfId, record, note = "" }, { user }) => {
            if (!user) throw new ForbiddenError("you do not have permission to do that");
            if (!shelfId || !record) throw new UserInputError("shelf or record is missing");

            const shelf = await Shelf.findById(shelfId);
            if (!shelf) throw new Error("Shelf not found!");
            if (shelf.author.toString() !== user._id.toString() && !shelf.sharedWith.some(u => u.toString() === user._id.toString()))
                throw new ForbiddenError("you do not have permission to do that");
            if (shelf.records.some(r => r.record.toString() === record)) throw new Error("record has already been added to this shelf");

            await Shelf.findOneAndUpdate({
                _id: shelfId,
                "records.record": { $ne: record },
                $or: [
                    { author: user._id },
                    { sharedWith: user._id }
                ]
            }, { $push: { records: { record, note } } }, { new: true });

            const shelfRecord = {
                record,
                note: note
            }

            pubsub.publish("SHELF_MODIFICATION_" + shelfId, { shelfModification: { data: shelfRecord, type: "ADD" } });

            return shelfRecord;
        },

        unshelveRecord: async (root, { shelf: shelfId, record }, { user }) => {
            if (!user) throw new ForbiddenError("you do not have permission to do that");
            if (!shelfId || !record) throw new UserInputError("shelf or record is missing");

            const shelf = await Shelf.findById(shelfId);
            if (!shelf) throw new Error("Shelf not found!");
            if (shelf.author.toString() !== user._id.toString() && !shelf.sharedWith.some(u => u.toString() === user._id.toString()))
                throw new ForbiddenError("you do not have permission to do that");
            if (!shelf.records.some(r => r.record.toString() === record)) throw new UserInputError("shelf does not contain this record");

            await Shelf.findOneAndUpdate({
                _id: shelfId,
                $or: [
                    { author: user._id },
                    { sharedWith: user._id }
                ]
            }, { $pull: { records: { record: record } } }, { multi: true });

            const shelfRecord = {
                record,
                note: null
            };

            pubsub.publish("SHELF_MODIFICATION_" + shelfId, { shelfModification: { data: shelfRecord, type: "REMOVE" } });

            return shelfRecord;
        },

        editShelfNote: async (root, { shelf: shelfId, record, note }, { user }) => {
            if (!user) throw new ForbiddenError("you do not have permission to do that");
            if (!shelfId || !record || !note) throw new UserInputError("shelf or record or note is missing");

            const shelf = await Shelf.findById(shelfId);
            if (!shelf) throw new Error("Shelf not found!");
            if (shelf.author.toString() !== user._id.toString() && !shelf.sharedWith.some(u => u.toString() === user._id.toString()))
                throw new ForbiddenError("you do not have permission to do that");
            if (!shelf.records.some(r => r.record.toString() === record)) throw new UserInputError("shelf does not contain this record");

            await Shelf.findOneAndUpdate({
                _id: shelfId,
                "records.record": record,
                $or: [
                    { author: user._id },
                    { sharedWith: user._id }
                ]
            }, { $set: { "records.$.note": note } });

            const shelfRecord = {
                record,
                note
            };

            pubsub.publish("SHELF_MODIFICATION_" + shelfId, { shelfModification: { data: shelfRecord, type: "UPDATE" } });

            return shelfRecord;
        }
    },

    Subscription: {
        shelfModification: {
            subscribe: async (root, { shelf: shelfId }, { user }) => {
                console.log(shelfId, typeof user, user._id);
                if (!user) throw new ForbiddenError("you do not have permission to do that");
                if (!shelfId) throw new UserInputError("shelf is missing");

                const shelf = await Shelf.findById(shelfId);
                if (!shelf) throw new UserInputError("invalid shelf");

                if (userHasNotPermissionToModifyShelf(shelf, user))
                    throw new ForbiddenError("you do not have permission to do that");

                console.log(shelf);

                return pubsub.asyncIterator(["SHELF_MODIFICATION_" + shelfId]);
            }
        }
    },

    Item: {
        statePersonInCharge: (root, args, { staff }) =>
            ifReturnElseError(staff, root.statePersonInCharge
                ? User.findById(root.statePersonInCharge).populate("loans")
                : null, "statePersonInCharge", "staff"),
        stateTimesRenewed: (root, args, { user, staff }) => ifReturnElseError(
            staff || isSameUserLoggedIn(user, { _id: root.statePersonInCharge }),
            root.stateTimesRenewed,
            "stateTimesRenewed",
            "staff or user themselves"
        ),
        record: root => Record.findById(root.record),
        location: root => Location.findById(root.location),
        loantype: root => Loantype.findById(root.loantype),
        note: (root, args, { staff }) => ifReturnElseError(staff, root.note, "note", "staff")
    },

    Record: {
        items: root => Item.find({ _id: { $in: root.items } })
    },

    User: {
        tfa: (root, args, { user }) => isSameUserLoggedIn(user, root)
            ? (root.TFACode ? true : false)
            : (() => { throw new ForbiddenError("tfa can be received only by user themselves") })(),
        loans: (root, args, { user, staff }) => (staff || isSameUserLoggedIn(user, root))
            ? Item.find({ _id: { $in: root.loans } })
            : (() => { throw new ForbiddenError("loans can be received only by staff or user themselves") })(),
        shelves: (root, args, { user }) => isSameUserLoggedIn(user, root)
            ? root.shelves
            : (() => { throw new ForbiddenError("shelves can be received only by user themselves") })(),
        staff: (root, args, { user, staff }) =>
            ifReturnElseError(staff || isSameUserLoggedIn(user, root), root.staff, "staff", "staff or user themselves")
    },

    UserShelf: {
        shelf: root => Shelf.findById(root.id)
    },

    Shelf: {
        sharedWith: root => User.find({ _id: { $in: root.sharedWith } }),
        author: root => User.findById(root.author),
        // records: root => Record.find({ _id: { $in: root.records } })
    },

    ShelfRecord: {
        record: root => Record.findById(root.record)
    }
};

const authenticate = async token => {
    if (token && token.toLowerCase().startsWith("bearer ")) {
        const decodedToken = jwt.decode(token.substring(7), config.SECRET);
        const loggedInUser = await User.findById(decodedToken.id);
        return { user: loggedInUser, staff: loggedInUser.staff };
    }
    return { staff: false, user: false };
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }) => {
        if (connection) return connection.context;
        const token = req ? req.headers.authorization : null;
        return await authenticate(token);
    },
    subscriptions: {
        onConnect: async (connectionParams) => {
            console.log("connectionParams", connectionParams);
            console.log("token, subscription", connectionParams.Authorization);
            return await authenticate(connectionParams.Authorization);
        }
    }
});

module.exports = server