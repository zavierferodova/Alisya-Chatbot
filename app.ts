import qrcode from 'qrcode-terminal';
import client from './src/worker/client';
import messageHandler from './src/handler/messsage-handler';

client.on('authenticated', () => {
    console.log("Authenticated Using local session");
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
    console.log('For run this app in the background,\nTry to learn using tmux and start it in Tmux Session');
});

client.on('message', messageHandler);

client.initialize();