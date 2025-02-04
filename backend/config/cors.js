const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://10.0.3.69:5173",
      "http://10.0.12.85:5173",
      "https://e-program.onrender.com",
      "http://localhost:5173",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies and credentials
  optionsSuccessStatus: 204, // For preflight responses
};

export default corsOptions;
