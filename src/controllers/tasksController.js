const Task = require('../models/taskModel');

exports.createTask = async (req, res) => {    
    const task = new Task({
        ...req.body,
        user: req.user._id
    });

    try{
        await task.save();
        //return task;
        res.send(task);
    }catch(err){
        res.status(400).send(err);
    };
};

exports.getTask = async (req, res) => {    
    const _id = req.body.id;

    try{
        const task = await Task.findOne({_id, user: req.user._id});

        if(!task)
            return res.status(404).send({
                status: 404,
                message: "Task not found"
            });
        
        res.send(task);
    }catch(err){
        res.status(500).send(err);
    };
};

exports.deleteTask = async (req, res) => {    
    const _id = req.query.id;

    try{
        const task = await Task.findOneAndDelete({_id, user: req.user._id});

        if(!task)
            return res.status(404).send({
                status: 404,
                message: "Task not found"
                        });
        
        res.send();

    }catch(err){
        res.status(500).send(err);
    };
};

exports.EditTask = async (req, res) => {    
    const allowdUpdates = ['description', 'completed'];    

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
            }
        }

        const _id = req.query.id;
        const task = await Task.findOneAndUpdate(
            {_id, user: req.user._id}, 
            req.body, 
            {new:true, runValidators:true}
            );

        await task.save();

        res.send(task);
    }catch(err){
        res.status(400).send({
            status: 400,
            message: err.message
        });
    };
};

exports.getAllTasks = async (req, res) => {    
    const match = {};
    const options = {};
    
    if(req.query.completed)
        match.completed = req.query.completed === "true";  
        
    if(req.query.limit)
        options.limit = parseInt(req.query.limit);

    if(req.query.skip)
        options.skip = parseInt(req.query.skip);

    if(req.query.sortDate){
        options.sort = {};
        options.sort.createdAt = req.query.sortDate === 'desc' ? -1 : 1; ///asc
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options
        }).execPopulate();

        if(req.user.tasks.length<1)
            return res.status(404).send({
                status: 404,
                message: "No tasks found"
            });
        
        res.send(req.user.tasks);
    }catch(err){
        res.status(500).send(err);
    };
};