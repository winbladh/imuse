<?php // setup
include "includes.php"; //setup 

if($_POST['action']=="submit")
{
	$domainid = $_POST['domainid']; 
	$name = $DB->escape($_POST['name']); 
	$info = $DB->escape($_POST['info']); 
	
	$DB->query("UPDATE domain_concept 
		SET name='$name', info='$info' 
		WHERE domainid='$domainid' 
		LIMIT 1"); 
		
	$deleterels = $_POST['delrel'];
	if(count($deleterels)>0)
	{
		foreach($deleterels as $delrel)
		{
			$DB->query("DELETE FROM domain_concept_relations
			WHERE domainid='$domainid' AND relationid='$delrel'
			LIMIT 1"); 
		}
	}
	
	$addrel = $_POST['add_domainid']; 
	if($addrel!=0)
	{
		$DB->query("INSERT INTO domain_concept_relations (domainid,related_domainid)
		VALUES ('$domainid', '$addrel')"); 
	}
	
	header("Location: view_domain_concepts.php"); 
	die(); 
}

$domainid = $_GET['domainid']; 

$DB->query("SELECT name, info
	FROM domain_concept
	WHERE domainid ='$domainid' AND projectid='$PROJECTID'"); 
	
if(!$DB->get_num_rows())
{
	die("FAILURE"); 
}

list($name, $info) = $DB->fetch_row(); 

$TPL->assign("domain_id", $domainid); 
$TPL->assign("domain_name", $name); 
$TPL->assign("domain_info", $info); 

$DB->query("SELECT r.relationid, d.name, d.info
FROM domain_concept_relations r 
LEFT JOIN domain_concept d ON (d.domainid=r.related_domainid)
WHERE r.domainid='$domainid'
ORDER BY d.name ASC"); 
if($DB->get_num_rows())
{
	$data = $DB->fetch_assoc(); 
	$results = array(); 
	
	foreach($data as $row)
	{
		list($RELIDid, $name, $info) = $row; 
		$results[] = array(
		'id'=>$RELIDid,
		'name'=>$name,
		'info'=>$info,
		);
	}
	
	$TPL->assign("related_domains", $results); 
}

$DB->query("SELECT domainid, name 
FROM domain_concept 
WHERE domainid<>'$domainid' AND projectid='$PROJECTID'
ORDER BY name ASC"); 
if($DB->get_num_rows()>0)
{
	$data = $DB->fetch_assoc(); 
	$results = array(); 
	$results[0] = "Pick a domain"; //gives us a default so that we know if we didn't pick anything 
	foreach($data as $row)
	{
		list($did, $name) = $row; 
		
		$results[$did] = $name; 
	}
	$TPL->assign("other_domains", $results); 
}

$TPL->display("edit_domain_concept.tpl"); //setup
?> 