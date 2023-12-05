// src/index.js
import express from 'express';
import bodyParser from 'body-parser';
import getAccessToken from './src/auth.js';
import sendMessage from './src/sendMessages.js';
import messages from './src/messages.js';
import config from './src/config.js';

// configuracion de rutas
app.get('/posts', validateToken, async (req, res) => {
  try {
    const meliObject = new MeliObject(res.locals.access_token);    
    const user = await meliObject.get('/users/me');
    const items = (await meliObject.get(`/users/${user.id}/items/search`)).results || [];
    if (items.length) {
      const result = [];
      const promises = items.map(item_id => meliObject.get(`/items/${item_id}`));
      for await (item of promises) {
        result.push(item);
      }
      res.render('posts', { items: result });
    } else {
      res.status(404).send('no items were found :(');
    }
  } catch(err) {
    console.log('Something went wrong', err);
    res.status(500).send(`Error! ${err}`);
  }
});

const app = express();
const PORT = config.port;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('¡Bienvenido a tu aplicación!');
});

app.get('/auth/callback', async (req, res) => {
  try {
    //llega el code 
    const code = req.query.code;

    console.log(code)

    if (!code) {
      return res.status(400).send('Código de autorización no proporcionado.');
    }

    // Obtener token de acceso
    const accessToken = await getAccessToken(code);

    if(accessToken){
      console.log('AccesToken:' + accessToken)
    }else{
      console.log('no existe')
    }


    res.status(200).send('Autorización exitosa');
  } catch (error) {
    console.error('Error en la respuesta de autorización:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/send-message', async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const messageTemplate = messages.template1;

    // Enviar mensaje
    await sendMessage(orderId, messageTemplate);

    res.status(200).send('Mensaje enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
