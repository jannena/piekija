const { gql } = require("apollo-server");

const typeDefs = gql`
    scalar Date
    scalar JSON

    type Query {
        user(id: ID!): User!
        shelf(id: ID!): Shelf!
        record(id: ID!): Record!
        me: User!
        search(
            query: JSON!,
            page: Int,
            sort: String,
            filter: Boolean
        ): SearchResult!
    }

    type Mutation {
        login(
            username: String!
            password: String!
        ): Token!
        shelveRecord(shelf: String!, record: String!, note: String): ShelfRecord
        unshelveRecord(shelf: String!, record: String!): ShelfRecord
        editShelfNote(shelf: String!, record: String!, note: String!): ShelfRecord
    }

    type Subscription {
        shelfModification(shelf: String!): ShelfModification
    }

    type ShelfModification {
        type: String!
        data: ShelfRecord!
    }

    type Token {
        token: String!
        me: User!
    }

    type SearchResult {
        result: [Record!]!
        time: Float!
        filters: JSON
        found: Int!
    }

    type UserShelf {
        shelf: Shelf
        author: Boolean!
    }

    type ShelfRecord {
        record: Record!
        note: String
    }

    type User {
        id: ID!
        tfa: Boolean!
        name: String!
        username: String!
        staff: Boolean!
        barcode: String!
        loans: [Item!]!
        shelves: [UserShelf!]!
    }

    type Record {
        id: ID!
        ai: Int!
        timeAdded: Date!
        timeModified: Date!
        title: String!
        author: String!
        authors: [String!]!

        language: [String!]!
        languages: [String!]!
        subjects: [String!]!
        series: [String!]!
        classification: [String!]!
        standardCodes: [String!]!

        contentType: String!
        year: Int!
        country: String

        description: String
        image: String!
        

        previewText: [String]

        recordType: String!
        record: String!
        items: [Item!]!
    }

    type Item {
        id: ID!
        created: Date
        barcode: String!
        record: Record!
        location: Location!
        shelfLocation: String!
        loantype: Loantype!
        note: String
        state: String!

        statePersonInCharge: User
        stateDueDate: Date
        stateTimesRenewed: Int
        lastLoaned: Date!
        loanTimes: Int!
    }

    type Location {
        id: ID!
        name: String!
        totalLoanCount: Int!
    }

    type Loantype {
        id: ID!
        name: String!
        canBePlacedAHold: Boolean!,
        canBeLoaned: Boolean!
        renewTimes: Int!
        loanTime: Int!
    }

    type Shelf {
        id: ID!
        name: String!
        description: String!
        author: User!
        sharedWith: [User!]!
        public: Boolean!
        records: [ShelfRecord!]!
    }
`;

module.exports = typeDefs;