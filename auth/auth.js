const jwt = require('jsonwebtoken');

const admin = async (req, res, next) => {
    try{
        let token = req.headers["auth-token"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
                if (err) {
                    return res.status(408).json({
                        success: false,
                        message: "หมดเวลาใช้งานแล้ว หรือ สิทธิการใช้งานเฉพาะ พนักงานเซลล์ ",
                        logout: true,
                        description: "Request Timeout Or hr Only",
                    });
                }
                req.decoded = decoded;
                if(decoded.row === 'admin')
                {
                    next();
                }else{
                    return res.status(401).json({
                        success: false,
                        message: "ไม่มีสิทธิใช้งานฟังก์ชั่นนี้",
                        logout: true,
                        description: "Unauthorized",
                        token,
                      });
                }
                
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Token not provided Token ไม่ถูกต้อง",
                logout: false,
                description: "Unauthorized",
            });
        }
    }catch(error){
        return res.status(500).send({staus:false,error:error.message})
    }
}

const sale = async (req, res, next) => {
    try{
        let token = req.headers["auth-token"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
                if (err) {
                    return res.status(408).json({
                        success: false,
                        message: "หมดเวลาใช้งานแล้ว หรือ สิทธิการใช้งานเฉพาะ พนักงานเซลล์ ",
                        logout: true,
                        description: "Request Timeout Or hr Only",
                    });
                }
                req.decoded = decoded;
                if(decoded.row === 'sale')
                {
                    next();
                }else{
                    return res.status(401).json({
                        success: false,
                        message: "ไม่มีสิทธิใช้งานฟังก์ชั่นนี้",
                        logout: true,
                        description: "Unauthorized",
                        token,
                      });
                }
                
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Token not provided Token ไม่ถูกต้อง",
                logout: false,
                description: "Unauthorized",
            });
        }
    }catch(error){
        return res.status(500).send({staus:false,error:error.message})
    }

}

const bottle = async (req, res, next) => {
    try{
        let token = req.headers["auth-token"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
                if (err) {
                    return res.status(408).json({
                        success: false,
                        message: "หมดเวลาใช้งานแล้ว หรือ สิทธิการใช้งานเฉพาะ พนักงานเซลล์ ",
                        logout: true,
                        description: "Request Timeout Or hr Only",
                    });
                }
                req.decoded = decoded;
                
                if(decoded.row == 'bottle')
                {
                    next();
                }else{
                    return res.status(401).json({
                        success: false,
                        message: "ไม่มีสิทธิใช้งานฟังก์ชั่นนี้",
                        logout: true,
                        description: "Unauthorized",
                        token,
                      });
                }
                
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Token not provided Token ไม่ถูกต้อง",
                logout: false,
                description: "Unauthorized",
            });
        }
    }catch(error){
        return res.status(500).send({staus:false,error:error.message})
    }
}

const rider = async (req, res, next) => {
    try{
        let token = req.headers["auth-token"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
                if (err) {
                    return res.status(408).json({
                        success: false,
                        message: "หมดเวลาใช้งานแล้ว หรือ สิทธิการใช้งานเฉพาะ พนักงานเซลล์ ",
                        logout: true,
                        description: "Request Timeout Or hr Only",
                    });
                }
                req.decoded = decoded;
                if(decoded.row === 'rider')
                {
                    next();
                }else{
                    return res.status(401).json({
                        success: false,
                        message: "ไม่มีสิทธิใช้งานฟังก์ชั่นนี้",
                        logout: true,
                        description: "Unauthorized",
                        token,
                      });
                }
                
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Token not provided Token ไม่ถูกต้อง",
                logout: false,
                description: "Unauthorized",
            });
        }
    }catch(error){
        return res.status(500).send({staus:false,error:error.message})
    }
}

const report = async (req, res, next) => {
    try{
        let token = req.headers["auth-token"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
                if (err) {
                    return res.status(408).json({
                        success: false,
                        message: "หมดเวลาใช้งานแล้ว หรือ สิทธิการใช้งานเฉพาะ พนักงานเซลล์ ",
                        logout: true,
                        description: "Request Timeout Or hr Only",
                    });
                }
                req.decoded = decoded;
                if(decoded.row === 'report')
                {
                    next();
                }else{
                    return res.status(401).json({
                        success: false,
                        message: "ไม่มีสิทธิใช้งานฟังก์ชั่นนี้",
                        logout: true,
                        description: "Unauthorized",
                        token,
                      });
                }
                
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Token not provided Token ไม่ถูกต้อง",
                logout: false,
                description: "Unauthorized",
            });
        }
    }catch(error){
        return res.status(500).send({staus:false,error:error.message})
    }
}


