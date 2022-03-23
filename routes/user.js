const express = require('express');
const router=express.Router();
const { signup, login, logout, getUserDetails, updatePassword, updateUser ,adminUser, managerUser, adminDelete} = require('../controllers/userController');
const { isAdmin } = require('../middlewares/isAdmin');
const { isLogedIn } = require('../middlewares/isLogedIn');
const { isManager } = require('../middlewares/isManager');


router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/getuser').get(isLogedIn,getUserDetails);
router.route('/password/update').post(isLogedIn,updatePassword);
router.route('/user/update').post(isLogedIn,updateUser);


router.route('/admin/users').get(isLogedIn,isAdmin,adminUser)
router.route('/admin/user/delete').post(isLogedIn,isAdmin,adminDelete)

router.route('/manager/users').get(isLogedIn,isManager,managerUser);

module.exports=router;