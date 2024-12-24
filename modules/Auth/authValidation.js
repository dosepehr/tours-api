const yup = require('yup');

const forgotPasswordSchema = yup.object().shape({
    email: yup
        .string()
        .email('Please provide a valid email address.')
        .required('The email field is required.'),
});
const resetPasswordSchema = yup.object().shape({
    password: yup
        .string()
        .required('The password field is required.')
        .min(8, 'The password must be at least 8 characters long.'),

    confirmPassword: yup
        .string()
        .required('The confirm password field is required.')
        .oneOf([yup.ref('password')], 'Passwords must match.'),
});
const updatePasswordSchema = yup.object().shape({
    password: yup
        .string()
        .required('The password field is required.')
        .min(8, 'The password must be at least 8 characters long.'),

    confirmPassword: yup
        .string()
        .required('The confirm password field is required.')
        .oneOf([yup.ref('password')], 'Passwords must match.'),
    currentPassword: yup
        .string()
        .required('The current password field is required.')
        .min(8, 'The password must be at least 8 characters long.'),
});
module.exports = {
    forgotPasswordSchema,
    resetPasswordSchema,
    updatePasswordSchema,
};
