const express = require("express");
const router = express.Router();

 router.get("/", (req, res) => {
    console.log(req.session);
    if (req.session.viewCount) {
      req.session.viewCount = req.session.viewCount + 1;
    } else {
      req.session.viewCount = 1;
    }
    res.send(
      `<h1>You have visited this page ${req.session.viewCount} times </h1>`
    );
  });

  
module.exports = router;