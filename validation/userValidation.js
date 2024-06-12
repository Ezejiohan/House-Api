const yup = require('yup');

const userSchema = yup.object({
    fullname: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().min(5).max(12).required(),
    username: yup.string().required()
});

module.exports = userSchema;