const { User, Mechanic, Room, Message, Bids, Ticket } = require("../models/index")
const { AuthenticationError } = require("apollo-server-express")
const { signToken } = require("../util/auth")

const resolvers = {
    Query: {
        users: async () => await User.findAll(),
        
        user: async (parent, { id }) => await User.findByPk(id),
       
        tickets: async () => await Ticket.findAll(),
        
        ticket: async (parent, { id }) => await Ticket.findByPk(id),

        userTickets: async (parent, { userId }) => await Ticket.findAll({
            where: {
                userId: userId
            },
            include: {model: Bids, include: Mechanic}
        }),
        
        mechanicRooms: async (parent, { mechanicId }) => await Room.findAll({
            where: {
                mechanicId: mechanicId
            }
        }),

        userRooms: async (parent, { userId }) => await Room.findAll({
            where: {
                userId: userId
            }
        }),

        messages: async (parent, { roomId }) => await Message.findAll({
            where: {
                roomId: roomId
            }
        }),

        mechanics: async () => await Mechanic.findAll(),

        mechanic: async (parent, {id}) => await Mechanic.findByPk(id),

        mechanicBids: async (parent, { mechanicId }) => await Bids.findAll({
            where: {
                mechanicId: mechanicId
            },
            include: {model: Ticket, include: User}
        })
    },
    Mutation : {
        addUser: async (parent, {username, email, password, lat, lon}) => {
            const newUser = await User.create({
                username,
                password,
                email,
                lat,
                lon
            },{
                returning: ["id"]
            })
            const token = signToken({username: username, id: newUser.id})

            return {token, userId: newUser.id, isMechanic: false}
        },

        addTicket: async (parent, {title, carMake, carModel, modelYear, issue, userId, lat, lon}) => await Ticket.create({
            title,
            issue,
            carMake,
            carModel,
            modelYear,
            userId,
            lat,
            lon
        })
    }
}