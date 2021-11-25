const mongoose = require('mongoose');
const validator = require('validator');
const ValidatePassword = require('validate-password');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./taskModel');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: 'plony',
        validate(value){
            if(value.trim().toLowerCase()==='moshe')
                throw new Error('name could not be moshe');
        }
    },
    age: {
        type: Number,
        required: true,
        min: 12
    },
    email: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('invalid email');
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            const passwordData = new ValidatePassword().checkPassword(value);
            if(!passwordData.isValid)
                throw new Error(passwordData.validationMessage);
        }
        // ,validat(value){
        //     const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/;                             // די בטוח שהחלק הזה מיותר (?=.*[a-zA-Z]).{0,}
        //     if(!passRegex.test(value))
        //         throw new Error('password must contain big and small chars and nums');
        // }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
},{
    timestamps: true
});

userSchema.pre('save', async function (next) {
    const user = this;

    if(user.isModified('password'))
        user.password = await bcrypt.hash(user.password , 8);

    next();
});

userSchema.statics.findUserByEmailAndPassword = async (email, password) => {
    const user = await User.findOne({email});

    if(!user)
        throw new Error('Unable to log in');

    const isPassMatch = await bcrypt.compare(password, user.password);

    if(!isPassMatch)
        throw new Error('Unable to log in');

    return user;
};

userSchema.methods.generateAuthToken = async function (){
    const user = this;
    const token = jwt.sign({
        _id: user._id
    },
    process.env.TOKEN_SECRET,
    {
        expiresIn: "6h"
    });
    
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
};

userSchema.methods.toJSON = function (){
    const user = this
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;

    return userObj;
};

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "user"
});

userSchema.pre('remove', async function (next){
    const user = this;

    await Task.deleteMany({user: user._id});
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;