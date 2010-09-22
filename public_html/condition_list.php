<?php
include "includes.php";

$DB->query("SELECT conditionid, conditiontext
			FROM conditions
			WHERE projectid = '$PROJECTID'"); 

if ($DB->get_num_rows())
{
	$data = $DB->fetch_assoc(); 
	$results = array(); 
	
	foreach($data as $row)
	{
		list($conditionid, $conditiontext) = $row; 
		$results[] = array(
		'conditionid'=>$conditionid,
		'conditiontext'=>parse_event_info($conditiontext),
		);
	}
	
	$TPL->assign("results", $results); 
}

$TPL->display("condition_list.tpl"); 
?>