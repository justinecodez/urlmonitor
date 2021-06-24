const cron = require('node-cron');
const fetch = require('node-fetch');
const express = require('express');
const mongoose = require('mongoose')
const Url = require('./models/url')

/*
    ...................TODOS..................
    1.send url list to database
    2.get url list from database 
    5.from scheduler send data to database using socket;
    6.get data from database and analyse it, if website was not available in previous 6 minutes send report via email.
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

const data = []

cron.schedule('*/10 * * * * *',() => {
    try {
        async function fetchWebsiesJSON() {
            const response = await fetch('http://www.localhost:3000/geturl');
            const websites = await response.json();
            return websites;
        }
        fetchWebsiesJSON().then((websites)=>{
            websites.forEach(async (web) => {
                let res = await fetch(web.url)
                data.push({
                    url: res.url,
                    status: res.status,
                    timeStamp: Date.now()
                })
            });
        })   
    } catch (error) {
       console.log(error)
    }
    console.log(data)
});

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
        res.send(urls)
    } catch (error) {
        res.send(error)
    }
})

app.listen(port, console.log(`App listerning on port ${port}`))