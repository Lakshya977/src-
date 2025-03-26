import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const UserSchema  = new Schema({
username : {
    type: String,
    required: true,
    unique: true,
    lowercase:true,
    trim:true,
    index:true
},
email : {
    type: String,
    required: true,
    required: true,
    unique: true,
    lowercase:true,
    trim:true,
    index:true,
},
fullname:{
    type: String,
    required: true,
    trim:true,
    index:true, 
    
},
avatar:{
    type: String,
    required: true,
    
},coverimage:{
    type: String,
    
},
watchhistory:[{
    type: Schema.Types.ObjectId,
    ref: 'video'
}],
password:{
    type: String,
    required: [true, 'Please provide a password'],
    trim:true,
    index:true, 
},
refresttoken:{
  type: "String"
}
},{timestamps:true})

UserSchema.pre('save',  async function(next){
   if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next()
})
UserSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}
UserSchema.methods.generateAccessToken = function(){
    // short lived access generateAccessToken
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname : this.fullname
    }, process.env.ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_EXPIRY
    })
}

UserSchema.methods.generateRefreshToken = function(){
 return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname : this.fullname
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

export const User = mongoose.model('user', UserSchema);