<?php

include "includes.php"; 

$eventid = $_GET['eventid']; 

$DB->query("DELETE FROM events WHERE eventid='$eventid' LIMIT 1"); 

header("Location: event_list.php"); 
die(); 

?>