<?php

include "includes.php"; 

if($_POST['name']) // if a name exists at all, it will be true 
{	
	$name = $DB->escape($_POST['name']); 
	$info = $DB->escape($_POST['info']); 
	$relations = array();  
	$relations = $_POST['add_domainid'];
	
	$DB->query("INSERT INTO domain_concept (name, info, projectid) VALUES ('$name', '$info', '$PROJECTID')"); 
	$domainid = $DB->get_insert_id(); 

	if(count($relations) > 0)
	{
		foreach($relations as $relid)
		{
			$DB->query("INSERT INTO domain_concept_relations
			(domainid, related_domainid) 
			VALUES ('$domainid', '$relid')");
		}
	}
	
	$_SESSION['domain_created'] = true; 
	$_SESSION['last_domainid'] = $domainid; 

	header("Location: view_domain_concepts.php"); 
	die(); // forces the website to reload the page and doesn't continue to ask you to resend information each time 
}

// new code: 
$DB->query("SELECT domainid, name 
FROM domain_concept 
WHERE domainid<>'$domainid' AND projectid='$PROJECTID'
ORDER BY name ASC"); 
if($DB->get_num_rows()>0)
{
	$data = $DB->fetch_assoc(); 
	$results = array(); 
	// $results[0] = "Pick a domain"; //gives us a default so that we know if we didn't pick anything 
	foreach($data as $row)
	{
		list($did, $name) = $row; 
		
		$results[$did] = $name; 
	}
	$TPL->assign("other_domains", $results); 
}

$TPL->display("create.tpl"); 

?>