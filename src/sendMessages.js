// src/sendMessage.js
import fetch from 'node-fetch';
import getAccessToken from './auth.js';
import config from './config.js';
import messages from './messages.js';

async function sendMessage(orderId, messageTemplate) {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`https://api.mercadolibre.com/messages/packs/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        from: {
          user_id: config.clientId,
        },
        to: orderId,
        messages: [
          {
            message: messageTemplate,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error al enviar el mensaje: ${data.message}`);
    }

    console.log('Mensaje enviado con éxito:', data);
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.message);
    throw error;
  }
}

export default sendMessage;
