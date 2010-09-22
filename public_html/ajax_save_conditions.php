<?php

include "includes.php"; 

$condlist = $_POST['condlist']; 

try
{
	$conds = json_decode(stripslashes(urldecode($condlist))); 
	
	$DB->query("START TRANSACTION"); 
	
	foreach($conds as $cond)
	{
		if($cond->delete==1)
		{
			$DB->query("DELETE FROM conditions WHERE conditionid='{$cond->id}' LIMIT 1"); 
		}
		else
		{
			$DB->query("UPDATE conditions 
			SET conditiontext = '".$DB->escape($cond->text)."'
			WHERE conditionid = '{$cond->id}'
			LIMIT 1"); 
		}
	}
	
	$DB->query("COMMIT"); 
	echo "OK"; 
}
catch(Exception $e)
{
	header("HTTP/1.1 500 Failure"); 
	echo $e->getMessage(); 
}
?>