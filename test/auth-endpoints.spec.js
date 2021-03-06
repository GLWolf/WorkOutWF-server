const app = require("../src/app");
const knex = require("knex");
const helpers = require("./test-helpers");


describe("Auth Endpoints", () => {
  let db

  const testUsers = helpers.makeUsersArray
  const testUser = testUsers[0]
  console.log('TESTusers, from auth-endpoint', testUsers)
  console.log('TEST, from auth-endpoint', testUser)
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db))

  describe(`POST /api/auth/login`, () => {
    beforeEach("insert users", () =>
      helpers.seedUsers(
        db,
        testUsers
      )
    )
    const requiredFields = ['user_name', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        user_name: testUsers.user_name,
        password: testUsers.password,
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
    it(`responds 400 'invalid user_name or password' when bad user_name`, () => {
      const userInvalidUser = {
        user_name: 'user-doesnt',
        password: 'exist'
      }
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidUser)
        .expect(400, {
          error: `Incorrect user_name or password`
        })
    })
    it(`responds 400 'invalid username or password' when bad password`, () => {
      const userInvalidPass = {
        username: testUser.username,
        password: 'incorrect'
      }
      return supertest(app)
        .post('/api/auth/token')
        .send(userInvalidPass)
        .expect(400, {
          error: `Incorrect username or password`
        })
    })

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        username: testUser.username,
        password: testUser.password,
      }
      const expectedToken = jwt.sign({
          user_id: testUser.id,
          name: testUser.name
        },
        process.env.JWT_SECRET, {
          subject: testUser.user_name,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: 'HS256',
        }
      )
      return supertest(app)
        .post('/api/auth/token')
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
        })
    })
  })
  describe(`PATCH /api/auth/token`, () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers,
      )
    )

    it(`responds 200 and JWT auth token using secret`, () => {
      const expectedToken = jwt.sign({
          user_id: testUser.id,
          name: testUser.name
        },
        process.env.JWT_SECRET, {
          subject: testUser.user_name,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: 'HS256',
        }
      )
      return supertest(app)
        .put('/api/auth/token')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200, {
          authToken: expectedToken,
        })
    })
  })
})