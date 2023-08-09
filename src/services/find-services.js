const mongoose = require("mongoose");
const User = require("../models/user.model");
const createError = require('http-errors');

const findUserId = async(id, options={})=>{
    try {
    const options = {password: 0};
    const item = await User.findById(id, options)
        if(!item){
            throw createError(404, 'User does not exists')
        }
        return item;
    } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(404, 'Invalid User')
            return;
        }
        throw error;
    }
}

module.exports = {findUserId}