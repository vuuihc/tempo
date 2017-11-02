const Koa = require('koa');
const views = require('koa-views');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');
const path = require('path');
const serve = require('koa-static');
const data = require('./data.js');

const app = new Koa();

app.use(views(path.join(__dirname,'./views')));
app.use(logger());
app.use(serve('static'));

router.get('/', async (ctx) => {
    await ctx.render('index');
})

router.get('/data', (ctx, next) => {
    ctx.body = data;
    ctx.type = 'application/json';
});

app.use(router.middleware());

app.listen(4000);