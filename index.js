const cron = require('node-cron');
const fetch = require('node-fetch');
const express = require('express');
const mongoose = require('mongoose')
const Url = require('./models/Url')
const UrlStatus = require('./models/UrlStatus')
/*
    ...................TODOS..................
    5.from scheduler send status data to database
    6.get data from mongo 
    4.Test for for url availability on schedule
    3.Use web socket to send data to client on real time without reloading
*/

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

cron.schedule('*/2 * * * * *', async () => {
    try {
        const response = await fetch('http://www.localhost:3000/geturl');
        const websites = await response.json();
        if (websites) {
            websites.forEach(async (web) => {
                try {
                    const webStatus = await fetch(web.url)
                    let res = await fetch("http://www.localhost:3000/seturlstatus", {
                        method: "post",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            url: webStatus.url,
                            status: webStatus.status,
                            timeStamp: Date.now()
                        })
                    })
                    console.log(res)
                } catch (error) {
                    console.error(error);
                }
            });
        }
    } catch (error) {
        console.log(error)
    }
    console.log("Schedulling")
});

//get data from database status data and analyse
//send report time stamp if there are 3 consecutive fials on a website.


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

app.post('/seturlstatus', (req, res, next) => {
    let { url, status } = req.body
    const web = new UrlStatus({
        url,
        status,
        timeStamp: null
    })
    web.save((err) => {
        if (err) throw err;
    });
    res.send('Send urls status')
})

app.get('/geturl', async (req, res, next) => {
    try {
        let urls = await Url.find({})
        res.send(urls)
    } catch (error) {
        res.send(error)
    }
})

app.get('/geturlstatus', async (req, res, next) => {
    try {
        let urlstatus = await UrlStatus.find({})
        res.send(urlstatus)
    } catch (error) {
        res.send(error)
    }
})

app.listen(port, console.log(`App listerning on port ${port}`))