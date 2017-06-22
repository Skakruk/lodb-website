import express from 'express';
import webpack from 'webpack';
import path from 'path';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './webpack.config.development';

const app = express();
const compiler = webpack(config);
const PORT = process.env.PORT || 3002;

const wdm = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true
    }
});


app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/assets'));
app.use(wdm);
app.use(webpackHotMiddleware(compiler));

app.get("/*", (req, res) => {
    res.sendFile(path.join(`${__dirname}/app/app.html`));
});

const server = app.listen(PORT, 'localhost', err => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(`Listening at http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('Stopping dev server');
    wdm.close();
    server.close(() => {
        process.exit(0);
    });
});
