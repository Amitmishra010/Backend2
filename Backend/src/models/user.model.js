import mongoose,{Schema} from "mongoose"
import jsonwebtoken from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true

    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//cloudinary url
        required:true,
    },
    coverimage:{
        type:String,
    },
    watchhistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshtoken:{
        type:String,
    }
    
},{timestamps:true})
userSchema.pre("save",async function(next) {
    if(!this.isModified("password"))return ;
    
        this.password=await bcrypt.hash(this.password,10)
    return;
    
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=async function () {
    
    const token= jsonwebtoken.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        })   
        return token
        
    }
    userSchema.methods.generateRefreshToken=async function (){
        
        // console.log(process.env.REFRESH_TOKEN_SECRET,process.env.REFRESH_TOKEN_EXPIRY)
    const token= jsonwebtoken.sign(
        {
            _id:this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
  console.log(token)
    return token
}
export const User=mongoose.model("User",userSchema)
