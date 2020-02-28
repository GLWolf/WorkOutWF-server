process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'

require('dotenv').config()

// process.env.DB_URL = process.env.DB_URL
  // || 'postgresql://users:1234@localhost/WorkOutWF'

const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest
