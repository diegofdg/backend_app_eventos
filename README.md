# TP Final con NodeJS
Proyecto Final del curso "Desarrollo BackEnd con Node JS" dictado por el Cluster Tecnológico Catamarca - CCT

</br>
## Instrucciones

Para realizar puebas, puedes usar el usuario 'root' y la contraseña 'root'.

</br>
### API endpoints

`GET /events`

Lista todos los eventos ordenados por fecha.

---

`GET /events/{id}`

Lista todos los detalles de un evento.

---

`GET /share-event`

Devuelve un mensaje con el nombre del evento, la fecha de realización y el link de la url de la imagen asociada.
Se debe enviar en el body la propiedad 

    id: ''

---

`GET /starred-events`

Lista todos los eventos destacados.

---

`POST /users`

Crea un nuevo usuario.
Se debe enviar en el body las propiedades:

    name: '',
	surname: '',
	user: '',
	password: ''

---

`POST /auth`

Realiza el login ingresando usuario y contraseña, devolviendo un token para validar la sesión.
Se debe enviar en el body las propiedades:    

	user: '',
	password: ''

---

`POST /events`

Crea un evento (solamente permitido para los usuarios que han realizado un login exitoso y que tienen un token vigente).
Se debe enviar en el header la propiedad:

    Authorization: 'bearer '+ token

y en el body las propiedades:

    title: '',
	description: '',
	starred: true / false,
	image_url: '',
	location: '',
	details: [
		{
	    	date: '',
			time: '',
			price: ''
		},
		{
			date:'',
			time:'',
			price:''
		}
	]

---

`GET /users/events/:page?`

Lista los eventos del usuario paginados de a 3 por pagina.

---