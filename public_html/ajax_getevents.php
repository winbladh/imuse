<?php
include "includes.php"; 

$events = array(); 

$DB->query("SELECT eventid, name, info, hasimage FROM events WHERE projectid='$PROJECTID' ORDER BY name ASC"); 
if(!$DB->get_num_rows())
{
	$emptyevents = array();
	header("Content-type: application/json"); 
	echo json_encode($emptyevents); 
	die();
}

$res = $DB->fetch_assoc(); 

foreach($res as $row)
{
	list($eventid, $name, $info, $hasimage) = $row; 
	
	$temp = new stdClass(); 
	$temp->eventid = $eventid; 
	$temp->name = $name; 
	$temp->info = $info; 
	$temp->hasimage = $hasimage; 
	$temp->infolinked = parse_event_info($info); 
	
	if($hasimage == 1)
	{
		$temp->url = "/image_uploads/event_$eventid.jpg"; 
	}
	
	$events[] = $temp; 

}

header("Content-type: application/json"); 
echo json_encode($events); 

?>
