const mongo = require('mongodb');

class EventRepository {

    constructor(collection) {
        this.collection = collection;
    }

    async find(id) {
        return await this.collection.findOne({_id: new mongo.ObjectId(id)})
    }

    async findAll() {
        const result = await this.collection.find({});
        return result.toArray();
    }

    async create(event) {
        await this.collection.insertOne(event);
        return event;
    }

    async update(id, data) {
        const result = await this.collection.updateOne({_id: id}, {$set: data});
        return result.matchedCount === 1;
    }

    async delete(id) {
        const result = await this.collection.deleteOne({_id: id});
        return result.deletedCount === 1;
    }

    async deleteAll() {
        await this.collection.deleteMany({});
    }

}

module.exports = EventRepository;