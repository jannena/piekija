## User
- name: String
- username: String
- passwordHash: String
- card: String
- loans: {
    item: Item
    dueDate: Date
}[]

## Shelf
- author: User
- sharedWith: User[]
- public: Boolean
- books: {
    book: Book,
    note: String
}[]

## Record
- timeAdded: Date
- timeModified: Date
- title: String
- description: String
- image: String (url of the image)
- ISBN: String
- type: String
- year: String
- classification: String
- locations: String[]
- persons: String[]
- authors: String[]
- genres: String[]
- subjects: String[]
- languages: String[]
- links: String[]
- type: String (marc21 / custom)
- record: String

## Item
- id: String
- record: Record
- location: Location
- loanType: LoanType
- state: String (ei käytettävissä / hankinnassa / lainassa / käytettävissä / rikki / ...)
- stateInfo: {
    personInCharge: User (loaner, breaker, ...)
    dueDate: Date
}

## Location
- name: String

## LoanType
- name: String
- canPlaceAHold: Boolean
- canBeLoaned: Boolean
- canBeRenewed: Boolean
- renewTimes: Int
- loanTime: Int