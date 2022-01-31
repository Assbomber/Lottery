import express,{Router} from "express";
import User,{userValidator} from "../schemas/userSchema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const route:Router =express.Router();



//Register route
route.post("/register", (req,res):void=>{

    //Validating user info
    const result=userValidator.validate(req.body);

    //If error while validating...send 400 response
    if(result.error) res.status(400).send({error:result.error.details});
    else{
            //generating hash for password
            bcrypt.hash(req.body.password,10,async (err:Error | undefined,hash:string):Promise<void>=>{

                //if error while generating hash...send response 500
                if(err) res.status(500).send({error:err});

                //else creating new user
                const user=new User({
                    name:req.body.name,
                    password:hash,
                    email:req.body.email
                });

                try{
                    //saving created user to DB
                    const savedUser=await user.save();

                    //extracting Id,name,email from saved user
                    const {_id,name,email,...others}=savedUser;

                    //sending status 200 and new user details to client
                    res.status(200).send({_id,name,email});
                }catch(e){
                    res.status(500).send({error:e})
                }
        });
    }
});


//Login Route
//implement here----------------


export default route;
