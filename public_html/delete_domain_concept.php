<?php

include "includes.php"; 

$domainid = $_GET['domainid']; 

$DB->query("DELETE FROM domain_concept WHERE domainid='$domainid' LIMIT 1"); 

header("Location: view_domain_concepts.php"); 
die(); 

?>