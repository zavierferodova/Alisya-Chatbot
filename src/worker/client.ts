import { Client, LocalAuth } from 'whatsapp-web.js';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
  },
});

export default client;
