<?php
include "includes.php"; 

header("Content-type: application/json"); 

$story = new stdClass(); 
$story->name = "doInOrder"; 
$story->children = array(); 

$thing = new stdClass(); 
$thing->name = "ifElse"; 
$thing->children = array(); 

$DB->query("SELECT eventid FROM events ORDER BY RAND() LIMIT 0,3"); 
$rows = $DB->fetch_assoc(); 
foreach($rows as $res)
{
	list($temp) = $res; 
	$story->children[] = $temp; 
	$thing->children[] = $temp; 
}
$story->children[] = $thing; 

echo json_encode($story)
?>