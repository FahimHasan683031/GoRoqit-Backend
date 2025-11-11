import cors from 'cors'
import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import router from './routes'
import { Morgan } from './shared/morgan'
import cookieParser from 'cookie-parser'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import passport from './app/modules/auth/passport.auth/config/passport'
import handleStripeWebhook from './stripe/handleStripeWebhook';

//application
const app = express();


const allowedOrigins = [
  'https://goroqit.com',
  'https://www.goroqit.com',   // add www version
  'http://goroqit.com',        // optional if non-SSL
  'http://localhost:3000',
  'http://10.10.7.45:3000'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
)
// Stripe webhook route
app.use('/webhook',
    express.raw({ type: 'application/json' }),
    handleStripeWebhook
);


//morgan
app.use(Morgan.successHandler)
app.use(Morgan.errorHandler)
//body parser
app.use(express.json())
app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
//file retrieve
app.use(express.static('uploads'))

//router
app.use('/api/v1', router)

//live response
app.get('/', (req: Request, res: Response) => {
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
  `)
})


//global error handle
app.use(globalErrorHandler)
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
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

export default app
