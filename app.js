const express = require('express');
const app = express();
const port = 3000;
const task = require('./task.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server  listening on ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

//get all tasks
app.get('/tasks',(req, res)=>{
    if(task?.tasks){
        res.json(task.tasks);
    }
    else{
        res.json({})
    }
   
})

// get task related to id
app.get('/tasks/:id', (req,res)=>{
    let id = req.params.id
    let info = task.tasks.filter(task => task.id == id)
    if (info){
        res.json(info)
    }
    else{
        res.status(404).json({"message":"unable to find the id"})
    }
    
})


// create a task
app.post('/tasks', (req,res)=>{
    const maxId = Math.max(...task.tasks.map(task => task.id));
    let body = {
        id: maxId + 1,
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed || false
    };
    if(req.body.title && req.body.description){
        task.tasks.push(body);
        res.status(201).json(body);
    }
    else{
        res.status(400).json({"message":"invalid data"})
    }
})

//delete a task
app.delete('/tasks/:id', (req,res)=>{
    let id = req.params.id;
    if(task.tasks[id]){
        let info = task.tasks.find(task => task.id == id)
        delete task.tasks[id];
        res.status(200).json(info)
    }
    else{
        res.status(404).json({"Error": "item not found"});
    }
})

// update a task
app.put('/tasks/:id', (req,res)=>{
    let id = req.params.id
    if(task.tasks[id]){
        let info = task.tasks.filter(task => task.id == id)
        task.tasks[id] = req.body
        res.json(info)
    }
    else{
        res.status(404).json({"message":"unable to find the task"})
    }
    
})

module.exports = app;