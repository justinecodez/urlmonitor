const cron = require('node-cron');
const fetch = require('node-fetch');
const express = require('express');
const mongoose = require('mongoose')
const app = express();
const port = 3000;

//database connection
const dburl = "mongodb://localhost:27017/mdn"
mongoose
    .connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
        console.log("Unable to connect to MongoDB Atlas!");
        console.error(error);
    });

//send url list to database
//get url list from database 
//Test for for url availability on schedule
//from scheduler send data to database using socket or windows event;
//get data from database and analyse it, if website was not available in previous 6 minutes send report via email.

let websites = [
    {
        url: "https://www.github.com"
    },
    {
        url: "http://www.facebook.com"
    },
    {
        url: "http://www.twitter.com"
    }
]

const data = []

// cron.schedule('* * * * * *', () => {
//     websites.forEach(async (web) => {
//         let res = await fetch(web.url)
//         data.push({
//             url: res.url,
//             status: res.status,
//             timeStamp: Date.now()
//         })
//     });

//     console.log(data)
// });

app.post('/seturl', (req, res, next) => {
    res.send('Send url list')
})

app.get('/geturl', (req, res, next) => {
    res.send('Ger url list')
})

app.listen(port, console.log(`App listerning on port ${port}`))