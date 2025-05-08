const memberCheck = (req, res, next) => {
    // console.log("req.user mila kya memberCheck me:", req.user);
    if (req.user && req.user.role === 'member') {
     
      next();
    } else {
        console.log("Access denied. role mila:", req.user?.role); 
      return res.status(403).json({ message: 'Access denied. Only members allowed.' });
    }
  };
  
  module.exports = memberCheck;
  