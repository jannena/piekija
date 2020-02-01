const { ApolloServer } = require("apollo-server");

const Record = require("../models/Record");
const Shelf = require("../models/Shelf");
const User = require("../models/User");
const Item = require("../models/Item");
const Location = require("../models/Location");
const Loantype = require("../models/Loantype");

const typeDefs = require("./typeDefs");

const resolvers = {
    Query: {
        record: (root, args) => Record.findById(args.id).populate("items"),
        shelf: (root, args) => Shelf.findById(args.id),
        user: (root, args) => User.findById(args.id)
    },

    Mutation: {
        login: (root, args) => {

        }
    },

    Item: {
        statePersonInCharge: root => root.statePersonInCharge
            ? User.findById(root.statePersonInCharge).populate("loans")
            : null,
        record: root => Record.findById(root.record),
        location: root => Location.findById(root.location),
        loantype: root => Loantype.findById(root.loantype)
    },

    Record: {
        items: root => Item.find({ _id: { $in: root.items } })
    },

    User: {
        tfa: root => root.TFACode ? true : false,
        loans: root => Item.find({ _id: { $in: root.loans } })
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

const server = new ApolloServer({
    typeDefs,
    resolvers
});

module.exports = server;