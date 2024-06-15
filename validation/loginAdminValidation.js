const yup = require('yup');

const loginAdminSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(5).max(12).required('Password is required')
});

module.exports = loginAdminSchema;