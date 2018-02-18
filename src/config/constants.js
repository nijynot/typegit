exports.DEV_PORT = 80;
exports.HTTPS_PORT = 443;
exports.REDIS_PORT = 6379;
exports.DOMAIN = 'https://pilecrow.com';

exports.SESSION_SK = 'FJ9y5po5aWYGlpFoEDwXeRYMU68TcQWTKNMqu8pU';

// exports.STRIPE_SK = '';
// exports.STRIPE_PK = 'pk_live_yfsYjJTXH0Lj4fTzDaAM1LZq';
exports.STRIPE_SK = 'sk_test_ZYOq3ukyy4vckadi7twhdL9f';
exports.STRIPE_PK = 'pk_test_aiHj0bwZIsrbUcVqTGUMCDUu';

exports.LETSENCRYPT_SK = '/etc/letsencrypt/live/pilecrow.com/privkey.pem';
exports.LETSENCRYPT_PK = '/etc/letsencrypt/live/pilecrow.com/fullchain.pem';

exports.DATABASE = (process.env.NODE_ENV === 'test') ? 'test_diary' : 'diary';
