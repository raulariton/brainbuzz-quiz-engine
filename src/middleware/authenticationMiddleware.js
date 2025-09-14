const API_KEY = process.env.API_KEY;

export function authenticateApiKey(req, res, next) {
  const apiKey = req.headers.authorization;

  if (!apiKey || apiKey !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}