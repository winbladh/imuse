<?php
include "includes.php"; 

if($_GET['loadstories']==1)
{
	header("Content-type: application/json"); 
	echo file_get_contents("slides.json"); 
	die(); 
}

$TPL->display("view_stories.tpl"); 
?>