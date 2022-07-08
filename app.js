const express = require("express");
require("dotenv").config();

console.log("here?");
console.log(process.env.API_KEY);

const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.API_KEY}).base(process.env.BASE_ID);
const table = base('testing');

const app = express();


// app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("hello");
})

app.get("/fetch", async (req, res) => {
    const records = await table.select({maxRecords: 3, view: "Grid view"}).firstPage();

    let retrieved_record_id = [];
    let retrieved_record_name = [];
    records.forEach(function(record) {
        retrieved_record_id.push(record.getId());
        retrieved_record_name.push(record.get("Name"));
    })

    res.send({id: retrieved_record_id, names: retrieved_record_name});
})


// app.listen(5500, "127.0.0.1");
app.listen(5500);