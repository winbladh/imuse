<?php

include "includes.php";

if($_POST['name'])
{
	$name = $DB->escape($_POST['name']);
	$info = $DB->escape($_POST['info']);
	$domain = $DB->escape($_POST['domainname']);

	
	try
	{
		$DB->query("START TRANSACTION");
		
		$DB->query("INSERT INTO projects (name,info,domainname) VALUES ('$name','$info','$domain')");
				
		$DB->query("COMMIT");
	
	}
	catch(Exception $e)
	{
		$DB->query("ROLLBACK");
	}

	header("Location: project_list.php");
	die();

}


$TPL->display("project_create.tpl");

?>
