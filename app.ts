import qrcode from 'qrcode-terminal';
import client from './src/worker/client';
import messageHandler from './src/handler';
import logger from './src/logger/pino';

logger.info('Starting the application...');

client.on('authenticated', () => {
    logger.info('Client authenticated using local session!');
});

client.on('qr', qr => {
    logger.info('QR code received, scan it to authenticate');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    logger.info('Client is ready!');
});

client.on('message', messageHandler);

client.on('disconnected', () => {
    logger.info('Client is disconnected!');
});

client.initialize();