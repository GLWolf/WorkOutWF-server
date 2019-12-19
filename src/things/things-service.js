const xss = require('xss')
const Treeize = require('treeize')

const ThingsService = {
  getAllThings(db) {
    return db
      .from('day_time_user AS wo')
      .select(
        'wo.id',
        'wo.day_id',
        'wo.time_id',
        'wo.date_created',
        'wo.date_modified',
        ...userFields,
        db.raw(
          `count(DISTINCT rev) AS number_of_reviews`
        ),
        db.raw(
          `AVG(rev.rating) AS average_review_rating`
        ),
      )
      .leftJoin(
        'users AS usr',
        'wo.user_id',
        'usr.id',
      )
      .groupBy('wo.id', 'usr.id')
  },

  getById(db, id) {
    return ThingsService.getAllThings(db)
      .where('wo.id', id)
      .first()
  },

  serializeThings(things) {
    return things.map(this.serializeThing)
  },

  serializeThing(thing) {
    const thingTree = new Treeize()

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const thingData = thingTree.grow([ thing ]).getData()[0]

    return {
      id: thingData.id,
      title: xss(thingData.title),
      content: xss(thingData.content),
      date_created: thingData.date_created,
      image: thingData.image,
      user: thingData.user || {},
    }
  },
}

const userFields = [
  'usr.id AS user:id',
  'usr.user_name AS user:user_name',
  'usr.full_name AS user:full_name',
  'usr.nickname AS user:nickname',
  'usr.email AS user:email',
  'usr.date_created AS user:date_created',
  'usr.date_modified AS user:date_modified',
]

module.exports = ThingsService
