const mongoose = require('mongoose');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('./../libs/checkLib');

/* Models */
const watchModel = mongoose.model('Watcher')

/*----------------------------------------------------------------------------------------------------------------------------------------*/

//Adding A user To WatchList
let addToWatch = (req, res) => {
    watchModel.findOneAndUpdate({ 'issueId': req.params.issueId }, { $push: { watcher: req.params.userId } }, (err, result) => {
        if (err) {
            let apiresponse = response.generate(true, 403, 'Error While fetching Issue details', err)
            res.send(apiresponse)
        }
        else if (check.isEmpty(result)) {
            let watcher = new watchModel({
                issueId: req.params.issueId,
                watcher:req.params.userId.split(",")
            })

            watcher.save((err, result1) => {
                if (err) {
                    let apiresponse = response.generate(true, 403, 'Error While Adding To watchList', err)
                    res.send(apiresponse)
                }
                else {
                    let apiresponse = response.generate(false, 200, 'Added To watchList', result1)
                    res.send(apiresponse)
                }

            })

        }
        else {
            let apiresponse = response.generate(false, 200, 'Added To watchList', result)
            res.send(apiresponse)
        }

    })
}
/*----------------------------------------------------------------------------------------------------------------------------------------*/

//removing A user From Watch List
let removeFromWatch = (req, res) => {
    console.log(req.params.issueId+" "+req.body.userId)
    watchModel.update({ 'issueId': req.params.issueId }, { $pull: { 'watcher': req.params.userId } },(err, result) => {
        if (err) {
            let apiresponse = response.generate(true, 403, 'Error While Adding To watchList', err)
            res.send(apiresponse)
        }
        else {
            let apiresponse = response.generate(false, 200, 'Removed From watchList', result)
            res.send(apiresponse)
        }


    })
}

/*----------------------------------------------------------------------------------------------------------------------------------------*/


//Checking If a user is a watcher for an issue
let isWatcher = (req, res) => {
    watchModel.findOne({ 'watcher': req.params.userId,'issueId': req.params.issueId }, (err, result) => {
        if (err) {
            let apiresponse = response.generate(true, 403, 'Error While fetching watchList', err)
            res.send(apiresponse)
        }
        else if (result===null || result ===undefined) {
            let apiresponse = response.generate(false, 200, 'IsWatcher', false)
            res.send(apiresponse)
        }
        else {
            let apiresponse = response.generate(false, 200, 'IsWatcher', true)
            res.send(apiresponse)
        }


    })
}

/*----------------------------------------------------------------------------------------------------------------------------------------*/
//getting watchlist for an issue
let getAllWatchers=(req,res)=>{
    watchModel.findOne({'issueId':req.params.issueId},{'watcher':1,"_id":0},(err,result)=>{
        if (err) {
            let apiresponse = response.generate(true, 403, 'Error While fetching watchers', err)
            res.send(apiresponse)
        }
        else {
            let apiresponse = response.generate(false, 200, 'Issue Watchers', result.watcher)
            res.send(apiresponse)
        }
    })
}

module.exports = {
    addToWatch: addToWatch,
    removeFromWatch: removeFromWatch,
    isWatcher: isWatcher,
    getAllWatchers:getAllWatchers,
}
