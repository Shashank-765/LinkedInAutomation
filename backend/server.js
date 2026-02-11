
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const postRoutes = require('./src/routes/post.routes.js');
const authRoutes = require('./src/routes/auth.routes.js');
const adminRoutes = require('./src/routes/admin.routes.js');
const paymentRoutes = require('./src/routes/payment.routes.js');
const { autoPostJob } = require('./src/jobs/autopost.job.js');
const adRoutes = require('./src/routes/ads.routes.js'); // Added
const aiRoutes = require('./src/routes/ai.routes.js')
require('./src/models/User.js').createDefaultAdmin(); // Ensure default admin exists
require('./src/models/Plan.js').defaultPlanCreation(); // Ensure default plans exist
const dotenv = require('dotenv');

const fs = require("fs");
const path = require("path");
console.log('process.cwd()', process.cwd())
const uploadRoot = path.join(process.cwd(), "uploads");
const videoDir = path.join(uploadRoot, "videos");
console.log('fs.existsSync(videoDir)', fs.existsSync(videoDir))
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
  console.log("📁 uploads/videos directory created");
}





dotenv.config();


const app = express();
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);



// Webhook route must be registered BEFORE express.json() 
// because it needs the raw request body for Stripe signature verification.
app.use('/payment/webhook', express.raw({ type: 'application/json' }), paymentRoutes);

// STANDARD MIDDLEWARES
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(/.*/, cors());
// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/linkedin_ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/admin', adminRoutes);
app.use('/ads', adRoutes); // Added
app.use('/ai',aiRoutes);


// Scheduling Cron Job (Runs every hour)
cron.schedule("*/1 * * * *", () => {
  console.log('Running Auto-Post Job...');
  autoPostJob();
});

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`🚀 Postpilot Backend running on port ${PORT}`));
