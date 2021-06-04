import koa from 'koa';
import { AppLogger } from './logger';
import Router from 'koa-router';
import { Greeting } from './models/greeting';
type ContextT = {
  logger: AppLogger
}
type StateT = any

const app = new koa<StateT, ContextT >();

app.use(async (ctx, next) => {
  ctx.logger = new AppLogger(ctx.request);
  ctx.logger.log();
  await next();
});

app.use(async(ctx, next) => {
  ctx.body = 'Hello World';
  const greeting = new Greeting(ctx.logger);
  // await greeting.lazyGreeting();
  greeting.greeting();
  ctx.logger.log();
  await next();
});

// const router = new Router<StateT, ContextT>();

// router.get('/', (ctx, next) => {
//   console.log('Hello World');
//   ctx.body = 'Hello World';
//   const greeting = new Greeting(ctx.logger);
//   // await greeting.lazyGreeting();
//   greeting.greeting();
//   ctx.logger.log();
//   next();
// });
// app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server start http://localhost:3000 !');
});

// logger

// app.use(async (ctx, next) => {
//   await next(); // 54行目
//   const rt = ctx.response.get('X-Response-Time');
//   console.log(`${ctx.method} ${ctx.url} - ${rt}`);
// });

// // x-response-time

// app.use(async (ctx, next) => {
//   const start = Date.now();
//   await next(); // 63行目
//   const ms = Date.now() - start;
//   ctx.set('X-Response-Time', `${ms}ms`); // 47行目
// });

// // response

// app.use(async ctx => {
//   ctx.body = 'Hello World'; // 56行目
// });

// app.listen(3000);
