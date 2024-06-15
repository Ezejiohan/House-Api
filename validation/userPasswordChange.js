const yup = require('yup');

const userPasswordChangeSchema = yup.object().shape({
    oldPassword: yup.string().required('Old password is required'),
    newPassword: yup.string().required('New password is required').min(8, 'New password must be at least 8 characters long')
});

module.exports = userPasswordChangeSchema;