const crypto = require('crypto');

function sha256KeyedHash(key: string, data: string): string {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest('hex');
}

export {
    sha256KeyedHash
}