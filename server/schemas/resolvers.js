const { User, Mechanic, Room, Message, Bids, Ticket } = require("../models/index")
const { AuthenticationError } = require("apollo-server-express")
const { signToken } = require("../util/auth")

const resolvers = {
    Query: {
        users: async () => await User.findAll(),
        
        user: async (parent, { id }) => await User.findByPk(id),
       
        tickets: async () => await Ticket.findAll(),
        
        ticket: async (parent, { id }) => await Ticket.findByPk(id),

        ticketsNearby: async (parent, {lat, lon, radius}) => {
            const radius = req.query.radius * 1609
            
            const ticketData = await Ticket.findAll({
                include: {model: User}
            });
            const ticket = ticketData.map(ticket => ticket.get({ plain: true }))
            const filteredTickets = ticket.filter(ticket => {
                
                var distance = geolib.getDistance(
                    {latitude: ticket.lat, longitude: ticket.lon},
                    {latitude: lat, longitude: long}
                )
                return  distance <= radius
              });
            
              return filteredTickets
            },

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
            const user = newUser.get({plain: true})

            const token = signToken({username: username, id: user.id})

            return {token, userId: user.id, isMechanic: false}
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
        }),

        deleteTicket: async (parent, { id }) => await Ticket.destroy({ where: { id: id }}),

        updateTicket: async (parent, { id, winner}) => await Ticket.update({winner: winner}, {where: {id: id}}),

        createRoom: async (parent, {userId, mechanicId}) => await Room.create({userId: userId, mechanicId, mechanicId}),

        addMechanic: async (parent, {username, email, password, lat, lon}) => {
            const newMechanic = await Mechanic.create({username, email, password, lat, lon}, {returning: ['id']})

            const mechanic = newMechanic.get({plain: true})
            const token = signToken({mechanicName: username, id: mechanic.id })

            return {token, }
        },

        addBid: async (parent, {ticketId, amount, content, mechanicId}) => await Bids.create({ ticketId, amount, content, mechanicId}),

        deleteBid: async (parent, { id }) => Bids.destroy({where: {id: id}})
        
    }
}