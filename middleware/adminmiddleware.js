const jwt = require('jsonwebtoken');
const checking =require('./middleware')
const JWT_SECRET =
  "jwtpassword";
// Middleware function to handle authentication and authorization for admin user
function adminAuth(req, res, next) {
  // Get JWT token from request body
  const token =req.header('token');

  try {
    // Verify JWT token and extract payload
    const payload = jwt.verify(token, JWT_SECRET);

    // Check if user is an admin
    if (payload.role !== 'admin' && checking  ) {
      return res.status(401).json({ message: 'Unauthorized' });
      
    }

    // If user is an admin, set user ID on request object for downstream middleware to use
    req.id = payload.id;

    // Call next middleware function in the chain
    next();
  } catch (error) {
    // If JWT verification fails, return 401 Unauthorized status code
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
module.exports=adminAuth