<?php

include "includes.php";

$hostprefix = str_replace(".","_",$_SERVER['HTTP_HOST']);
/*
if($_POST['projectinfo'])
{
	file_put_contents("projectinfo$hostprefix.txt", $_POST['projectinfo']);
	redirect("/");
}
*/
/*if(file_exists("projectinfo$hostprefix.txt"))
{
$projectinfo = file_get_contents("projectinfo$hostprefix.txt");
}
else
{
	$projectinfo = "";
}
*/

$DB->query("SELECT info FROM projects WHERE projectid='$PROJECTID' LIMIT 0,1");
list($projectinfo) = $DB->fetch_row();

$TPL->assign("projectinfo", $projectinfo);

$TPL->display("index.tpl");


?>
