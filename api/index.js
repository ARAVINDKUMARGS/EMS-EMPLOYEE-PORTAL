import app from "../backend/server.js";

const handler = (req, res) => {
  const expressApp = app.default || app;
  return expressApp(req, res);
};

export default handler;

