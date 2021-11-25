const User = require('../models/userModel');

exports.createUser = async (req, res) => {    
    const user = new User(req.body);    
    try{        
        const token = await user.generateAuthToken();
        await user.save();
        res.send({user, token});
    }catch(err){
        res.status(400).send({
            status: 400,
            message: err.message
        });
    };
};

exports.getUser = async (req, res) => {    
    try{        
        res.send(req.user);
    }catch(err){
        res.status(500).send(err);
    };
};

exports.editUser = async (req, res) => {    
    const allowdUpdates = ['name', 'age', 'email', 'password'];
    const _id = req.user._id;

    try{
        if(Object.getOwnPropertyNames(req.body).length > allowdUpdates.length)
            return res.status(400).send({
                status: 400,
                message: "Too many properties",
                allowdUpdates
            });

        for(let update in req.body){
            if(!allowdUpdates.includes(update)){
                return res.status(400).send({
                    status: 400,
                    message: "Update property invalid",
                    property: update
                });
            };
        };

        const user = req.user;

        for(let update in req.body){
            user[update] = req.body[update];
        };

        await user.save();

        res.send(user);
    }catch(err){
        res.status(400).send({
            status: 400,
            message: err.message
        });
    };
};

exports.deleteUser = async (req, res) => {    
    try{
        await req.user.remove();

        res.send();

    }catch(err){
        res.status(500).send(err);
    };
};

exports.login = async (req, res) => {    
    try{
        console.log(req.body['email'], req.body['password']);
        const user = await User.findUserByEmailAndPassword(req.body['email'], req.body['password']);
        console.log(user)
        const token = await user.generateAuthToken();
        console.log(2, req.body['email'], req.body['password']);
        res.send({user, token});
    }catch(err){
        res.status(400).send({
            status: 400,
            message: err.message
        });
    };
};

exports.logout = async (req, res) => {    
    try{
        req.user.tokens = req.user.tokens.filter((tokenDoc)=>tokenDoc.token !== req.token);
        await req.user.save();
        res.send();
    }catch(err){
        res.status(500).send(err);
    };
};

exports.logoutAllDevices = async (req, res) => {  
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch(err){
        res.status(500).send(err);
    };
};

exports.regenToken = async (req, res) => {  
    try{    
        const user = req.user;    
        user.tokens = user.tokens.filter((tokenDoc)=>tokenDoc.token !== req.token);
        const token = await user.generateAuthToken();
        res.send(token);
    }catch(err){
        res.status(400).send({
            status: 400,
            message: err.message
        });
    };
};