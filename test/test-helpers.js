const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      full_name: 'Test user 1',
      nickname: 'TU1',
      password: "password",
      email: "demoUser@gmail.com"
    },
    {
      id: 2,
      user_name: "test-user-2",
      full_name: 'Test user 2',
      nickname: 'TU2',
      password: "password",
      email: "demoUser2@gmail.com"
    },
    {
      id: 3,
      user_name: "test-user-3",
      full_name: 'Test user 3',
      nickname: 'TU3',
      password: "password",
      email: "demoUser3@gmail.com"
    },
    {
      id: 4,
      user_name: "test-user-4",
      full_name: 'Test user 4',
      nickname: 'TU4',
      password: "password",
      email: "demoUser4@gmail.com"
    }
  ];
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(
        `TRUNCATE
        day_time_user,
        users
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE day_time_user_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('day_time_user_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`)
        ])
      )
  );
}




function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256"
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeAuthHeader,
  cleanTables,
  seedUsers
};
