const homeRouter = require('./home');
const songRouter = require('./songs');

function route(app) {
    app.use('/songs', songRouter);
    app.use('/', homeRouter);
}

module.exports = route;
