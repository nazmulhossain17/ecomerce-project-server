const User = require("../models/user.model");
const fs = require("fs")
const { findUserId } = require("../services/find-services");
const { successResponse } = require("./response.controller");
const mongoose = require('mongoose');
const createError = require("http-errors");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtKey, clientURL } = require("../config/secret");

const testController = (req, res)=>{
    res.status(200).send({
        message: 'working fine'
    })
}

const getUsers = async(req, res, next)=>{
    try {
        const search = req.query.search || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const searchRegEx = new RegExp('.*' + search + '.*', 'i');
        const filter = {
            isAdmin: false,
            $or: [
                { name: { $regex: searchRegEx } },
                { email: { $regex: searchRegEx } },
                { phone: { $regex: searchRegEx } },
            ]
        };
        const options = {password: 0}

        const users = await User.find(filter, options)
            .skip((page - 1) * limit)
            .limit(limit);
        const count = await User.find(filter).countDocuments();
        if(!users){
            throw new Error(404, 'no user found')
        }

        return successResponse(res,{
            statusCode: 200,
            message: 'User sucessful returned',
            payload: {
                users,
                pagination: {
                totalPages: Math.ceil(count / limit),
                currentPAge: page,
                previousPage: page - 1 > 0 ? page -1: null,
                nextPage: page + 1 < Math.ceil(count / limit) ? page + 1: null,
            }
            }
        })
    } catch (error) {
        next(error)
    }
}

const findUserById = async(req, res, next) =>{
    try {
        const id = req.params.id; 
        const options = {password: 0}
        const user = await findUserId(User, id, options)
        return successResponse(res,{
            statusCode: 200,
            message: 'User sucessful returned',
            payload: {user},
        });
    } catch (error) {
        
        next(error)
    }
}

const deleteUser = async(req, res, next) =>{
    try {
        const id = req.params.id; 
        const options = {password: 0}
        const user = await findUserId(User, id, options)
        
        const userImagePath = user.image;
        if (userImagePath) {
            fs.access(userImagePath, (err) => {
                if (err) {
                    console.log('user image not found');
                } else {
                    fs.unlink(userImagePath, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log('user image deleted!');
                    });
                }
            });
        }
        await User.findByIdAndDelete({_id: id, isAdmin: false})

        return successResponse(res,{
            statusCode: 200,
            message: 'User deleted sucessful',
        });
    } catch (error) {
        
        next(error)
    }
}

const processRegister = async(req, res, next) =>{
    try {
        const {name, email, password, phone, address} = req.body;
        const userExists = await User.exists({email: email});
        if(userExists){
            throw createError(409, 'User email already exists')
        }
        const emailData = {
            email,
            subject: 'Active Your Account',
            html: `
                <h2>Hello ${name}!!</h2> 
                <p>Click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank">activate your account</a></p> 
            `
        }
        const token = createJSONWebToken({name, email, password, phone, address}, jwtKey, '10m')
        
        return successResponse(res,{
            statusCode: 200,
            message: 'User created sucessful',
            payload: {token}
        }); 
    } catch (error) {
        
        next(error)
    }
}


module.exports = {processRegister, testController, getUsers, findUserById, deleteUser}