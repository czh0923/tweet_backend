const {myTables} = require("./backendConstants.js");

const express = require("express");
const cors = require("cors");
// require("dotenv").config();
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

app.get("/get/:userName/:amount", async (req, res) => {
    let targetTwitterUserTable = myTables.baseMain(req.params.userName);
    try {
        var records = await targetTwitterUserTable.select({maxRecords: 3, view: "Grid view"}).firstPage();
    } catch (e) {
        console.log(e);
    }
    
    let retrieved_record_id = [];
    let retrieved_record_name = [];
    records.forEach(function(record) {
        retrieved_record_id.push(record.getId());
        retrieved_record_name.push(record.get("Name"));
    })

    res.send({id: retrieved_record_id, names: retrieved_record_name});
})

// app.listen(5500, "127.0.0.1");
app.listen(process.env.PORT || 5500);