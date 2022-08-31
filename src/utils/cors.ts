export const cors = (req, res, next) => {
  res.header({
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": ["GET", "POST", "PUT", "DELETE"]
  });
  const origin = req.headers.origin || "*"
  const allowedOrigins = process.env.FE_URL.split(`,`) 
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }
  if (req.method === "OPTIONS") return res.end("");
  next();
}