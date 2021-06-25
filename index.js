const express = require('express');
const mongoose = require('mongoose')
const Url = require('./models/Url')
const UrlSuccess = require('./models/UrlSuccess')
const UrlFail = require('./models/UrlFail')
var urlmon = require('./lib/urlmon');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3000;

//Database connection
const dburl = "mongodb+srv://justine:kox6BpOX6i9SCnwK@cluster0.stbf3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
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

//monitoring each url
urls.forEach((url) => {
    var website = new urlmon({
        url: url,
        interval: 2
    });

    website.on('available', (data) => {
        console.log({
            SuccessSatusReport: {
                url: data.url,
                status: data.code,
                statusText: data.message
            }
        })
        UrlSuccess({
            url: data.url,
            status: data.code,
            statusText: data.message,
            timeStamp: Date.now()
        }).save((err) => {
            if (err) throw err;
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
        })
    })

    website.start();
})


//Checking for 3 consercutive fails and sending report to console.
async function monitorListingsUsingEventEmitter() {
    const changeStream = UrlFail.watch();
    changeStream.on('change', async (changes) => {
        try {
            let count = await UrlFail.countDocuments()
            if (count > 3) {
                let lastEntry = await UrlFail.find().sort({ $natural: -1 }).limit(1)
                let last3E = await UrlFail.find({ url: lastEntry[0].url }).sort({ $natural: -1 }).limit(3)

                if (last3E) {
                    let time1 = Math.round((last3E[0].timeStamp - last3E[1].timeStamp) / (1000 * 60))
                    let time2 = Math.round((last3E[1].timeStamp - last3E[2].timeStamp) / (1000 * 60))
                    if (time1 === time2) {
                        console.log({
                            FailSatusReport: {
                                url: lastEntry[0].url,
                                status: lastEntry[0].status,
                                statusText: lastEntry[0].statusText
                            }
                        })
                    }
                }
                console.log("changed")
            }

        } catch (error) {
            console.error(error)
        }
    });
}
monitorListingsUsingEventEmitter();

app.get('/', function (req, res) {
    res.send("Express monitoring, please observer the terminal console...");
});

app.listen(port, console.log(`App listerning on port ${port}`))