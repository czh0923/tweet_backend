const {myTables} = require("./backendConstants.js");
const {getRandomTweetMain} = require("./getRandomTweets.js");
console.log(getRandomTweetMain);

// setting up app
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("hello");
})

// app.get("/fetch", async (req, res) => {
//     const records = await table.select({maxRecords: 3, view: "Grid view"}).firstPage();

//     let retrieved_record_id = [];
//     let retrieved_record_name = [];
//     records.forEach(function(record) {
//         retrieved_record_id.push(record.getId());
//         retrieved_record_name.push(record.get("Name"));
//     })

//     res.send({id: retrieved_record_id, names: retrieved_record_name});
// })

app.get("/get/:userName/:originalAmount/:likedAmount", async (req, res) => {
    let targetTweetsTable = myTables.baseMain(req.params.userName);
    try {
        var records = await getRandomTweetMain(req.params.originalAmount, req.params.likedAmount, req.params.userName, targetTweetsTable);

        console.log(records[0], records[1]);
    } catch (e) {
        console.log(e);
    }
    
    let originalTweetRecords = records[0];
    let likedTweetRecords = records[1];


    let retrievedOriginalRecordContent = [];
    originalTweetRecords.forEach(function(record) {
        retrievedOriginalRecordContent.push(record.get("content"));
    })

    let retrievedLikedRecordContent = [];
    likedTweetRecords.forEach(function(record) {
        retrievedLikedRecordContent.push(record.get("content"));
    })

    res.send({retrievedOriginalRecordContent, retrievedLikedRecordContent});
})

// app.listen(5500, "127.0.0.1");
app.listen(process.env.PORT || 5500);