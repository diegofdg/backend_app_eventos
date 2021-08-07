const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const db = require('../config/db');
const Users = require('../models/Users');
const Events = require('../models/Events');
const DetailsEvent = require('../models/DetailsEvent');

let headers;
let idUser1;

describe('users test', () => {  
    test('register an user', async () => {   
        await Users.destroy({
            where: {}  
          });  
        const newUser = {
            name: 'root',
            surname: 'root',
            user: 'root',
            password: 'root'
        };
        const result = await api.post('/users').send(newUser);   
        idUser1 = result.body.newUser.id;        
        expect(result.statusCode).toEqual(201);
        expect(result.body).toHaveProperty('newUser');
    });       
        
    test('error when registering same user', async () => {     
        const newUser = {
            name: 'root',
            surname: 'root',
            user: 'root',
            password: 'root'
        };
        const result = await api.post('/users').send(newUser);
        expect(result.statusCode).toEqual(404);
        expect(result.body).toEqual({Error:'user is already taken'});
    });

    test('error when registering without sending data', async () => {     
        const newUser = {};
        const result = await api.post('/users').send(newUser);
        expect(result.statusCode).toEqual(404);
        expect(result.body).toEqual({Error: 'name, surname, user and password are required'});
    });              
});

describe('list of events', () => {       
    beforeEach(async() => {
        const newUser = {            
            user: 'root',
            password: 'root'
        };
        const result = await api.post('/auth').send(newUser);
        headers = {
            'Authorization': `bearer ${result.body.token}`
        };      
        await Events.destroy({
            where: {}  
        });  
        await DetailsEvent.destroy({
            where: {}  
        });  

        const initialEvents = [
            {
                "title":"first",
                "description":"here goes the description",
                "starred":true,
                "image_url":"https://www.google.com.ar",
                "location":"parana",
                "userId": idUser1,
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
            },
            {
                "title":"second",
                "description":"here goes the description",
                "starred":false,
                "image_url":"https://www.google.com.ar", 
                "location":"parana",
                "userId": idUser1,
                "details":[
                    {
                        "date":"2020-08-20",
                        "time":"09:00",
                        "price":1000
                    },
                    {
                        "date":"2020-08-21",
                        "time":"08:00",
                        "price":500
                    }
                ]    
            },
            {
                "title":"third",
                "description":"here goes the description",
                "starred":false,
                "image_url":"https://www.google.com.ar", 
                "location":"parana",
                "userId": idUser1,
                "details":[
                    {
                        "date":"2018-08-20",
                        "time":"09:00",
                        "price":1000
                    },
                    {
                        "date":"2018-08-21",
                        "time":"08:00",
                        "price":500
                    }
                ]      
            },
            {
                "title":"quarter",
                "description":"here goes the description",
                "starred":false,
                "image_url":"https://www.google.com.ar", 
                "location":"parana",
                "userId": idUser1,
                "details":[
                    {
                        "date":"2017-08-20",
                        "time":"09:00",
                        "price":1000
                    },
                    {
                        "date":"2017-08-21",
                        "time":"08:00",
                        "price":500
                    }
                ]  
            },
            {
                "title":"fifth",
                "description":"here goes the description",
                "starred":false,
                "image_url":"https://www.google.com.ar", 
                "location":"parana",
                "userId": idUser1,
                "details":[
                    {
                        "date":"2025-08-20",
                        "time":"09:00",
                        "price":1000
                    },
                    {
                        "date":"2025-08-21",
                        "time":"08:00",
                        "price":500
                    }
                ]  
            },
            {
                "title":"sixth",
                "description":"here goes the description",
                "starred":false,
                "image_url":"https://www.google.com.ar", 
                "location":"parana",
                "userId": idUser1,
                "details":[
                    {
                        "date":"2024-08-20",
                        "time":"09:00",
                        "price":1000
                    },
                    {
                        "date":"2024-08-21",
                        "time":"08:00",
                        "price":500
                    }
                ]  
            },
            {
                "title":"seventh",
                "description":"here goes the description",
                "starred":false,
                "image_url":"https://www.google.com.ar", 
                "location":"parana",
                "userId": idUser1,
                "details":[
                    {
                        "date":"2023-08-20",
                        "time":"09:00",
                        "price":1000
                    },
                    {
                        "date":"2023-08-21",
                        "time":"08:00",
                        "price":500
                    }
                ]  
            },
            {
                "title":"eighth",
                "description":"here goes the description",
                "starred":false,
                "image_url":"https://www.google.com.ar", 
                "location":"parana",
                "userId": idUser1,
                "details":[
                    {
                        "date":"2032-08-20",
                        "time":"09:00",
                        "price":1000
                    },
                    {
                        "date":"2032-08-21",
                        "time":"08:00",
                        "price":500
                    }
                ]  
            }
        ];

        for(let i = 0; i < 8; i++){
            let eventsObject = initialEvents[i];
            await api
                .post('/events')
                .set(headers)
                .send(eventsObject);
        }
    });        

    test('events list is displayed by page', async () => {
        const result = await api.get('/users/events').set(headers);        
        expect(result.statusCode).toEqual(200);
        expect(result.body).toHaveLength(3);
    });

    test('starred events are shown', async () => {
        const result = await api.get('/starred-events');
        expect(result.statusCode).toEqual(200);
        expect(result.body).toHaveLength(2);
    });   

    test('events list sorted by date', async () => {
        const result = await api.get('/events');
        expect(result.statusCode).toEqual(200);
        const contents = result.body.map(r => r.title);
		expect(contents).toContain('eighth');        
    });
});

afterAll(() => {
    db.close();
});