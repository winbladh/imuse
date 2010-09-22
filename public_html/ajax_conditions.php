<?php
include "includes.php"; 
/*
$conditions = array(); 

function get_conditions($obj)
{
	global $conditions; 
	
	if(isset($obj->condition) && $obj->condition)
	{
		$conditions[] = $obj->condition; 
	}
	
	if(isset($obj->children))
	{	
		foreach($obj->children as $child)
		{
			if(is_object($child))
			{
				get_conditions($child); 
			}
		}
	}
}

$DB->query("SELECT storyjson FROM stories"); 
$rows = $DB->fetch_assoc(); 

foreach($rows as $res)
{
	list($storyjson) = $res; 
	
	$json = json_decode(base64_decode($storyjson)); 
	
	get_conditions($json); 
}

$conditions = array_unique($conditions); 
natsort($conditions); 
*/
$conditionnew = array(); 

$DB->query("SELECT conditionid, conditiontext FROM conditions WHERE projectid='$PROJECTID' ORDER BY conditionid ASC"); 
$rows = $DB->fetch_assoc(); 

$id = 1; 
foreach($rows as $res)
{
	$obj = new stdClass();
	list($obj->id, $obj->text) = $res;  
	//$obj->id = $id++; 
	//$obj->text = $cond; 
	
	$conditionnew[] = $obj; 
	
	//$DB->query("INSERT IGNORE INTO conditions (conditionid, conditiontext) VALUES ('{$obj->id}', '".$DB->escape($obj->text)."')"); 
}

header("Content-type: application/json"); 
echo json_encode(array('conditions'=>$conditionnew)); 
die(); 

?>
