<?php

include "includes.php"; 

$conditionid = $_GET['conditionid']; 

$DB->query("DELETE FROM conditions WHERE conditionid='$conditionid' LIMIT 1"); 

header("Location: condition_list.php"); 
die(); 

?>