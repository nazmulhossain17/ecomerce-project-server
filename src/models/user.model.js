const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        maxlength: [31, 'User name can be maximum 25 characters'],
        minlength: [4, 'User name can be minimum 4 characters'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v){
                return  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v)
            },
            message: 'Please enter a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password length can be minimum 8 characters'],
        set: (v)=> bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    image: {
        type: String,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
    phone: {
        type: String,
        validate: {
            validator: function(v) {
              return /^\d{11}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          },
        required: [true, 'Phone number required'],
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const User = model('Users', userSchema);

module.exports = User;
