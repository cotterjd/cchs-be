export const cors = (req, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": process.env.FE_URL,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": ["GET", "POST", "PUT", "DELETE"]
  });
  if (req.method === "OPTIONS") return res.end("");
  next();
}