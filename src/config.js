module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://users:1234@localhost/WorkOutWF',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3600s',
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:3000/api"
};
