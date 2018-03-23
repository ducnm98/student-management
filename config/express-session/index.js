module.exports = {
    secret: "Iamabanana",  // session secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } /*Use 'true' without setting up HTTPS will result in redirect errors*/
};