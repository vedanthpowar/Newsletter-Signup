const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");
const text = require("body-parser/lib/types/text");
const { sendfile } = require("express/lib/response");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})
app.post("/", function (req, res) {
    var firstname = req.body.fn;
    var lastname = req.body.sn;
    var email = req.body.email;
    var data = {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname,
            }
    };
    // console.log(data);
    var stringData = JSON.stringify(data);
    var url = "https://us21.api.mailchimp.com/3.0/lists/453ac97842/members";
    var options = {
        method: "POST",
        auth: "Vedanth:4ffef946d79d93103445d4e70a55cf4e-us21"
    };
    const req1 = https.request(url, options, function (response) {
        response.on("data", function (data) {
            if(JSON.parse(data).status===400){
                res.sendFile(__dirname+"/fail.html");
            }
            else{
                res.sendFile(__dirname+"/success.html");
            }
        })
    });
    req1.write(stringData);
    req1.end();
})
app.post("/fail",function(req,res){
    res.redirect("/");
})
app.listen(3000, function () {
    console.log("Yeah its up and running");
})

//api key: 4ffef946d79d93103445d4e70a55cf4e-us21
//list id: 453ac97842