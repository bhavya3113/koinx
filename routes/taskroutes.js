const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskcontroller");


router.get("/task1/:address",taskController.task1);

module.exports=router; 