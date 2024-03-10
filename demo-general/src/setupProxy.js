const { creatProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/api',
        creatProxyMiddleware({
            target: 'http://localhost:7001',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '',
            },
        }),
    );
};