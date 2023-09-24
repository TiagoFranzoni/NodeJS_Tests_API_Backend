const {MongoClient} = require('mongodb');
const EventRepository = require("./repository");

class Container {

    services = {};

    getClient() {       
        if (this.services.client !== undefined) {
            return this.services.client;
        }
        const dsn = 'mongodb://root:root@localhost?retryWrites=true&writeConcern=majority'
        return this.services.client = new MongoClient(dsn);
    }

    async getRepository() {
        if (this.services.repository !== undefined) {
            return this.services.repository;
        }

        const client = this.getClient();
        await client.connect();
        const collection = client.db('app_db').collection('events');
        return this.services.repository = new EventRepository(collection);
    }
}

module.exports = Container;