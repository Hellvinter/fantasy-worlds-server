const router = require("express").Router();
const verify = require("./private_routes");

router.get("/dashboard", verify, (req, res) => {
  res.send(req.user);
});

module.exports = router;
