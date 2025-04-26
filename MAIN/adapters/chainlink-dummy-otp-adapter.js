// adapters/chainlink-dummy-otp-adapter.js
const express    = require('express');
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');

const app = express();
app.use(bodyParser.json());

const otps = {}; // txnId → otp

app.post('/', (req, res) => {
  const { endpoint, aadhaar } = req.body;
  if (endpoint === 'generate') {
    const txnId = uuid();
    const otp   = Math.floor(100000 + Math.random() * 900000).toString();
    otps[txnId] = otp;
    console.log(`[Adapter] Generated OTP ${otp} for Aadhaar ${aadhaar}`);
    return res.json({ jobRunID: req.body.id, data: { otp }, status: 'success' });
  }
  return res.status(400).json({
    jobRunID: req.body.id,
    status:   'errored',
    error:    'Unknown endpoint'
  });
});

app.listen(7789, () => console.log('🔗 Chainlink OTP adapter listening on http://0.0.0.0:7789'));