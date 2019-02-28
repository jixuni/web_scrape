const express = require("express");
const request = require("request-promise");
const cheerio = require("cheerio");
let router = express.Router();
//Require all db models
let db = require("../models");

// Url for scraping software jobs on craiglist NY
const url = "https://newyork.craigslist.org/d/software-qa-dba-etc/search/sof";

router.get("/", async (req, res) => {
    try {
        const dbData = await db.Jobs.find({});
        res.status(200).render("index", {dbData});
    } catch(error){
        res.status(500).render("Not found");
    }
    
});



//Define an empty array where the stored object will be push to.
const scrapeResults = [];

router.get("/scrape", function (req, res) {
    // asycronous function will always return a promise;
    async function scrapeJobHeader() {
        //try will run this block of code it contain, will run catch if error 
        try {
            //await here for the the promise from request and pass it to cheerio
            const htmlResult = await request.get(url);
            const $ = await cheerio.load(htmlResult);
            //Grab the class from cheerio and looping through it grabs attr/texts
            $(".result-info").each((index, element) => {
                const resultTitle = $(element).children(".result-title");
                const title = resultTitle.text();
                const url = resultTitle.attr("href");
                //create a new date object with time job is posted
                const datePosted = new Date(
                    $(element)
                    .children("time")
                    .attr("datetime"));
                const location = $(element).find(".result-hood").text(); // Not all pages include this.
                // Define an object for each element and push it to array;
                const scrapeResult = {
                    title,
                    url,
                    datePosted,
                    location
                };
                scrapeResults.push(scrapeResult)
            })

            // console.log(scrapeResults);
            return scrapeResults;
        } catch (err) {
            console.error(err);
        }
    }

    // async function passing in the url of each object in the jobs array
    async function scrapeBio(jobsHeader) {
        //Returns a Promise when all Promise is resolved.
        return await Promise.all(
            /* Passing in the url and looping through with another request method, this time passing in the 
            url of each object in the array, load it to cheerio and parse grab the relavent information e.g */
            jobsHeader.map(async (job) => {
                try {
                    const htmlResult = await request.get(job.url);
                    const $ = await cheerio.load(htmlResult);
                    // Some pages has weird qr code embded in them. This removes it
                    $(".print-qrcode-container").remove();
                    // Temp variable to store the job discription and removes the line break and white space.
                    // Also dynamically adding creating new keys in the object for description, address and compensation.
                    job.description = $("#postingbody")
                    .text()//grabs the text
                    .replace(/(\r\n|\n|\r)/gm, "") // removes all the line break
                    .trim() // trims the white space
                    .split(/\s+/) //split all the words
                    .slice(0,20) // grabs the first 20 words
                    .join(" "); // return the first 20 words as new String

                    // job.description = tempDescription.replace(/(\r\n|\n|\r)/gm, "").trim().split(/\s+/).slice(0,50).join(" ");



                    job.address = $("div.mapaddress").text()
                    const compensationText = $(".attrgroup") // not all pages include this.
                        .children()
                        .first()
                        .text();
                    //Removes the format from craigslist
                    job.compensation = compensationText.replace("compensation: ", ""); // Not all pages include this.
                    return job;
                } catch (error) {
                    console.error(error);
                }
            })
        );
    }
    
    //async function that calls scrapeJobHeader and assigns it to jobsHeader, then calls scrapeBio and pass in jobsHeader as argument
    async function scrapeCraigslist() {
        const jobsHeader = await scrapeJobHeader();
        const jobsData = await scrapeBio(jobsHeader);
        // console.log(jobsData);
       await db.Jobs.create(jobsData);
    }
    scrapeCraigslist();
    res.send("Scrape Complete");

})


router.get("/jobs",  (req, res) => {
     db.Jobs.find({})
     .then(function(dbJobs){
         res.json(dbJobs);
         
     })
     .catch(function(error){
         res.json(error)
     })

})

// router.post("/jobs/:id", async(req, res) =>{
//     db.Jobs.findOne({_id: req.params.id})
//     .then(function(dbJobs){
//         res.json(dbJobs);
//     })
//     .catch(function(error){
//         res.json(error);
//     })
// })



module.exports = router;