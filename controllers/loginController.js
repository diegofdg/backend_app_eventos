const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');

exports.loginTokenUser = async(req,res) => {
    try{
        const { user, password } = req.body;

        if( !user || !password ){
            return res.status(404).json({ 
                Error: 'user and password are required'
            });
        }

        const result = await Users.findOne({
            where: {
                user
            }            
        });        

        if(result.length !== 0){
            const passwordCorrect = await bcrypt.compare(password, result.password);
            if(!(result && passwordCorrect)){
                return res.status(401).json({ 
                    Error: 'user or password are incorrect' 
                });
            } else {
                const userToken = {
                    user,
                    id: result.id
                }                
                const token = jwt.sign(userToken, process.env.SECRET);                                  
                return res.status(200).json({
                    token, user
                });
            }       
        } else {            
            return res.status(404).json({ 
                Error: 'user does not exist' 
            });        
        }
    }
    catch(error){        
        return res.status(404).json(error);
    }
}

exports.getToken = req => {
    const authorization = req.get('Authorization');
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7);
    }
    return null;
}

exports.validateToken = async(token) => {
    const decodedToken = jwt.verify(token, process.env.SECRET) || null;
    
    if( !token || !decodedToken.id ){
        return false;
    }    
    return true;
};

exports.decodeSecret = (token) => jwt.verify(token, process.env.SECRET) || null;