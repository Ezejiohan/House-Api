const yup = require('yup');

const userForgotPasswordSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required')
});

module.exports = userForgotPasswordSchema;