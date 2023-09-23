const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateUser = async (req, res, next) => {
  try {
    // Extract and verify the token from the request cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the token (you may use a try-catch block for this)
    const decodedToken = jwt.verify(token, `process.env.JWT_SECRET`);
    
    // Fetch the user (await the promise)
    const user = await User.findById(decodedToken.user.id);
    
    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Attach user information to the request for further processing
    req.user = { id: decodedToken.user.id };
    req.token = token;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors and send error responses
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authenticateUser;
