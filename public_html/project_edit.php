<?php
include "includes.php"; 

if($_POST['name'])
{
	$projectid2 = $_GET['projectid'];
	
	$name = $DB->escape($_POST['name']); 
	$info = $DB->escape($_POST['info']);
	$domainname = $DB->escape($_POST['domainname']);
	
	$DB->query("UPDATE projects SET name='$name',info='$info', domainname='$domainname' WHERE projectid='$projectid2' LIMIT 1");
		
	header("Location: project_list.php"); 
	die(); 
}

$projectid = $_GET['projectid']; 

$DB->query("SELECT name, info, domainname FROM projects WHERE projectid='$projectid' LIMIT 0, 1"); 

if(!$DB->get_num_rows())
{
	die("FAILURE"); 
}

list($pname, $pinfo, $pdomainname) = $DB->fetch_row(); 

$TPL->assign("project_name", $pname); 
$TPL->assign("project_info", $pinfo); 
$TPL->assign("project_domainname", $pdomainname); 

$TPL->display("project_edit.tpl"); 
?>