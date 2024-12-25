const yup = require('yup');

const signupUserSchema = yup.object().shape({
    name: yup.string().required('The name field is required.'),

    email: yup
        .string()
        .email('Please provide a valid email address.')
        .required('The email field is required.'),

    photo: yup.string().default('pathToDefaultImage'),

    password: yup
        .string()
        .required('The password field is required.')
        .min(8, 'The password must be at least 8 characters long.'),

    confirmPassword: yup
        .string()
        .required('The confirm password field is required.')
        .oneOf([yup.ref('password')], 'Passwords must match.'),
});

const loginUserSchema = yup.object().shape({
    password: yup
        .string()
        .required('The password field is required.')
        .min(8, 'The password must be at least 8 characters long.'),
    email: yup
        .string()
        .email('Please provide a valid email address.')
        .required('The email field is required.'),
});

const editUserSchema = yup.object().shape({
    name: yup.string(),
    email: yup
        .string()
        .email('Please provide a valid email address.')
});

module.exports = { loginUserSchema, signupUserSchema, editUserSchema };
