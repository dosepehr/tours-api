const yup = require('yup');

const forgotPasswordSchema = yup.object().shape({
    email: yup
        .string()
        .email('Please provide a valid email address.')
        .required('The email field is required.'),
});

module.exports = { forgotPasswordSchema };