const account = async (req, res, next) => {
    try{
        let token = req.headers["auth-token"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
                if (err) {
                    return res.status(408).json({
                        success: false,
                        message: "หมดเวลาใช้งานแล้ว หรือ สิทธิการใช้งานเฉพาะ พนักงานเซลล์ ",
                        logout: true,
                        description: "Request Timeout Or hr Only",
                    });
                }
                req.decoded = decoded;
                if(decoded.row === 'account')
                {
                    next();
                }else{
                    return res.status(401).json({
                        success: false,
                        message: "ไม่มีสิทธิใช้งานฟังก์ชั่นนี้",
                        logout: true,
                        description: "Unauthorized",
                        token,
                      });
                }
                
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Token not provided Token ไม่ถูกต้อง",
                logout: false,
                description: "Unauthorized",
            });
        }
    }catch(error){
        return res.status(500).send({staus:false,error:error.messageor})
    }
}

const transfer = async (req, res, next) => {
    try{
        let token = req.headers["auth-token"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
                if (err) {
                    return res.status(408).json({
                        success: false,
                        message: "หมดเวลาใช้งานแล้ว หรือ สิทธิการใช้งานเฉพาะ พนักงานเซลล์ ",
                        logout: true,
                        description: "Request Timeout Or hr Only",
                    });
                }
                req.decoded = decoded;
                if(decoded.row === 'transfer')
                {
                    next();
                }else{
                    return res.status(401).json({
                        success: false,
                        message: "ไม่มีสิทธิใช้งานฟังก์ชั่นนี้",
                        logout: true,
                        description: "Unauthorized",
                        token,
                      });
                }
                
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Token not provided Token ไม่ถูกต้อง",
                logout: false,
                description: "Unauthorized",
            });
        }
    }catch(error){
        return res.status(500).send({staus:false,error:error.message})
    }
}

const manager = async (req, res, next) => {
    try{
        let token = req.headers["auth-token"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
                if (err) {
                    return res.status(408).json({
                        success: false,
                        message: "หมดเวลาใช้งานแล้ว หรือ สิทธิการใช้งานเฉพาะ พนักงานเซลล์ ",
                        logout: true,
                        description: "Request Timeout Or hr Only",
                    });
                }
                req.decoded = decoded;
                if(decoded.row === 'manager')
                {
                    next();
                }else{
                    return res.status(401).json({
                        success: false,
                        message: "ไม่มีสิทธิใช้งานฟังก์ชั่นนี้",
                        logout: true,
                        description: "Unauthorized",
                        token,
                      });
                }
                
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Token not provided Token ไม่ถูกต้อง",
                logout: false,
                description: "Unauthorized",
            });
        }
    }catch(error){
        return res.status(500).send({staus:false,error:error.message})
    }
}

const analysis = async (req, res, next) => {
    try{
        let token = req.headers["auth-token"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
                if (err) {
                    return res.status(408).json({
                        success: false,
                        message: "หมดเวลาใช้งานแล้ว หรือ สิทธิการใช้งานเฉพาะ พนักงานเซลล์ ",
                        logout: true,
                        description: "Request Timeout Or hr Only",
                    });
                }
                req.decoded = decoded;
                if(decoded.row === 'analysis')
                {
                    next();
                }else{
                    return res.status(401).json({
                        success: false,
                        message: "ไม่มีสิทธิใช้งานฟังก์ชั่นนี้",
                        logout: true,
                        description: "Unauthorized",
                        token,
                      });
                }
                
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Token not provided Token ไม่ถูกต้อง",
                logout: false,
                description: "Unauthorized",
            });
        }
    }catch(error){
        return res.status(500).send({staus:false,error:error.message})
    }
}

const tool = async (req, res, next) => {
    try{
        let token = req.headers["auth-token"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
                if (err) {
                    return res.status(408).json({
                        success: false,
                        message: "หมดเวลาใช้งานแล้ว หรือ สิทธิการใช้งานเฉพาะ พนักงานเซลล์ ",
                        logout: true,
                        description: "Request Timeout Or hr Only",
                    });
                }
                req.decoded = decoded;
                if(decoded.row === 'tool')
                {
                    next();
                }else{
                    return res.status(401).json({
                        success: false,
                        message: "ไม่มีสิทธิใช้งานฟังก์ชั่นนี้",
                        logout: true,
                        description: "Unauthorized",
                        token,
                      });
                }
                
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Token not provided Token ไม่ถูกต้อง",
                logout: false,
                description: "Unauthorized",
            });
        }
    }catch(error){
        return res.status(500).send({staus:false,error:error.message})
    }

}



const all = async (req, res, next) => {
    let token = req.headers["auth-token"];
    if (token) {
        token = token.replace(/^Bearer\s+/, "");
        jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
        if (err) {
            return res.status(408).json({
            success: false,
            message: "หมดเวลาใช้งานแล้ว หรือ สิทธิการใช้งานเฉพาะ พนักงานเซลล์ ",
            logout: true,
            description: "Request Timeout Or hr Only",
            });
        }
        req.decoded = decoded;
        next();
        });
    } else {
        return res.status(401).json({
        success: false,
        message: "Token not provided Token ไม่ถูกต้อง",
        logout: false,
        description: "Unauthorized",
        });
    }
}

const auth = {
    admin,
    sale,
    bottle,
    rider,
    report,
    account,
    transfer,
    manager ,
    analysis,
    tool,
    all
}

module.exports = auth;