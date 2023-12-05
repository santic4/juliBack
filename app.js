// src/index.js
import express from 'express';
import bodyParser from 'body-parser';
import getAccessToken from './src/auth.js';
import sendMessage from './src/sendMessages.js';
import messages from './src/messages.js';
import config from './src/config.js';

const app = express();
const PORT = config.port;

// Configuración de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://juliback.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido a tu aplicación!');
});

app.get('/auth/callback', async (req, res) => {
  try {
    const code = req.query.code;

    console.log(code + 'hola');

    console.log(req.body)

    if (!code) {
      return res.status(400).send('Código de autorización no proporcionado.');
    }

    // Inicializa accessToken con null o un valor predeterminado
    let accessToken = null;

    // Obtener token de acceso
    accessToken = await getAccessToken(code);

    console.log(code + 'chau')

    if (accessToken) {
      console.log('AccesToken:' + accessToken);

      // Usa el token de acceso para obtener información del usuario, incluyendo el order_id
      const userInfo = await getUserInfo(accessToken);

      console.log('hola')

      console.log(userInfo);

    } else {
      console.log('No se obtuvo el token de acceso');
    }

    res.status(200).send('Autorización exitosa' + accessToken + code);
  } catch (error) {
    console.error('Error en la respuesta de autorización:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.use((req, res, next) => {
  console.log('Body of the request:', req.body);
  next();
});

app.post('/send-message', async (req, res) => {
  try {
    console.log(req.body)
    const orderId = req.body.orderId;
    const messageTemplate = messages.template1;
    console.log(orderId+'hola')
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
