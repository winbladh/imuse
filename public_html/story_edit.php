<?php

include "includes.php"; 

$storyid = $_GET['storyid'];

if($_POST['action']=="create")
{
	$name = $DB->escape($_POST['name']);
	$storyjson = $_POST['storyjson'];
	
	$storyjson = stripslashes($storyjson);
	
	$obj = json_decode($storyjson);
	
//	echo "<pre>"; 
//	print_r($obj); 
//	die(); 
	
	if($obj)
	{
		$newjson = base64_encode($storyjson);
		
		$DB->query("UPDATE stories SET name='$name',storyjson='$newjson' WHERE storyid='$storyid' LIMIT 1");
	}

	
	if($_POST['submitType'] == "Save")
	{
		redirect("story_edit.php?storyid=$storyid"); 
	}
	
		redirect("story_list.php");
}


$DB->query("SELECT name,storyjson FROM stories WHERE storyid='$storyid' AND projectid = '$PROJECTID' LIMIT 0,1");
if(!$DB->get_num_rows())
{
	die("FAIL");
}

list($sname, $sjson) = $DB->fetch_row();

$DB->query("SELECT conditionid, conditiontext FROM conditions ORDER BY conditionid DESC"); 
$conditionlist = array(); 

if ($DB->get_num_rows())
{
	$rows = $DB->fetch_assoc(); 
	foreach($rows as $res)
	{
		$obj = new stdClass(); 
		list($obj->id, $obj->text) = $res; 
		$condlist[] = $obj; 
	}
}

$TPL->assign("condlist_json", json_encode($condlist)); 
$TPL->assign("story_name", $sname);
$TPL->assign("story_json", base64_decode($sjson));

$TPL->display("story_edit.tpl"); 

?>