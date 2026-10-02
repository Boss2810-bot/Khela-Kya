Khela Kya — Local auth server and usage

This workspace contains a minimal static site and a simple Node.js auth server with SQLite for demo purposes.

Quick start (Windows):

1. Install Node.js (>=16) if you don't have it.
2. In the project folder, install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The server will listen on `http://localhost:5000` by default and serves the static files from the project root.

Endpoints:
- `POST /api/signup` {name,email,password}
- `POST /api/login` {email,password}
- `GET /api/profile` (Authorization: Bearer <token>)

Notes:
- This is a minimal demo. For production use, set the `KK_SECRET` environment variable, enable HTTPS, and secure database storage.
- Use `PORT` to change the server port.
- Use `CORS_ORIGIN` with a comma-separated allowlist if you need to restrict browser origins.
- The `data/auth.db` file will be created automatically.