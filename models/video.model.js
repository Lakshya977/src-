import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
const VideoSchema = new Schema({
    videofile:{
        type: String,
        required: true,
    }, title:{
        type:String,
        required:true,
        trim:true,
    },thumbnail:{
        type:String,
        required:true,
    },description:{
        type:String,
        required:true,
        trim:true,
    },duration:{
        type:Number,
        required:true,
    },views:{
        type:Number,
        default:0,
    },comments:[{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    ispulished:{
        type:Boolean,
        default:true,
    },owner:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
},{timestamps:true})
VideoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model('video', VideoSchema);