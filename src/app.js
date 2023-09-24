const express = require("express");
const Container = require("./container");
const mongo = require('mongodb');

const app = express();

const container = new Container;
app.set("container", container);
app.use(express.json());


app.get("/users", async(req, res) => {
    try {
        const repository = await container.getRepository();
        const events = await repository.findAll();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post("/users", async(req, res) => {
    const repository = await container.getRepository();
    const event = await repository.create(req.body);
    res.status(201).json(event);
})


app.get("/users/:id", async(req, res) => {
    const repository = await container.getRepository();
    const user = await repository.find(req.params.id);

    if (user === null) {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }else{
        res.status(200).json(user);
    }
})


app.put("/users/:id", async(req, res) => {
    const repository = await container.getRepository();
    const result = await repository.update(new mongo.ObjectId(req.params.id), req.body);

    if (!result) {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }else {
        const newEvent = await repository.find(req.params.id);
        res.status(200).json(newEvent);
    }
})


app.delete("/users/:id", async(req, res) => {
    const repository = await container.getRepository();
    const result = await repository.delete(new mongo.ObjectId(req.params.id));
    if (!result){
        res.status(404).json({ message: 'Usuário não encontrado' });
    }else{
        res.status(204).json();
    }
})


module.exports = app
