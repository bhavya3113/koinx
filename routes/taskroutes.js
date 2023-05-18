const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskcontroller");


router.get("/task1/:address",taskController.task1);

router.get("/task3/price/:address",taskController.task3);

module.exports=router; 