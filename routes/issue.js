const appConfig = require("./../config/appConfig")
const attach = require('../controllers/addFile')
const remove=require('../controllers/removeFiles')
const issueController = require('./../controllers/issueController')
const userController=require('./../controllers/userController')
const watchController=require('./../controllers/watchController')
const commentController=require('./../controllers/commentController')
const notificationController=require('./../controllers/notificationController')


let setRouter = (app) => {
    let baseUrl = appConfig.apiVersion + '/users';
    app.post(baseUrl + '/login', userController.login)

    app.post(baseUrl + '/signup', userController.signup)

    app.get(baseUrl + '/all', userController.getAllusersList)

    app.get(baseUrl + '/issues/all', issueController.getAllIssues)

    app.get(baseUrl+'/view/:issueId?',issueController.getIssueDetails)

    app.post(baseUrl+'/edit/:issueId',issueController.editIssue)

    app.post(baseUrl+'/addComment',commentController.addComment)

    app.get(baseUrl+'/deleteComment/:commentId',commentController.deleteComment)

    app.get(baseUrl+'/getComments/:issueId',commentController.getAllComments)

    app.get(baseUrl+'/addWatch/:issueId/:userId',watchController.addToWatch)

    app.get(baseUrl+'/isWatcher/:issueId/:userId',watchController.isWatcher)

    app.get(baseUrl+'/allwatchers/:issueId',watchController.getAllWatchers)

    app.get(baseUrl+"/removeWatch/:issueId/:userId",watchController.removeFromWatch)

    app.get(baseUrl+'/delete/:issueId',issueController.deleteIssue)

    app.get(baseUrl + '/dashboard', issueController.getIssuesStat)

    app.get(baseUrl+'/:userId',userController.getUserById)

    app.get(baseUrl+'/email/:email',userController.getUserByEmail)

    app.get(baseUrl+'/logout/:userId',userController.logout)

    app.post(baseUrl + '/dashboard/lodge', issueController.lodgeissue)

    app.get(baseUrl + '/dashboard/assigned/:userId', issueController.getAssignedIssues)

    app.get(baseUrl + '/dashboard/lodged/:userId', issueController.getLodgedIssues)

    app.get(baseUrl+'/dashboard/notifications/:userId',notificationController.getNotifications)

    app.get(baseUrl+'/dashboard/:issueId/:userId',notificationController.readNotificationForIssue)

    app.get(baseUrl+'/markAsRead/:userId',notificationController.markAllRead)

    app.post(baseUrl+'/upload', attach.array('file', 1), (req, res) => {res.send({ file: req.file });});    

    app.post(baseUrl+'/delete',remove.deleteFile)
    
    app.get(baseUrl+'/delete/:issueId/:key',issueController.deleteFilekey)
}// end setRouter function 

module.exports = {
    setRouter: setRouter
}