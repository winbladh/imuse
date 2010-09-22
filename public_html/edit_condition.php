<?php

include "includes.php"; 

if($_POST['conditiontext'])
{
	$conditionid = $_GET['conditionid']; 	
	$conditiontext = $DB->escape($_POST['conditiontext']);
	
	$DB->query("UPDATE conditions 
				SET conditiontext='$conditiontext' 
				WHERE conditionid='$conditionid' 
				LIMIT 1"); 
			
	header("Location: condition_list.php"); 
	die(); 
}

$conditionid = $_GET['conditionid']; 

$DB->query("SELECT conditiontext FROM conditions WHERE conditionid='$conditionid' LIMIT 0, 1"); 

if(!$DB->get_num_rows())
{
	die("FAILURE"); 
}

list($econditiontext) = $DB->fetch_row(); 

$TPL->assign("condition_conditiontext", $econditiontext); 

$TPL->display("edit_condition.tpl"); 

?>