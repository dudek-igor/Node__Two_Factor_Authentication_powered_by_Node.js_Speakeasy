# Two Factor Authentication powered by Node.js Speakeasy

> Implementing a time-based one-time password(TOTP) using the Speakeasy library. \
> Based on [LogRocket Article](https://blog.logrocket.com/implementing-two-factor-authentication-using-speakeasy/)

#### Usage:

1. Clone repo - `git clone`
2. Install dependencies & start server - `npm i && npm start`,
3. Register 2FA module - post on `http://localhost:5000/api/register` via Postman or Insomnia,
4. In response we received a secret. We record this secret in the third part software - e.g. Google Authencation or [Link](https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai?hl=pl)
5. We received a TOKEN,
6. Next send a token to backend to verifed - `http://localhost:5000/api/verify`,
7. Well done. Now we have set 2FA and after all credensial operacion on account we can ask user for token and send them to validate -`http://localhost:5000/api/validate`.

#### Packages:

- Express,
- Node-json-db,
- Speakeasy,
- uuid,
- Nodemon.
