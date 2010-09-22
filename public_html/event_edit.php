<?php
include "includes.php"; 

if($_POST['name'])
{
	$eventid = $_GET['eventid']; 
	
	$name = $DB->escape($_POST['name']); 
	$info = $DB->escape($_POST['info']);
	
	$DB->query("UPDATE events SET name='$name', info='$info' WHERE eventid='$eventid' LIMIT 1"); 
	
	if($_FILES != null && $_FILES['file']['error']==0)
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
		else
		{
			throw new Exception("File must be in JPEG format or PNG format."); 
		}
	}
	
	if($_POST['deleteimg']=="1")
	{
		$DB->query("UPDATE events SET hasimage='0' WHERE eventid = '$eventid' LIMIT 1"); 
		@unlink($_SERVER['DOCUMENT_ROOT'], "/imageuploads/$imgfile"); 
	}
	
	header("Location: event_list.php"); 
	die(); 
}

$eventid = $_GET['eventid']; 

$DB->query("SELECT name, info, hasimage FROM events WHERE eventid='$eventid' LIMIT 0, 1"); 
if(!$DB->get_num_rows())
{
	die("FAILURE"); 
}
list($ename, $einfo, $hasimage) = $DB->fetch_row(); 

$TPL->assign("event_name", $ename); 
$TPL->assign("event_info", $einfo); 
$TPL->assign("event_hasimage", $hasimage); 

$TPL->display("event_edit.tpl"); 
?>