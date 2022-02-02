import express,{Request, Response,NextFunction} from "express";
import jwt, { Secret } from "jsonwebtoken";
import log from "./logger";


interface customRequest extends Request {
    user?:any;
}

const verifyToken=(req:customRequest, res:Response,next:NextFunction)=>{
    
    log.info("Authorizer: Looking for token in headers")
    const authHeader:string| undefined =req.headers.token as string;
    if(!authHeader) return res.status(401).send({error:"You are not authenticated"});
    else{
        log.info("Authorizer: Token found, extracting authToken")
        const authToken:string=authHeader.split(" ")[1];

        log.info("Authorizer: Verifying authToken")
        jwt.verify(authToken,process.env.JWT_SECRET as string,(err,userData)=>{
            if(err) return res.status(401).send({error:"Token not valid"});
            else{
                req.user=userData;
                next();
            }
        })
    }
}

//Authorized only for admin
const authorizeTokenOnlyAdmin=(req:customRequest, res:Response, next:NextFunction) => {
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            log.info("Authorizer: Authorized User")
             next();
        }
        else return res.status(401).send({error:"You are not authorized to make this request"});
    });
}

// Authorized for same user or admin
const authorizeTokenOnlyUserAndAdmin=(req:customRequest, res:Response, next:NextFunction) => {
    verifyToken(req, res, ()=>{
        if(req.params.id===req.user.id || req.user.isAdmin){
            log.info("Authorizer: Authorized User")
             next();
        }
        else return res.status(401).send({error:"You are not authorized to make this request"});
    });
}

export {authorizeTokenOnlyUserAndAdmin,authorizeTokenOnlyAdmin,customRequest};