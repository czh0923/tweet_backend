const {myTables} = require("./backendConstants.js");
const {getRandomTweetMain} = require("./getRandomTweets.js");
const {shuffleArray} = require("./getRandomTweets.js");
const {updateResult} = require("./storeResultAndUpdateVisited.js");
console.log("Running app.js...");

// setting up app
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("hello");
})

app.get("/getTwitterUser/:presentedUserNumber", async (req, res) => {

    const table = myTables.finalTable;

    var recordIDAndUserName = []; // [[reocrdID, userName], [], []]

    table.select({
        view: "Grid view",
        filterByFormula: "{visited_times} < 5"
    }).eachPage(function page(records, fetchNextPage) {
    
        records.forEach(function(record) {
            recordIDAndUserName.push([record.getId(), record.get('Name')]);
        });

        fetchNextPage();
    
    }, function done(err) {
        if (err) { console.error(err); return; }

        recordIDAndUserName = shuffleArray(recordIDAndUserName);

        recordIDAndUserName = recordIDAndUserName.slice(0, parseInt(req.params.presentedUserNumber));

        let tweetUserRecordIds = [];
        let tweetUserNames = [];

        for (let i = 0; i < recordIDAndUserName.length; i++) {
            tweetUserRecordIds.push(recordIDAndUserName[i][0]);
            tweetUserNames.push(recordIDAndUserName[i][1]);

        }

        res.send({tweetUserRecordIds, tweetUserNames});
    });

})

app.get("/get/:userName/:originalAmount/:likesAmount", async (req, res) => {
    let targetTweetsTable = myTables.baseMain(req.params.userName);
    try {
        var records = await getRandomTweetMain(req.params.originalAmount, req.params.likesAmount, req.params.userName, targetTweetsTable);

        // console.log(records[0], records[1]);
    } catch (e) {
        console.log(e);
    }
    
    let originalTweetRecords = records[0];
    let likesTweetRecords = records[1];


    let retrievedOriginalRecordContent = [];
    originalTweetRecords.forEach(function(record) {
        retrievedOriginalRecordContent.push(record.get("content"));
    })

    let retrievedLikesRecordContent = [];
    likesTweetRecords.forEach(function(record) {
        retrievedLikesRecordContent.push(record.get("content"));
    })

    res.send({retrievedOriginalRecordContent, retrievedLikesRecordContent});
})


app.get("/submit/:tweetUserRecordIds/:participantInput/:participantID", async (req, res) => {

    let tweetUserRecordIds = JSON.parse(req.params.tweetUserRecordIds);

    let participantInput = JSON.parse(req.params.participantInput);
    let participantID = req.params.participantID;

    try {
        await updateResult(tweetUserRecordIds, participantInput, participantID, myTables.finalTable);
    } catch (e) {
        console.log(e);
    }

    res.status(200).send("ok");

})

// app.listen(5500, "127.0.0.1");
app.listen(process.env.PORT || 5500);

