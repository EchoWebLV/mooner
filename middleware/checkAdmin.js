// middlewares/checkAdmin.js
export default function checkAdmin(req, res, next) {
    const { username } = req.headers;
  
    // Replace this with your actual admin check logic
    if (username === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  }
  