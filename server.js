
const express = require('express')
const next = require('next')
const { ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const verifyToken = require("./middleware/auth");

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const connectDB = async () => {
  try {
      await mongoose.connect(
          `mongodb+srv://admin:admin123456@binance-nextjs.qvjmcji.mongodb.net/?retryWrites=true&w=majority`,
          {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              serverApi: ServerApiVersion.v1,
          },
      );

      console.log('MongoDB connected');
  } catch (error) {
      console.log(error.message);
      process.exit(1);
  }
};

connectDB()

app.prepare().then(() => {
  const server = express()
  server.use('/api/auth', verifyToken)
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
