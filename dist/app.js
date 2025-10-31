"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const routes_1 = __importDefault(require("./routes"));
const morgan_1 = require("./shared/morgan");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const passport_1 = __importDefault(require("./app/modules/auth/passport.auth/config/passport"));
const handleStripeWebhook_1 = __importDefault(require("./stripe/handleStripeWebhook"));
const app = (0, express_1.default)();
const allowedOrigins = [
    'https://goroqit.com',
    'http://localhost:3000',
    "http://10.10.7.45:3000"
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
// Stripe webhook route
app.use('/webhook', express_1.default.raw({ type: 'application/json' }), handleStripeWebhook_1.default);
//morgan
app.use(morgan_1.Morgan.successHandler);
app.use(morgan_1.Morgan.errorHandler);
//body parser
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
//file retrieve
app.use(express_1.default.static('uploads'));
//router
app.use('/api/v1', routes_1.default);
//live response
app.get('/', (req, res) => {
    res.send(`
   <div style="
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #e8f5e9, #f1f8f6);
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1b4332;
      margin: 0;
    ">
      <div style="
        text-align: center;
        background: #ffffffd9;
        border: 1px solid #d9ead3;
        border-radius: 16px;
        padding: 3rem 2.5rem;
        box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        max-width: 600px;
      ">
        <img src="https://i.ibb.co.com/mCpCVJP4/LOGO-C.png" alt="Go Roqit" width="80" style="margin-bottom: 1rem; height: 60px; width: 180px;" />
        <h1 style="
          font-size: 2.4rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
          color: #1b4332;
        ">
          👋 Welcome to Go Roqit API
        </h1>

        <p style="
          font-size: 1.15rem;
          line-height: 1.7;
          color: #2d6a4f;
        ">
          You’ve reached the <code style="color:#40916c;">root</code> of the Go Roqit server.<br>
          Everything’s running smoothly and securely. ✅<br><br>
          Explore the API endpoints or head back to the app for takeoff. 🚀
        </p>

        <a href="https://goroqit.com" target="_blank" style="
          display: inline-block;
          margin-top: 1.8rem;
          padding: 0.8rem 1.6rem;
          border-radius: 10px;
          background: #2d6a4f;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.3s ease;
        " onmouseover="this.style.background='#1b4332'" onmouseout="this.style.background='#2d6a4f'">
          🌐 Visit Go Roqit App
        </a>

        <p style="
          margin-top: 2rem;
          font-size: 0.9rem;
          color: #52796f;
        ">
          © ${new Date().getFullYear()} — Go Roqit Server<br>
          Built with 💚 and innovation
        </p>
      </div>
    </div>
  `);
});
//global error handle
app.use(globalErrorHandler_1.default);
app.use((req, res) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Endpoint not found 🚫",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "Looks like you’ve taken a wrong turn — this route doesn’t exist on the Go Roqit API.",
            },
            {
                path: "/api/v1/docs",
                message: "Need directions? Check out our API documentation for valid endpoints. 📘",
            },
        ],
        tip: "Pro Tip 💡: Always double-check your endpoint URL, HTTP method, and version prefix before sending requests.",
        roast: "It’s okay, even rockets miss their trajectory sometimes. 🚀 Adjust course and try again!",
        timestamp: new Date().toISOString(),
    });
});
exports.default = app;
