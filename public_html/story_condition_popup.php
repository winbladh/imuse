<?php
include "includes.php"; 

if($_POST['action']=="submit")
{
/*
	$DB->query("INSERT INTO conditions (conditiontext) VALUES ('$conditiontext')"); 
	$conditionid = $DB->get_insert_id(); 
	*/
}

$TPL->display("story_condition_popup.tpl"); 
?>