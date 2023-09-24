const app = require("../app");
const request = require("supertest")(app);

describe("Testes API", () => {

    let client;
    let repository;

    // Cria a conexão com o banco antes de cada teste
    beforeAll(async() => {
        const container = app.get("container");
        client = container.getClient();
        repository = await container.getRepository();
    });
    
    // Deleta os dados do banco antes de cada teste
    beforeEach(async() => {
        await repository.deleteAll();
    });

    // Encerra a conexão com o banco após cada teste
    afterAll(async() => {
        await client.close();
    });


    test("GET /users", async() =>{
      
        const dataUser = {
            name: 'name_one',
            email: 'name_one@email.com',
            password: 'password_name_one'
        }  
        const dataUserTwo = {
            name: 'name_two',
            email: 'name_two@email.com',
            password: 'password_name_two'
        }  


        // preparacao
        const user1 = await repository.create(dataUser);
        const user2 = await repository.create(dataUserTwo);

        // executo o cenario
        const response = await request.get("/users");

        // assercoes do cenario (validacao)
        expect(response.header).toHaveProperty("content-type", "application/json; charset=utf-8");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body).toEqual(expect.arrayContaining([
            {
                id: `${user1._id}`,
                name: 'name_one',
                email: 'name_one@email.com',
                password: 'password_name_one'
            },
            {
                id: `${user2._id}`,
                name: 'name_two',
                email: 'name_two@email.com',
                password: 'password_name_two'
            }
        ]));
    });


    test("POST /users", async() =>{

        const dataUser = {
            name: 'name_one',
            email: 'name_one@email.com',
            password: 'password_name_one'
        } 

        // preparacao - OK

        // executo o cenario
        const response = await request.post("/users")
            .send(dataUser)
        
        // assercoes do cenario (validacao)
        expect(response.header).toHaveProperty("content-type", "application/json; charset=utf-8");
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(dataUser.name);
        expect(response.body.email).toBe(dataUser.email);
        expect(response.body.password).toBe(dataUser.password);
    });


    test("GET /users/{id} - Evento existente", async() =>{

        const dataUser = {
            name: 'name_one',
            email: 'name_one@email.com',
            password: 'password_name_one'
        }         
        
        // preparacao
        const user = await repository.create(dataUser);
           
        // executo o cenario
        const response = await request.get(`/users/${user._id}`);       
        
        // assercoes do cenario (validacao)
        expect(response.header).toHaveProperty("content-type", "application/json; charset=utf-8");
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(dataUser.name);
        expect(response.body.email).toBe(dataUser.email);
        expect(response.body.password).toBe(dataUser.password);
    });
    
       
    test("GET /users/{id} - Evento não existente", async() =>{
        // preparacao-OK

        // executo o cenario
        const response = await request.get(`/users/650f23a1587522c2bc776e3e`);       
        
        // assercoes do cenario (validacao)
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual(expect.objectContaining({
            message: "Usuário não encontrado"
        }));
    });


    test("PUT /users/{id} - Evento existente", async() => {

        const dataUser = {
            name: 'name_one',
            email: 'name_one@email.com',
            password: 'password_name_one'
        } 

        const dataUserAlter = {
            name: 'name_two',
            email: 'name_two@email.com',
            password: 'password_name_two'
        } 


        // preparacao
        const user = await repository.create(dataUser);

        // executo o cenario
        const response = await request.put(`/users/${user._id}`)
            .send(dataUserAlter);

        // assercoes do cenario (validacao)
        expect(response.statusCode).toBe(200);

        expect(response.body.name).toBe(dataUserAlter.name);
        expect(response.body.email).toBe(dataUserAlter.email);
        expect(response.body.password).toBe(dataUserAlter.password);
    });


    test("PUT /users/{id} - Evento não existente", async() => {
        // preparacao - OK

        // executo o cenario
        const response = await request.put(`/users/650f23a1587522c2bc776e3e`)
            .send({
                name: 'name_two',
                email: 'name_two@email.com',
                password: 'password_name_two'
            });

        // assercoes do cenario (validacao)
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual(expect.objectContaining({
            message: "Usuário não encontrado"
        }));
    });


    test("DELETE /users/{id} - Evento existente", async() => {

        const dataUser = {
            name: 'name_one',
            email: 'name_one@email.com',
            password: 'password_name_one'
        } 

        // preparacao
        const user = await repository.create(dataUser);

        // executo o cenario
        const response = await request.delete(`/users/${user._id}`)

        // assercoes do cenario (validacao)
        expect(response.statusCode).toBe(204);
        expect(response.body).toStrictEqual({});
    });


    test("DELETE /users/{id} - Evento não existente", async() => {
        // preparacao - OK

        // executo o cenario
        const response = await request.delete(`/users/650f23a1587522c2bc776e3e`)

        // assercoes do cenario (validacao)
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual(expect.objectContaining({
            message: "Usuário não encontrado"
        }));
    });

});