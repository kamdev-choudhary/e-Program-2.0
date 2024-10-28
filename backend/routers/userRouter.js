const express = require("express");
const router = express(express.Router);
const userController = require("../controllers/userController");

router
  .route("/:id")
  .get(userController.getUserData)
  .delete(userController.deleteUser)
  .patch(userController.updateUserData);

router.route("/role/:role").get(userController.getUserbyRole);

module.exports = router;
