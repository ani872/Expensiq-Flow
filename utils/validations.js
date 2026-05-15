// validations.js
const Validations = {
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    validatePassword: (password) => {
        return password && password.length >= 6;
    },
    
    validateName: (name) => {
        return name && name.trim().length >= 2;
    }
};
