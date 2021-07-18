import express from 'express';
import {createItemHandler} from './controllers/create-item';
import {createOrderHandler} from './controllers/create-order';
import {createStoreHandler} from './controllers/create-store';

export function getRouter() {
  const app = express();

  app.use(express.json());

  app.post('/api/createItem', (req, res, next)=>{
    createItemHandler(req, res)
        .catch((err)=>{
          console.log(err);
          next();
        });
  });
  app.post('/api/createStore', (req, res, next)=>{
    createStoreHandler(req, res)
        .catch((err)=>{
          console.log(err);
          next();
        });
  });
  app.post('/api/createOrder', (req, res, next)=>{
    createOrderHandler(req, res)
        .catch((err)=>{
          console.log(err);
          next();
        });
  });

  return app;
}

