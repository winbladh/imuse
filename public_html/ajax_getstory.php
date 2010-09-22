<?php

include "includes.php";

header("Content-type: application/json");

/*$events = array(3,4,5,9,10,11,6,2);


$thing2 = new stdClass();
$thing2->name = "ifElse";
$thing2->childElms = array(3,4,5,9);

$story = new stdClass();
$story->name = "doInOrder";
$story->childElms = array(10,11,6,2, $thing2);
*/


$story = new stdClass();
$story->name = "doInOrder";
$story->condition = "";
$story->children = array();

$thing = new stdClass();
$thing->name = "ifElse";
$thing->condition = "this is a condition";
$thing->children = array();

$DB->query("SELECT eventid FROM events ORDER BY RAND() LIMIT 0,3");
$rows = $DB->fetch_assoc();
foreach($rows as $res)
{
	list($temp) = $res;
	$story->children[] = $temp;
	$thing->children[] = $temp;
}
$story->children[] = $thing;


echo json_encode($story)

?>
