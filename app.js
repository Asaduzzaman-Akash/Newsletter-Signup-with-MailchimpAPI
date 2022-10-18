const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Chained Route
app
  .route("/")
  .get((req, res) => {
    res.sendFile(__dirname + "/signup.html");
  })

  // Post Route
  .post((req, res) => {
    let fName = req.body.firstName;
    let lName = req.body.lastName;
    let userEmail = req.body.email;
    const data = {
      members: [
        {
          email_address: userEmail,
          status: "subscribed",
          merge_fields: {
            FNAME: fName,
            LNAME: lName,
          },
        },
      ],
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/d8a79415d8";

    const options = {
      method: "POST",
      // authentication method
      auth: "any:c7bda804b2f51400a56eda4ebfbbe28a-us17",
    };
    // post request to mail chimp server
    const request = https.request(url, options, function (response) {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });

    request.write(jsonData);
    request.end();
  });

app.listen(3000, () => {
  console.log("listening on port 3000");
});
