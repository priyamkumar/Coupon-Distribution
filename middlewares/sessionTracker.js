const { v4: uuidv4 } = require("uuid");

const sessionTracker = (req, res, next) => {
  let sessionId = req.cookies.sessionId;
  if (!sessionId) {
    sessionId = uuidv4();
    
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true
    });
  }
  req.sessionId = sessionId;
  next();
};
module.exports = { sessionTracker };
