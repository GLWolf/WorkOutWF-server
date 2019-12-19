const express = require('express')
const path = require('path')
const UsersService = require('./users-service.js')
const { requireAuth } = require('../middleware/jwt-auth')
const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, full_name, nickname, email, } = req.body

    for (const field of ['full_name', 'user_name', 'password', 'email'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword,
              full_name,
              nickname,
              email,
              
              date_created: 'now()',
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })
  .get('/',requireAuth,(req,res) =>{
    res.json({
      user_name: req.user.user_name,
      full_name:req.user.full_name,
      nickname:req.user.nickname,
      email: req.user.email,
    })
  })

module.exports = usersRouter