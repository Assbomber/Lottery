import pino from "pino";
import dayjs from "dayjs";

const logger=pino({
    prettyPrint:true,
    base:{
        pid:false
    },
    timestamp:()=>`time : ${dayjs()}`
})

export default logger;
