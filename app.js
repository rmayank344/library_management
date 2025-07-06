const express = require('express');
const app = express();
require('dotenv').config();
require('./DB/sql_conn');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add Health Check Route for Default Target Group (/)
app.get('/', (req, res) => {
  res.status(200).send('Default Route Healthy');
});

// Add Health Check Route for Target Group admin-role (/api/admin_role/health)
app.get('/api/admin_role/health', (req, res) => {
  res.status(200).send('Admin Role Service Healthy');
});

// Add Health Check Route for Target Group user-role (/api/user_role/health)
app.get('/api/user_role/health', (req, res) => {
  res.status(200).send('User Role Service Healthy');
});


//User Register routes
app.use("/api/user", require("./routes/user_register_routes"));

//Admin Role routes
app.use("/api/admin_role", require("./routes/admin_role_routes"));

//User Role Routes
app.use("/api/user_role", require("./routes/user_role_routes"));


app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});