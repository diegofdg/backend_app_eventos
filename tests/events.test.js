const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const db = require('../config/db');
const Users = require('../models/Users');
const Events = require('../models/Events');

let headers;
let id_first_event;

beforeAll(async () => {    
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
    
    const result = await api.post('/auth').send(newUser);        
    headers = {
        'Authorization': `bearer ${result.body.token}`
    };        
});

describe('events test', () => {      
    test('there are no events.', async () => {
        await Events.destroy({
            where: {}  
          });  
        const result = await api.get('/events')
        expect(result.statusCode).toEqual(404)
        expect(result.body).toEqual({Error: "there are no events."})
    });
        
    test('user can add an event', async () => {        
        const newEvent = {
            "title":"first",
            "description":"here goes the description",
            "starred":true,
            "image_url":"https://www.google.com.ar", 
            "location":"parana",
            "details":[
                {
                    "date":"2021-08-20",
                    "time":"09:00",
                    "price":1000
                },
                {
                    "date":"2021-08-21",
                    "time":"08:00",
                    "price":500
                }
            ]    
        };
          
        const result = await api
        .post('/events')
        .set(headers)
        .send(newEvent)
        .expect(201)
        .expect('Content-Type', /application\/json/);
        id_first_event = result.body.id;
    });

    test('user can get event details', async () => {           
        const result = await api.get(`/events/${id_first_event}`)
        expect(result.statusCode).toEqual(200);
        const contents = result.body.map(r => r.title);
		expect(contents).toContain('first');
    });

    test('user can share an event on twitter', async () => {            
        const id = id_first_event + "";
        const result = await api.get('/share-event').send({id});        
        expect(result.statusCode).toEqual(200);        
		expect(result.body).toEqual('i will go to first on 2021-08-20 https://www.google.com.ar')
    });           
});

afterAll(() => {
    db.close();
});