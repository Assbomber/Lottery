import express,{Router, Request, Response} from "express";
import User,{userValidator} from "../schemas/userSchema";
import jwt from "jsonwebtoken";
import joi, { Err } from "joi";
import bcrypt from "bcrypt";
import log from "../utils/logger";
const route:Router =express.Router();



//Register route
route.post("/register", (req:Request, res:Response) => {
    log.info("/register :Validating user Schema")
    const validationResult=userValidator.validate(req.body);
    if(validationResult.error) return res.status(400).send({error:validationResult.error.details[0].message});
    else{
             log.info("/register :Generating hash for password")
            bcrypt.hash(req.body.password,10,async (err:Error | undefined,hash:string)=>{
                if(err) return  res.status(500).send({error:err});
                const user=new User({
                    name:req.body.name,
                    password:hash,
                    email:req.body.email.toLowerCase(),
                });

                try{
                    log.info("/register :Saving user to DB")
                    const savedUser=await user.save();
                    const {_id,name,email,...others}=savedUser;
                    return res.status(200).send({_id,name,email});
                }catch(e:any){
                    if( e.code===11000) return res.status(400).send({error:"User already exists with same email"});
                    return res.status(500).send({error:e})
                }
        });
    }
});


//Login Route
route.post("/login",async (req:Request,res:Response) => {
    const loginSchema=joi.object({
        email:joi.string().email().required(),
        password:joi.string().required()
    })
    
    log.info("/login: Validating login schema")
    const validationResult=loginSchema.validate(req.body)
    if(validationResult.error) return res.status(400).send({error:validationResult.error.details[0].message});
    else{
        log.info("/login: login schema validation successful")
        try{
            log.info("/login: fetching user from DB");
            const dbResult=await User.findOne({email:req.body.email.toLowerCase()});
            if(!dbResult) return res.status(404).send({error:"No user found"});

            log.info("/login: comparing hash passwords");
            bcrypt.compare(req.body.password,dbResult ? dbResult.password:"",(err:Error | undefined,result:boolean)=>{
                if(!result) return res.status(400).send({error:"Bad credentials"});
                log.info("/login: Signing JWT");
                const token:string=jwt.sign({
                    id:dbResult?.id,
                    isAdmin:dbResult?.isAdmin
                },process.env.JWT_SECRET as string,{expiresIn:"1h"});
                return res.status(200).send({token:token});
            });

        }catch(e){
            log.error("/login: An Error occurred while returning token back to client");
            return res.status(500).send({e});
        }
    }
});

export default route;
