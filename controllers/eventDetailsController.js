const DetailsEvent = require('../models/DetailsEvent');

exports.createEventDetails = (id, details) => {    
    const eventId = id;                        
    const info = [];
    details.forEach(async (element) => {
        const { date, time, price } = element;
        const newDetail = { 
            date, 
            time, 
            price, 
            eventId
        }                
        await DetailsEvent.create(newDetail).then(info.push(newDetail));        
    });
    return info;
}
