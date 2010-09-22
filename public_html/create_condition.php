<?php
include "includes.php"; 

if($_POST['conditiontext'])
{
	$conditiontext = $DB->escape($_POST['conditiontext']); 

	$DB->query("INSERT INTO conditions (conditiontext, projectid) VALUE ('$conditiontext', '$PROJECTID')"); 
	$conditionid = $DB->get_insert_id();  

	header("Location: condition_list.php"); 
	die(); 
}

$TPL->display("create_condition.tpl"); 
?>