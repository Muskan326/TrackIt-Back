// importing mongoose module
const mongoose = require('mongoose')
const time=require('../libs/timeLib')
// import schema 
const Schema = mongoose.Schema;

let issueSchema = new Schema(
    {
        issueId: {
            type: String,
            unique: true
        },
        title: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        author: {
            type: String,
            default: ''
        },
        state:{
            type:String,
            default:'BackLog'
        },
        assignedTo:{
            type:String
        },
        files:[],
        created: {
            type: Date,
            default: time.now
        }, 

        lastModified: {
            type: Date,
            default: time.now
        }
    }
)


let userSchema=new Schema(
{
    userId:{
        type:String,
        unique:true,
    },
    firstName:{
        type:String,
        default:''
    },
    lastName:{
        type:String,
        default:''
    },
    mobile:{
        type:Number,
        default:0000000000
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        default:''
    },
    lodgedIssue:[],
    
    assignedIssue:[]
}
)

let authSchema=new Schema({
    userId: {
      type: String
    },
    authToken: {
      type: String
    },
    tokenSecret: {
      type: String
    },
    tokenGenerationTime: {
      type: Date,
      default: time.now()
    }
  })


let watcherSchema=new Schema(
    {
        issueId:{
            type:String,
            unique:true
        },
        watcher:[]
    }
)

let commentSchema=new Schema({
    commentId:{
        type:String,
        unique:true
    },
    userId:{
        type:String
    }
    ,
    issueId:{
        type:String
    },
    comment:{
        type:String
    },
    date:{
        type:Date,
        default:time.now()
    }
})


let notificationSchema=new Schema({
    userId:{
        type:String,
    },
    notify:[]
})

mongoose.model('Issue', issueSchema);
mongoose.model('User', userSchema);
mongoose.model('Auth', authSchema);
mongoose.model('Watcher', watcherSchema);
mongoose.model('Comment',commentSchema);
mongoose.model('Notification',notificationSchema)