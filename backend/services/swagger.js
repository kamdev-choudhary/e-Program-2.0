import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "e-Program Documentation",
      version: "1.0.0",
      description: "Comprehensive API documentation for the E-Program platform",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development Server",
      },
      {
        url: "https://expressjs-uscv.onrender.com",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Empty array required here
      },
    ],
  },
  apis: [
    "./routers/authRouter.js",
    "./routers/academicRoute.js",
    "./routers/adminRoute.js",
    "./routers/analysisRoute.js",
    "./routers/automationRouter.js",
    "./routers/batchRoute.js",
    "./routers/chatRoute.js",
    "./routers/doubtRoute.js",
    "./routers/examRoute.js",
    "./routers/lectureRoute.js",
    "./routers/materialRoute.js",
    "./routers/questionRoute.js",
    "./routers/userRouter.js",
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
