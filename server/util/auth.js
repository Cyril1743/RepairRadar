const jwt = require("jsonwebtoken")

const secret = process.env.JTW_SECRET
const expiration = "2h"

module.exports = {
    authMiddleware: function ({ req }) {
        let token = req.body.token || req.query.token || req.headers.authorization

        if (req.headers.authorization) {
            token = token.split(" ").pop().trim()
        }

        if (!token) {
            return req
        }

        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration })
            req.user = data
        } catch {
            console.log('Invalid token')
        }

        return req
    },
    signToken: function ({ username, mechanicName, id }) {
        if (username) {
            const payload = { username, isMechanic: false, id }
            return jwt.sign({ data: payload }, secret, { expiresIn: expiration })
        } else {
            const payload = { mechanicName, isMechanic: true, id}
            return jwt.sign({data: payload}, secret, {expiresIn: expiration})
        }
    }
}