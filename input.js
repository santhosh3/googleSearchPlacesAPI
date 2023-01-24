const axios = require('axios')

axios.get("https://jsonplaceholder.typicode.com/comments")
  .then((response) => {
    console.log(response.data)
  })
  .catch(function (err) {
    console.log("Unable to fetch -", err);
  });