<?php
include "includes.php"; 

$domainid = $_GET['domainid']; 

$DB->query("SELECT domainid, name, info FROM domain_concept WHERE domainid = '$domainid' AND projectid='$PROJECTID' LIMIT 0, 1"); 
if (!$DB->get_num_rows())
{
	header("HTTP/1.1 500 Domain Not Found"); 
	die("Domain not found"); 
}

list($domainid, $dname, $dinfo) = $DB->fetch_row(); 

$domain = new stdClass(); 
$domain->domainid = $domainid; 
$domain->name = $dname; 
$domain->info = $dinfo; 

header("Content-type: application/json"); 
echo json_encode($domain); 
?>
