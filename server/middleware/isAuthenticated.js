import jwt from "jsonwebtoken";

// yahan par user ko verify karain ge.
const isAuthenticated = async (req,res,next)=>{
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({ // 
                success:false,
                message:"User not authenticated"
            })
        }
        const decode = await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            })
        } 
        req.id = decode.userId // const req = {id:""} --> ye hum ne aik empty object mai userId set kr di.
        next(); // agar sara code isAuthentication wala sahi rha to isAuthentication ko hum jahan use karai ge uss ke baad wali services ko next call karai ga, agar next ko call nahi ki to woh isAuthentication tak ruk jy ga.
    } catch (error) {
        console.log(error);        
    }
}

export default isAuthenticated;