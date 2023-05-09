const {gql} = require("apollo-server-express")

const typeDefs = gql`
type User {
    id: Int
    username: String!
    email: String!
    password: String!
    lat: Float!
    lon: Float!
}
type Ticket {
    id: Int
    title: String!
    carMake: String!
    carModel: String!
    modelYear: Int!
    issue: String!
    winner: User
    userId: User
    lat: Float!
    lon: Float!
    bids: [Bid]
}
type Room {
    roomId: ID
    userId: User!
    mechanicId: Mechanic!
}
type Message {
    userId: User
    mechanicId: Mechanic
    roomId: Room!
    content: String!
    sentBy: String!
}
type Mechanic {
    id: Int
    username: String!
    email: String!
    password: String!
    lat: Int!
    lon: Int!
}
type Bid {
    id: Int
    amount: Int!
    content: String!
    mechanicId: Mechanic
    ticketId: Ticket
}
type Auth {
    token: ID!
    userId: User
    mechanicId: Mechanic
    userName: User
    mechanicName: Mechanic
    isMechanic: Bool!
}
type Query {
    users: [User]
    user(id: Int!): User
    tickets: [Ticket]
    ticket(id: Int!): Ticket
    ticketsNearby(lat: Int!, lon: Int, radius: Int!)
    userTickets(userId: Int!): Ticket
    mechanicRooms(mechanicId: Int!): [Room]
    userRooms(userId: Int!): [Room]
    messages(roomId: Int!): [Message]
    mechanics: [Mechanic]
    mechanic(id: Int!): Mechanic
    mechanicsBids(mechanicId: Int!): [Bids]
}
type Mutation {
    addUser(username: String!, email: String!, password: String!, lat: Float!, lon: Float!): Auth
    addTicket(title: String!, carMake: String!, carModel: String!, modelYear: Int!, issue: String!, userId: Int!, lat: Float!, lon: Float!): Ticket
    deleteTicket(id: Int!): Ticket
    updateTicket(id: Int!, winner: Int!): Ticket
    createRoom(userId: Int!, mechanicId: Int!): Room
    createMessage(roomId: Int!, content: String!): Message
    addMechanic(username: String!, email: String!, password: String!, lat: Float!, lon: Float!): Auth
    addBid(ticketId: Int!, amount: Int!, content: String!, mechanicId: Int!): Bid
    deleteBid(id: Int!): Bid
    login(email: String!, password: String!): Auth
}`

module.exports = typeDefs