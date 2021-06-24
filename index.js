const cron = require('node-cron');
const fetch = require('node-fetch');
const express = require('express');
const mongoose = require('mongoose')
const Url = require('./models/url')


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



const port = 3000;

//database connection
const dburl = "mongodb://localhost:27017/urlmonitor"
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
//prepare socket
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

//setting urls 
app.post('/seturl', (req, res, next) => {
    let { url } = req.body
    const web = new Url({
        url,
        status: null,
        timeStamp: null
    })
    web.save((err) => {
        console.log("Url saved")
        if (err) throw err;
    });
    res.send('Send url list')
})

app.get('/geturl', async (req, res, next) => {
    try {
        let urls = await Url.find({})
        console.log(urls)
        res.send(urls)
    } catch (error) {
        res.send(error)
    }
})

app.listen(port, console.log(`App listerning on port ${port}`))