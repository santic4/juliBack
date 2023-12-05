// src/auth.js
import fetch from 'node-fetch';
import config from './config.js';

async function getAccessToken(code) {
  try {
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code,
        redirect_uri: config.redirectUri,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error al obtener el token de acceso: ${data.message}`);
    }

    return data.access_token;
  } catch (error) {
    console.error('Error al obtener el token de acceso:', error.message);
    throw error;
  }
}

export default getAccessToken;
