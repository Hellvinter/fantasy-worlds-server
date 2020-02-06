const router = require("express").Router();

router.get("/dashboard", (req, res) => {
  res.send(req.user);
});

module.exports = router;
