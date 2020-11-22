const express = require('express');
const speakeasy = require('speakeasy');
const uuid = require('uuid');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

// Initial App
const app = express();
// Initial DB
const db = new JsonDB(new Config('myDataBase', true, false, '/'));

//Middleware
app.use(express.json());

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the two factor authenticaation example' });
});
// Register 2FA module in user acc & create temp secret as base32 version
app.post('/api/register', (req, res) => {
  try {
    const id = uuid.v4();
    const path = `/user/${id}`;
    const temp_secret = speakeasy.generateSecret();
    // push to db
    db.push(path, { id, temp_secret });
    res.json({ id, secret: temp_secret.base32 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error generating the secret' });
  }
});

// Now in Fronted side we need to generate Authenticator token via Google Authencation

// We send a token to backend to verifed

// Verify token and make secret permission
app.post('/api/verify', (req, res) => {
  const { token, userId } = req.body;
  try {
    const path = `/user/${userId}`;
    const user = db.getData(path);
    // We have temporary secret
    const { base32: secret } = user.temp_secret;
    const verifed = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
    });
    if (verifed) {
      db.push(path, { id: userId, secret: user.temp_secret });
      res.json({ verifed: true });
    } else {
      res.json({ verifed: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error finding user' });
  }
});

// Now we have set 2FA and after all credensial operacion on account we can ask user for token and send them to validate.

// Validate token
app.post('/api/validate', (req, res) => {
  const { token, userId } = req.body;
  try {
    const path = `/user/${userId}`;
    const user = db.getData(path);
    // Now we have only secret
    const { base32: secret } = user.secret;
    const tokenValidates = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1,
    });
    if (tokenValidates) {
      res.json({ validated: true });
    } else {
      res.json({ validated: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error finding user' });
  }
});

// Listening and PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
