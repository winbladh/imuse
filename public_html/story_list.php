<?php
include "includes.php";

$DB->query("SELECT storyid,name 
			FROM stories 
			WHERE projectid = '$PROJECTID'
			ORDER BY name ASC"); 

if ($DB->get_num_rows())
{
	$data = $DB->fetch_assoc(); 
	$results = array(); 
	
	foreach($data as $row)
	{
		list($id, $name) = $row; 
		$results[] = array(
		'id'=>$id,
		'name'=>$name,
		);
	}
	
	$TPL->assign("results", $results); 
}

$TPL->display("story_list.tpl"); 
?>