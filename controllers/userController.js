const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('../libs/timeLib');
const response = require('../libs/responseLib')
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');
const passcheck = require('../libs/generatePasswordLib')
const token = require('../libs/tokenLib');
/* Models */
const userModel = mongoose.model('User')
const authModel = mongoose.model('Auth')
const notifyModel = mongoose.model('Notification')

/*----------------------------------------------------------------------------------------------------------------------------------------*/
//Logging in a registered User
let login = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                userModel.findOne({ email: req.body.email }, (err, userDetails) => {
                    if (err) {
                        let apiResponse = response.generate(true, 500, 'Failed To Find User Details', null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userDetails)) {
                         let apiResponse = response.generate(true, 404, 'No User Details Found', null)
                        reject(apiResponse)
                    } else {
                        resolve(userDetails)
                    }
                });

            } else {
                let apiResponse = response.generate(true, 400, '"email" parameter is missing', null)
                reject(apiResponse)
            }
        })
    }
    let validatePassword = (retrievedUserDetails) => {

        return new Promise((resolve, reject) => {
            passcheck.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 500, 'Login Failed', null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 400, 'Wrong Password.Login Failed', null)
                    reject(apiResponse)
                }
            })
        })
    }

    let generateToken = (userDetails) => {
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    let apiResponse = response.generate(true, 500, 'Failed To Generate Token', null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
    let saveToken = (tokenDetails) => {
        return new Promise((resolve, reject) => {
            authModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    let apiResponse = response.generate(true, 500, 'Failed To Generate Token', null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new authModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 500, 'Failed To Generate Token', null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 500, 'Failed To Generate Token', null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 200, 'Login Successful', resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.status(err.status)
            res.send(err)
        })
}


/*----------------------------------------------------------------------------------------------------------------------------------------*/


//Registering a new user
let signup = (req, res) => {
    userModel.findOne({ 'email': req.body.email }, (err, result) => {
        if (err) {
            let apiresponse = response.generate(true, 403, 'Error While Signing Up', err)
            res.send(response)
        }
        else if (!check.isEmpty(result)) {
            let apiresponse = response.generate(true, 403, 'User Already Exists', req.body.email)
            res.send(apiresponse)
        }
        else {
            let id = shortid.generate()
            let user = new userModel({
                userId: id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobile:req.body.mobile,
                email: req.body.email,
                password: passcheck.hashpassword(req.body.password),
            })
            user.save((err, result) => {
                if (err) {
                    let apiresponse = response.generate(true, 403, 'Error While Signing Up', err)
                    res.send(apiresponse)
                }
                else {
                    let notify=new notifyModel({
                        userId:result.userId,
                        notify:[]
                    })
                    notify.save((err,result)=>{
                        if(err){let apiresponse = response.generate(true, 403, 'Error While Signing Up', err)
                        res.send(apiresponse)
                    }
                        else{
                            let apiresponse = response.generate(false, 200, 'User Registered Successfully', result)
                    res.send(apiresponse)
                        }
                    })
                    
                }

            })
        }
    })

}
/*----------------------------------------------------------------------------------------------------------------------------------------*/
//Log out a registered user
let logout = (req, res) => {
    authModel.findOneAndRemove({ userId: req.params.userId }, (err, result) => {
        if (err) {
            logger.error(err.message, 'user Controller: logout', 10)
            let apiResponse = response.generate(true, 500, `error occurred: ${err.message}`, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 404, 'Already Logged Out or Invalid UserId', result)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 200, 'Logged Out Successfully', null)
            res.send(apiResponse)
        }
    })
}

/*----------------------------------------------------------------------------------------------------------------------------------------*/

//Getting list of all users
let getAllusersList = (req, res) => {
    userModel.find({}, { "userId": 1, "firstName": 1, "lastName": 1, "_id": 0 }, (err, result) => {
        if (err) {
            let apiresponse = response.generate(true, 403, 'Error while fetching Assigned Issues', err)
            res.send(apiresponse)
        }
        else {
            let apiresponse = response.generate(false, 200, 'List Of All Users', result)
            res.send(apiresponse)
        }
    })
}

/*----------------------------------------------------------------------------------------------------------------------------------------*/

//Getting username by Id
let getUserById = (req, res) => {
    if (req.params.userId == "null" || req.params.userId == "false" || req.params.userId == "undefined" || req.params.userId == null) {
        let apiresponse = response.generate(false, 403, 'User Name', "Not Yet Assigned")
        res.send(apiresponse)
    }
    else {
        userModel.findOne({ 'userId': req.params.userId }, { 'firstName': 1, 'lastName': 1, '_id': 0 }, (err, result) => {
            if (err) {
                let apiresponse = response.generate(true, 403, 'Error while fetching Assigned user', err)
                res.send(apiresponse)
            }
            else if(!check.isEmpty(result)) {
                let name = result.firstName + " " + result.lastName
                let apiresponse = response.generate(false, 200, 'User Name', name)
                res.send(apiresponse)
            }
        })
    }
}

/*----------------------------------------------------------------------------------------------------------------------------------------*/
//Checking for Social user's Email
let getUserByEmail=(req,res)=>{
    if (req.params.email == undefined || req.params.email == null) {
        let apiresponse = response.generate(false, 200, 'Email Not passed', null)
        res.send(apiresponse)
    }
    else {
        userModel.findOne({'email': req.params.email },(err, result) => {
            if (err) {
                let apiresponse = response.generate(true, 403, 'Error while fetching user', err)
                res.send(apiresponse)
            }
            else if(check.isEmpty(result)) {
                let apiresponse = response.generate(true, 404,"User Not exist", null)
                res.send(apiresponse)
            }
            else{
                let apiresponse=response.generate(false,200,"User Found",result)
                res.send(apiresponse)
            }
        })
    }
}

/*----------------------------------------------------------------------------------------------------------------------------------------*/

module.exports = {
    login: login,
    logout: logout,
    signup: signup,
    getAllusersList: getAllusersList,
    getUserById: getUserById,
    getUserByEmail:getUserByEmail
}