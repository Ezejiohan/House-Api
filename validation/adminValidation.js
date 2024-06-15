const yup = require('yup');

const adminSchema = yup.object({
    fullname: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().min(5).max(12).required(),
    username: yup.string().required(),
    address: yup.string().required()

});

module.exports = adminSchema;