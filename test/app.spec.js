const app = require("../src/app");
const knex = require("knex");
const helpers = require("./test-helpers");

describe("app", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get("")
      .expect(200, "Hello, world!");
  });
});
