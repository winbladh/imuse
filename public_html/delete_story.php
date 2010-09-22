<?php

include "includes.php"; 

$storyid = $_GET['storyid']; 

$DB->query("DELETE FROM stories WHERE storyid='$storyid' LIMIT 1"); 

header("Location: story_list.php"); 
die(); 

?>