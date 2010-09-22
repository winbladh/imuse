<?php
include "includes.php"; 

if($_POST['name'])
{
	$name = $DB->escape($_POST['name']); 
	$info = $DB->escape($_POST['info']);
	
	try
	{
		$DB->query("START TRANSACTION"); 
		$DB->query("INSERT INTO events (name,info,projectid) VALUES ('$name', '$info','$PROJECTID')"); 
		$eventid = $DB->get_insert_id(); 
		
		if($_POST['ajax'] != 1 && $_FILES['file']['error']==0)
		{		
			$tmpname = $_FILES['file']['tmp_name']; 
			$name = $_FILES['file']['name']; 
			$size = $_FILES['file']['size']; 
		
			if(exif_imagetype($tmpname)==IMAGETYPE_JPEG || exif_imagetype($tmpname)==IMAGETYPE_PNG)
			{
		
				//$imgfile = uniqid("event_{$eventid}_").".jpg"; 
				$imgfile = "event_$eventid.jpg"; 
		
				if(move_uploaded_file($tmpname, $_SERVER['DOCUMENT_ROOT']."/image_uploads/$imgfile"))
				{
					$DB->query("UPDATE events SET hasimage='1' WHERE eventid = '$eventid' LIMIT 1"); 
					@chmod($_SERVER['DOCUMENT_ROOT']."/image_uploads/$imgfile", 0777);
				}
				else
				{
					throw new Exception("File could not be stored."); 
				}
			}
			else if($_POST['ajax'] != 1)
			{
				throw new Exception("File must be in JPEG format."); 
			}
		}
		$DB->query("COMMIT"); 
	}
	catch(Exception $e)
	{
		$DB->query("ROLLBACK"); 
	}
	
	if($_POST['ajax'] == 1)
	{
		$temp = new stdClass(); 
		$temp->eventid = $eventid; 
		$temp->name = $name; 
		$temp->info = $info; 
		$temp->hasimage = 0; 
		$temp->infolinked = parse_event_info($info); 
		
		header("Content-type: application/json");
		
		echo json_encode($temp);
		
		die();
	}
	else
	{
		header("Location: event_list.php"); 
		die(); 
	}
}

$TPL->display("create_event.tpl"); 
?>
