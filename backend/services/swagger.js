import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "EduAPI Documentation",
      version: "1.0.0",
      description: "Comprehensive API documentation for the EduAPI platform",
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
  apis: ["./routers/authRouter.js", "./routers/academicRoute.js"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
