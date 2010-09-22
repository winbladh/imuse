<?php 
include "includes.php"; 

$domainid = $_GET['domainid']; 

$DB->query("SELECT name, info
	FROM domain_concept
	WHERE domainid ='$domainid' AND projectid='$PROJECTID'"); 

list($name, $info) = $DB->fetch_row(); 

$TPL->assign("domain_id", $domainid); 
$TPL->assign("domain_name", $name); 
$TPL->assign("domain_info", $info); 

$DB->query("SELECT r.related_domainid, d.name, d.info
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
$TPL->display("view_domain_info.tpl"); //setup
?> 