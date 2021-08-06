const bcrypt = require('bcrypt');
const Users = require('../models/Users');

exports.crearUsuario = async(req,res) => {
    try {
        const { name, surname, user, password } = req.body;

        if( !name || !surname || !user || !password ){
            return res.status(404).json({
                Error: 'name, surname, user and password are required'
            }); 
        }

        let result = await Users.findOne({
            where: {
                name,
                surname 
            }
        });

        if(result){
            return res.status(404).json({
                Error:'name and last name are already taken'
            }); 
        }

        result = await Users.findOne({
            where: {
                user
            }
        });

        if(result) {
            return res.status(404).json({
                Error:'user is already taken'
            }); 
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        const newUser = await Users.create({
            name,
            surname,
            user,
            password:passwordHash
        });

        return res.status(201).json({
            newUser
        });
    } catch (error) {
        return res.status(404).json(error);    
    }
}