const mongoose = require('mongoose');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');

/* Models */
const notifyModel = mongoose.model('Notification')



//getting All Notifications for a user
let getNotifications=(req,res)=>{
    if(req.params.userId==null){
        let apiresponse=response.generate(true,403,"No User Id Passes","Pass The UserId")
        res.send(apiresponse)
    }
    notifyModel.findOne({'userId':req.params.userId},(err,result)=>{
        if(err) {
            let apiresponse = response.generate(true, 403, 'Error while editting Issue', err)
            res.send(apiresponse)
        }
        else {
            let apiresponse = response.generate(false, 200, 'All Notifications', result)
            res.send(apiresponse)
        }
    })
}


//reading all notification for an issue for a user
let readNotificationForIssue=(req,res)=>{
    notifyModel.update({'userId':req.params.userId},{$pull:{'notify':{'issueId':req.params.issueId}}},(err,result)=>{
        if(err) {
            let apiresponse = response.generate(true, 403, 'Error while fetching Notifications', err)
            res.send(apiresponse)
        }
        else {
            let apiresponse = response.generate(false, 200, 'All Notifications', result)
            res.send(apiresponse)
        } 
    })
}


//Marking all issues as read
let markAllRead=(req,res)=>{
    notifyModel.update({'userId':req.params.userId},{$set:{'notify':[]}},(err,result)=>{
        if(err) {
            let apiresponse = response.generate(true, 403, 'Error while Marking as read', err)
            res.send(apiresponse)
        }
        else {
            let apiresponse = response.generate(false, 200, 'All Notifications marked as read', result)
            res.send(apiresponse)
        } 
    })
}


module.exports={
    getNotifications:getNotifications,
    readNotificationForIssue:readNotificationForIssue,
    markAllRead:markAllRead
}