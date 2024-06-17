const yup = require('yup');

const adminForgotPasswordSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required')
});

module.exports = adminForgotPasswordSchema;