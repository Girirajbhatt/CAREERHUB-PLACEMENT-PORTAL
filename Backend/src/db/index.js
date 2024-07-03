import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"

const connectDB = async () =>{
    try {
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MONGODB CONNECTION SUCCESSFULL : ",connectionInstance.connection.host);

    } catch (error) {
        
        console.log("MONGODB CONNECTION FAILED : ",error);

        process.exit();
    }
}

export default connectDB;