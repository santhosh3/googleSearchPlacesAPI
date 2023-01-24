const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const fs = require('fs');
const axios = require('axios');
const csv = require('csv-parser');
const {Parser} = require('json2csv');

app.post('/place/:address', async(req,res) => {
    try {
      const browser = await puppeteer.launch({});
      const page = await browser.newPage();
      let address = req.params.address;
      let url = `https://www.google.com/maps/place/${address}`;
      await page.goto(url);
      let element = await page.waitForSelector("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.fontBodyMedium.jyy7d > div:nth-child(1) > span > span.wEvh0b");
      let text = await page.evaluate(element => element.textContent, element);
      return res.status(200).send({status:true, data:text});
    } catch (error) {
      return res.status(500).send({status:false, message:error.message});
    }
})


app.get('/output', async(req,res) => {
  const result = [];
  fs.createReadStream('/home/pc/Desktop/as/src/inputFile/input.csv')
  .pipe(csv())
  .on('data', (data) => result.push(data))
  .on('end', async () => {
     let arr = [];
     for(let el of result){
      let config = {
        method:'post',
        url:`http://localhost:3000/place/${el.name}`,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
          }
      };
     let response = await axios(config);
     arr.push({
         id: el.id,
         name: el.name,
         description: response.data.data
     })
     }
     const parseObj = new Parser();
     const csv = parseObj.parse(arr);
     fs.writeFile('/home/pc/Desktop/as/src/outputFIle/outputFile.csv', csv, 'utf8', (err) => {
        if(err) throw err
        else return res.status(200).send({status:true,message:"done"})
     })
  })
})


app.listen(3000, () => console.log("Express is running on port 3000"));