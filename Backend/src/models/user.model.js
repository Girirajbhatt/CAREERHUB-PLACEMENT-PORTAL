import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    userName: { 
        type: String, 
        required: [true, "Username is required"] ,
        lowercase : true,
        trim : true,
        index : true,
    },
    email: { 
        type: String, 
        required: [true, "Email is required"] ,
        unique: [true, "Email already exists"],
        lowercase : true,
        trim : true,
        index : true,
    },
    password: { 
        type: String, 
        required: [true, "Password field should not be empty"] ,
    },
    contactNo: { 
        type: Number, 
        required: [true, "Contact Number field should not be empty"] ,
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ['student', 'recruiter', 'admin'],
        default: 'student',
    },
    resume:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
    },
    refreshToken: {
        type: String,
    },
},{timestamps : true});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            userName : this.userName,
            email: this.email,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id, 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);