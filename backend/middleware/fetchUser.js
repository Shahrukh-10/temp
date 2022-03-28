const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token")
  if (!token) {
      res.status("401").send({error:"Please authenticate using a valid token."})
  }try {
      
      
      const data = jwt.verify(token,secret)
      console.log(data.user);
      req.user = data.user;
      next();
    } catch (error) {
        res.status(500).send({error:"Some error occured"})
    }
};

module.exports = fetchUser;
