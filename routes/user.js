const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { testUserAPI, createSuperUser, createUser, getUsers, getUser, updateUser, deleteUser, logIn, getCurrent, changePass } = require("../controllers/user");

const validateToken = require("../middleware/validateTokenHandler");

//@desc Test User API
//@route GET /api/v1/user
//@access Private: Role Super Admin
router.get("/", validateToken, testUserAPI);

//@desc Create New User
//@route POST /api/v1/user/add
//@access Private: Role Super Admin
router.post(
  "/super/add",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password must have atlest 5 character").isLength({
      min: 5,
    }),
    body("whatsapp_no", "whatsapp_no must have atlest 10 digits").isLength({
      min: 10,
    }),
  ],
  createSuperUser
);

//@desc Create New User
//@route POST /api/v1/user/add
//@access Private: Role Super Admin
router.post(
  "/add",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password must have atlest 5 character").isLength({
      min: 5,
    }),
    body("whatsapp_no", "whatsapp_no must have atlest 10 digits").isLength({
      min: 10,
    }),
  ],
  validateToken,
  createUser
);

//@desc Get all Users
//@route GET /api/v1/user/getall
//@access Private: Role Super Admin
router.get("/getall", validateToken, getUsers);

//@desc Get User with id
//@route GET /api/v1/user/get/:id
//@access Private: Role Super Admin
router.get("/get/:id", validateToken, getUser);

//@desc Update User with id
//@route PUT /api/v1/user/update/:id
//@access Private: Role Super Admin
router.put("/update/:id", [body("name", "Enter a valid name").isLength({ min: 3 })], validateToken, updateUser);

//@desc Delete User with id ( we are updating active to false )
//@route PUT /api/v1/user/delete/:id
//@access Private: Role Super Admin
router.put("/delete/:id", validateToken, deleteUser);

//@desc Update User approved with id ( we are updating active to false )
//@route PUT /api/v1/user/app_dis/:id
//@access Private: Role Super Admin
/* router.put("/app_dis/:id", validateToken, AppDisUser); */

//@desc Change password of User with id
//@route PUT /api/v1/user/chnage/pass/:id
//@access Private: Role Super Admin
router.put("/change/pass/:id", validateToken, changePass);

//@desc User Login with email and password
//@route POST /api/v1/user/login/
//@access PUBLIC
router.post("/login/", [body("email", "Enter a Valid Email").isEmail(), body("password", "Password must have atlest 5 character").notEmpty()], logIn);

//@desc Get current Logged in USer
//@route POST /api/v1/user/getCurrent/
//@access Private: Needs Login
router.get("/getCurrent/", validateToken, getCurrent);

module.exports = router;
