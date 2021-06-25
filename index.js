const cron = require('node-cron');
const fetch = require('node-fetch');
const express = require('express');
const mongoose = require('mongoose')
var moment = require('moment');
const Url = require('./models/Url')
const UrlSuccess = require('./models/UrlSuccess')
const UrlFail = require('./models/UrlFail')
var urlmon = require('./lib/urlmon');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3000;

//Database connection
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


let urls = [
    "https://www.google.com",
    "http://crushit-compiler.herokuapp.com",
    "http://www.example.org"
]

//monitoring
urls.forEach((url) => {
    var website = new urlmon({
        url: url,
        interval: 2
    });

    website.on('error', (data) => {
        website.stop();
        console.log(data);
    })

    website.on('available', (data) => {
        UrlSuccess({
            url: data.url,
            status: data.code,
            statusText: data.message,
            timeStamp: Date.now()
        }).save((err) => {
            if (err) throw err;
            console.log(data)
        })
    })

    website.on('unavailable', (data) => {
        UrlFail({
            url: data.url,
            status: data.code,
            statusText: data.message,
            timeStamp: Date.now()
        }).save((err) => {
            if (err) throw err;
            console.log(data)
        })
    })

    website.start();
})


//check url every 2 minutes 
// cron.schedule('* * * * * *', async () => {
//     try {
//         let count = await UrlFail.countDocuments()
//         if (count > 3) {
//             let lasteEntry = await UrlFail.find().sort({ $natural: -1 }).limit(1)
//             let lastThreeEntry = await UrlFail.find({ url: lasteEntry[0].url }).sort({ $natural: -1 }).limit(3)
//             if (lastThreeEntry) {
//                 console.log("Time One: " + Math.round((lastThreeEntry[0].timeStamp - lastThreeEntry[1].timeStamp) / (1000 * 60)))
//                 console.log("Time Two: " + Math.round((lastThreeEntry[1].timeStamp - lastThreeEntry[2].timeStamp) / (1000 * 60)))
//             }
//         }

//     } catch (error) {
//         console.error(error)
//     }
// })



app.post('/seturl', (req, res, next) => {
    let { url } = req.body
    const web = new Url({
        url
    })
    web.save((err) => {
        console.log("Url saved")
        if (err) throw err;
    });
    res.send('Send url list')
})

app.listen(port, console.log(`App listerning on port ${port}`))