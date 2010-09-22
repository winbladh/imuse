<?php
include "includes.php"; 

if($_POST['action'] == "create")
{
	$name = $DB->escape($_POST['name']);
	$storyjson = $_POST['storyjson']; 
	$storyjson = stripslashes($storyjson); 
	
	$obj = json_decode($storyjson); 
	
	//echo "<pre>"; 
	//var_dump($obj); 
	//die(); 
	
	if($obj)
	{
		$newjson = base64_encode($storyjson); 
		
		$DB->query("INSERT INTO stories(name, storyjson, projectid) VALUES ('$name', '$newjson', '$PROJECTID')"); 
		$storyid = $DB->get_insert_id(); 
	}
	
	if($_POST['submitType'] == "Save")
	{
		redirect("story_edit.php?storyid=$storyid"); 
	}
	
	redirect("story_list.php");
}

else
{
	$story = new stdClass(); 
	$story->name = "doInOrder"; 
	$story->children = array(); 
	$TPL->assign("default_story_json", json_encode($story)); 
}


$TPL->display("story_create.tpl"); 
?>