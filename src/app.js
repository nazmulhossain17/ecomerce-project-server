const express = require("express");
const app = express();
const morgan = require('morgan');
const createError = require('http-errors');
const xssClean = require("xss");
const rateLimit = require('express-rate-limit');
const userRouter = require("../routers/user.router");

const rateLimiter = rateLimit({
    windowMs: 1*60*1000,
    max: 5,
    message: 'Too many requests, Please try again later'
});

app.use(morgan('dev'));
// app.use(xssClean());
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(rateLimiter)

app.use("/", userRouter)
app.get("/", (req, res)=>{
    res.send("Hello")
})



// Error-handling middleware (404 route not found)
app.use((req, res, next) => {
    next(createError(404, 'Route not found'));
});

// Error-handling middleware (other errors)
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        success: false,
        message: err.message,
    });
});

module.exports = app;