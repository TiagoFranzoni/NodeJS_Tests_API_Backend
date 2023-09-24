const express = require("express");
const Container = require("./container");
const mongo = require('mongodb');
const cors = require("cors");

const app = express();

const container = new Container;
app.set("container", container);
app.use(express.json());
app.use(cors({
    exposedHeaders: ["Content-Range"],
}));

const normalizePk = (user) => {
    user.id = user._id;
    delete user._id;
    return user;
}


app.get("/users", async(req, res) => {
    try {
        const repository = await container.getRepository();
        const events = await repository.findAll();
        res.setHeader("Content-Range", 100);
        res.status(200).json(events.map(normalizePk));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post("/users", async(req, res) => {
    const repository = await container.getRepository();
    const event = await repository.create(req.body);
    res.status(201).json(normalizePk(event));
})


app.get("/users/:id", async(req, res) => {
    const repository = await container.getRepository();
    const user = await repository.find(req.params.id);

    if (user === null) {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }else{
        res.status(200).json(normalizePk(user));
    }
})


app.put("/users/:id", async(req, res) => {
    const repository = await container.getRepository();
    const result = await repository.update(new mongo.ObjectId(req.params.id), req.body);

    if (!result) {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }else {
        const newEvent = await repository.find(req.params.id);
        res.status(200).json(normalizePk(newEvent));
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

app.delete("/users", async(req, res) => {
    const repository = await container.getRepository();
    await repository.deleteAll();
    res.status(204).json();
})





module.exports = app
