import express,{Router,Response} from "express";
import Tickets,{ticketValidator} from "../schemas/ticketSchema";
import log from "../utils/logger";
import {authorizeTokenOnlyUserAndAdmin,authorizeTokenOnlyAdmin,customRequest} from "../utils/authorizer";
const route:Router=express.Router();

//Creating Ticket
route.post("/",authorizeTokenOnlyAdmin,async (req:customRequest, res:Response)=>{
    
    log.info("/tickets: Validating request body")
    const validationResult=ticketValidator.validate(req.body);
    if(validationResult.error) return res.status(400).send({error:validationResult.error.details[0].message});
    else{
        log.info("/tickets: request body validation succeeded");
        const ticket=new Tickets({...req.body,buyPrice:req.body.winningSum/5});
        try{
            log.info("Saving ticket to DB")
            const savedTicket=await ticket.save();
            res.status(200).send({ticket:savedTicket})
        }catch(e:any){
            log.error("Error while saving ticket to DB");
            res.status(500).send({error:e.message});
        }
    }
})

//Update a Ticket, (Only Admin allowed)
//IMplementation here---------





export default route;