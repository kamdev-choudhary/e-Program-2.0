const express = require("express");
const router = express(express.Router);
const userController = require("../controllers/userController");

router
  .route("/:id")
  .get(userController.getUserData)
  .delete(userController.deleteUser)
  .patch(userController.updateUserData);

router.route("/role/:role").get(userController.getUserbyRole);

router.route("/profile-pic").post(userController.updateProfilePic);

module.exports = router;
