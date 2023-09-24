const Container = require('../container');
const mongo = require('mongodb');

describe("Testes Repository", () => {

    let client;
    let collection;
    let repository;

    // Cria a conexão com o banco antes de cada teste
    beforeAll(async () => {
        const container = new Container();
        client = await container.getClient();
        collection = client.db('app_db').collection('events');
        repository = await container.getRepository();
    });
   
    // Deleta os dados do banco antes de cada teste
    beforeEach(async() => {
        await collection.deleteMany({});
    });

    // Encerra a conexão com o banco após cada teste
    afterAll(async() => {
        await client.close();
    });



    test('Lê um usuário', async() => {
        const resultUser = await collection.insertOne({
            name: 'name_one',
            email: 'name_one@email.com',
            password: 'password_name_one'
        });
 
        const user = await repository.find(resultUser.insertedId.toString());

        expect(user).toStrictEqual(expect.objectContaining({
            name: 'name_one',
            email: 'name_one@email.com',
            password: 'password_name_one'
        }));
    });
    

    test("Cria usuário", async() => {
        const user = await repository.create({
            name: 'name_one',
            email: 'name_one@email.com',
            password: 'password_name_one'       
        });

        expect(user).toStrictEqual(expect.objectContaining({
            name: 'name_one',
            email: 'name_one@email.com',
            password: 'password_name_one'
        }));

    });


    test("Lê todos os usuários", async() => {

        await repository.create({
            name: 'name_one',
            email: 'name_one@email.com',
            password: 'password_name_one'
        });
        await repository.create({
            name: 'name_two',
            email: 'name_two@email.com',
            password: 'password_name_two'
        });

        const users = await repository.findAll();

        expect(users).toHaveLength(2);
        expect(users[1]).toStrictEqual(expect.objectContaining({
            name: 'name_two',
            email: 'name_two@email.com',
            password: 'password_name_two'
        }));
    });


    test("Altera um usuário", async() => {

        // cria o registro
        const user = await repository.create({
            name: 'name_one',
            email: 'name_one@email.com',
            password: 'password_name_one'
        });

        // altera o registro
        await repository.update(user._id, {
            name: 'name_two',
            email: 'name_two@email.com',
            password: 'password_name_two'
        });

        // consulta o registro
        const updatedUser = await repository.find(user._id.toString());

        // compara o registro
        expect(updatedUser).toStrictEqual(expect.objectContaining({
            name: 'name_two',
            email: 'name_two@email.com',
            password: 'password_name_two'
        }));

    });


    test("Deleta um usuário", async() => {

        const user = await repository.create({
            name: 'name_two',
            email: 'name_two@email.com',
            password: 'password_name_two'
        });

        const deletedUser = await repository.delete(user._id);
        expect(deletedUser).toBe(true);

        const searchUser = await repository.find(user._id.toString());
        expect(searchUser).toBe(null);
    });


    test('Deleta um usuário inexistente', async() => {
        const id = new mongo.ObjectId('64ed4142b146d674e76af07c');
        const deletedUser = await repository.delete(id);
        expect(deletedUser).toBe(false);
    });

})