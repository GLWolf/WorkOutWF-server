const express = require('express')
const path = require('path')
const ReviewsService = require('./reviews-service')
const {
  requireAuth
} = require('../middleware/jwt-auth')

const reviewsRouter = express.Router()
const jsonBodyParser = express.json()

reviewsRouter
  .route('/')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const {
      day_id,
      time_id
    } = req.body
    const newReview = {
      day_id,
      time_id
    }

    newReview.user_id = req.user.id

    for (const [key, value] of Object.entries(newReview))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    ReviewsService.insertReview(
        req.app.get('db'),
        newReview
      )
      .then(review => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${review.id}`))
          .json(ReviewsService.serializeReview(review))
      })
      .catch(next)
  })
  .get(requireAuth,(req,res) =>{
    ReviewsService.getByUsers(
      req.app.get('db'),
      req.user.id
    )
    .then (data => {
      res.json(data)
    })
  })

  reviewsRouter
  .route('/search/:day_id')
  .get(requireAuth,(req,res) =>{
    console.log(req.day_id)
    ReviewsService.getAll(
      req.app.get('db'),
      req.params.day_id
    )
    .then (data => {
      res.json(data)
    })
  })

module.exports = reviewsRouter 