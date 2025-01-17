const dashboard = require("express").Router();
const { Ticket, User, Bids, Mechanic} = require("../models/index.js");
const isAuth = require("../util/isAuth.js");

dashboard.get("/", isAuth, async (req, res) => {
    try {
        if (req.session.isMechanic) {
            const mechanicData = await Mechanic.findByPk(req.session.user_id, {
                include: { model: Bids}
            });
            const mechanic = mechanicData.get({ plain: true });
            const bids = mechanic.bids;
            var tickets = bids.map(async bid => {
                const ticketData = await Ticket.findByPk(bid.ticketId, {
                    include: {
                        model: Bids,
                        where: {mechanicId: req.session.user_id}
                    }
                });
                return ticketData.get({ plain: true });
            });
            tickets = await Promise.all(tickets);
   
            var openTickets = tickets.filter((i) => {
                return i.winner === null
            });

            var wonTickets = tickets.filter((i) => { 
                return i.winner === req.session.user_id
            });

            var lostTickets = tickets.filter((i) => {
                return i.winner !== null && i.winner !== req.session.user_id
            });
            
            return res.render("dashboard", {
                mechanic: mechanic,
                openTickets: openTickets,
                wonTickets: wonTickets,
                lostTickets: lostTickets,
                logged_in: req.session.logged_in,
                isMechanic: req.session.isMechanic
            });
        } else {
            const userData = await User.findByPk(req.session.user_id, {
                include: [{
                    model: Ticket,
                    include: [{ 
                        model: Bids,
                        include: {
                            model: Mechanic,
                            model: Ticket
                        }
                    },{ 
                        model: Mechanic,
                    }
                ]
                }]
            });
            let user = userData.get({ plain: true });
            user = await user;
            res.render("dashboard", {
                user: user,
                logged_in: req.session.logged_in,
                isMechanic: req.session.isMechanic,
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = dashboard;