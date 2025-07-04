const express = require('express');
const app = express();
require('dotenv').config();
require('./DB/sql_conn');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//User Register routes
app.use("/api/user", require("./routes/user_register_routes"));

//Admin Role routes
app.use("/api/admin_role", require("./routes/admin_role_routes"));

//User Role Routes
app.use("/api/user_role", require("./routes/user_role_routes"));


app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});