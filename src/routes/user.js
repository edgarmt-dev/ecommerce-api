const { Router } = require("express");
const User = require("../services/user");

function user(app) {
    const router = Router()
    app.use('/api/users', router)
    const userService = new User()

    router.get('/', async(req, res) => {
        const result = await userService.getAll()
        return res.json(result)
    })


}

module.exports = user