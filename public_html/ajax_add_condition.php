<?php

include "includes.php"; 

$condtext = urldecode($_GET['condtext']); 

try
{	
	if (!$condtext)
	{
		throw new Exception("Condition is empty"); 
	}
	
	$DB->query("INSERT INTO conditions (conditiontext, projectid) VALUES ('".$DB->escape($condtext)."', '$PROJECTID')"); 
	
	$temp=new stdClass();
	$temp->conditionid=$DB->get_insert_id();
	$temp->conditiontext=$condtext;
	header("content-type: application/json");
	echo json_encode($temp);
	die(); 
}
catch(Exception $e)
{
	header("HTTP/1.1 500 Error"); 
	echo $e->getMessage(); 
}

?>