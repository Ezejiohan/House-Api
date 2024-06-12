const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { route } = require('./route/admins');
const { House } = require('./route/houses');
const { userRoute } = require('./route/users');
const app = express();
require('./database/database');

const validation = require("./middleware/validationMiddleware");
const userSchema = require("./validation/userValidation");

const PORT = 7000;
app.use(express.json());
app.use('/', route);
app.use('/', House);
app.use('/', userRoute);

app.post("/user", validation(userSchema), (req, res) => {
    res.status(200).send(req.body)
});


app.listen(process.env.PORT, () => {
    console.log('app listening on PORT ' + process.env.PORT)
});
