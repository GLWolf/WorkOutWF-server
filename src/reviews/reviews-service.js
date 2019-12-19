const xss = require('xss')

const ReviewsService = {
  getById(db, id) {
    return db
      .from('day_time_user AS rev')
      .select(
        'rev.user_id',
        'rev.day_id',
        'rev.time_id',
        'rev.date_created',
        db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                usr.id,
                usr.user_name,
                usr.full_name,
                usr.nickname,
                usr.email,
                usr.date_created,
                usr.date_modified
            ) tmp)
          ) AS "user"`
        )
      )
      .leftJoin(
        'users AS usr',
        'rev.user_id',
        'usr.id',
      )
      .where('rev.id', id)
      .first()
  },

  insertReview(db, newReview) {
    return db
      .insert(newReview)
      .into('day_time_user')
      .returning('*')
      .then(([review]) => review)
      .then(review =>
        ReviewsService.getById(db, review.id)
      )
  },

  serializeReview(review) {
    return {
      id: review.id,
      rating: review.rating,
      text: xss(review.text),
      thing_id: review.thing_id,
      date_created: review.date_created,
      user: review.user || {},
    }
  },
  getByUsers(db, id) {
    return db
    .from('day_time_user')
    .where('user_id', id)
    .orderBy('day_id')
  },
  getAll(db, dayId) {
    return db
    .select('day_id','time_id','full_name','nickname','email','day_time_user.id')
    .from('day_time_user')
    .leftJoin('users', 'users.id', 'day_time_user.user_id')
    .where('day_id',dayId)
    .orderBy('day_id')
  }
}

module.exports = ReviewsService
