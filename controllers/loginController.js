//Importamos las dependencias
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/Usuarios');

// Login de usuario
exports.loginUsuario = async(req,res) => {
    try{
        const { usuario, clave } = req.body;
        const result = await Usuarios.findOne({
            where: {
                usuario
            }            
        });        
        if(result.length !== 0){
            const claveCorrecta = await bcrypt.compare(clave, result.clave);
            if(!(result && claveCorrecta)){
                return res.status(401).json({                
                    Error: 'Usuario o Password incorrectos'
                });
            } else {
                const usuarioToken = {
                    usuario,
                    id: result.id
                }                
                const token = jwt.sign(usuarioToken, process.env.SECRET);  
                console.log(token)              
                const decodedToken = jwt.verify(token, process.env.SECRET)
                console.log(decodedToken)
                return res.status(200).json({
                    token, usuario
                });
            }       
        } else {            
            return res.status(204).json({                
                Error: 'No existe el usuario'
            });        
        }
    }
    catch(error){        
        return res.status(404).json(error);
    }
}