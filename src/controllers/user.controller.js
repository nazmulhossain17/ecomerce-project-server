const User = require("../models/user.model");
const { findUserId } = require("../services/find-services");
const { successResponse } = require("./response.controller");
const mongoose = require('mongoose');

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
        const user = await findUserId(id, options)
        return successResponse(res,{
            statusCode: 200,
            message: 'User sucessful returned',
            payload: {user},
        });
    } catch (error) {
        
        next(error)
    }
}


module.exports = {testController, getUsers, findUserById}