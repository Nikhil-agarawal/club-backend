const jwt=require('jsonwebtoken')
const JWT_SECRET =
  "jwtpassword";
module.exports=function(req,res,next){
  try{
    let token=req.header('token')

    if(!token){
      return res.status(400).send('Token not found');
    }
    let decode =jwt.verify(token,JWT_SECRET)
    req.user=decode.user
    next()
    }
    catch(err){
      console.log(err)
      return res.status(500).send('invalid token')
    }
  }
