import { Client, LocalAuth } from 'whatsapp-web.js';
import config from '../config';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: config.chromiumPath,
    args: config.chromiumPath ? ['--no-sandbox', '--disable-setuid-sandbox'] : undefined
  }
});

export default client;
