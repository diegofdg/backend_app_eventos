const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const db = require('../config/db');
const Users = require('../models/Users');

describe('login test', () => {  
    beforeEach(async () => {
        await Users.destroy({
            where: {}  
        });  
        const newUser = {
            name: 'root',
            surname: 'root',
            user: 'root',
            password: 'root'
        };
        await api.post('/users').send(newUser);
	});

    test('a registered user can login', async () => {           
        const newUser = {            
            user: 'root',
            password: 'root'
        };
        const result = await api.post('/auth').send(newUser);
        headers = {
            'Authorization': `bearer ${result.body.token}`
        };        
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('token')
    });       

    test('a non registered user or an user with wrong password can not login', async () => {           
        const newUser = {            
            user: 'root',
            password: 'toor'
        };
        const result = await api.post('/auth').send(newUser);
        expect(result.statusCode).toEqual(401)
        expect(result.body).toEqual({Error: 'user or password are incorrect'})
    });
});

afterAll(() => {
    db.close();
});