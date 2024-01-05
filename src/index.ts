import { Request, Response } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Secret key
import secretKey from './jwt/secret_key';

// Routers
import adminRouter from './routes/admin/admin.router';
import normalRouter from './routes/normal/normal.router';
import swaggerOptions from './init/swagger';

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

const app = express();

// Initialize secret key
secretKey.generateSecretKey();

// know if the arg --sync is passed
const sync = process.argv.includes('--sync');

// Initialize sequelize and start server
async function startServer() {
  try {

    var jsonParser = bodyParser.json()

    // Add general middlewares to main router
    app.use(cors({origin: true, credentials: true}));
    
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    app.use(jsonParser);

    // Import sequelize after initializing the app
    const sequelize = require('./init/sequelize').default;

    // Test the connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Synchronize the model with the database
    await sequelize.sync({ force: sync });
    console.log('Database synchronized.');

    // Swagger UI options for custom sorting
    const swaggerUiOptions = {
      swaggerOptions: {
        operationsSorter: (a: { get: (arg0: string) => string; }, b: { get: (arg0: string) => string; }) => {
          const methodsOrder = ["get", "post", "put", "patch", "delete", "options", "trace"];
          const result = methodsOrder.indexOf(a.get("method")) - methodsOrder.indexOf(b.get("method"));

          if (result === 0) {
            return a.get("path").localeCompare(b.get("path"));
          }

          return result;
        },
      },
    };

    // Generate Swagger specification

    const swaggerSpec = swaggerJsDoc(swaggerOptions);

    // Serve Swagger documentation
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Use routers
    app.use('', normalRouter);
    app.use('/admin', adminRouter);

    // Test route
    app.get('/ping', (req: Request, res: Response) => {
      res.status(200).json({ message: 'pong' });
    });

    // Start server
    app.listen(8000, () => {
      console.log('Server started on port 8000');
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
  }
}

// Start the server
startServer();