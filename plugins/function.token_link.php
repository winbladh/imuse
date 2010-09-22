<?php

function smarty_function_token_link($params,&$smarty)
{
	$token = $params['token'] ? $params['token'] : "calicodltoken";
	$path = $params['file'];
	$prefix = $params['prefix'];

	$timehex = dechex(time());


	$url = $prefix.md5($token."/".$path.$timehex)."/$timehex/$path";
	$url = str_replace("//","/",$url);
	return $url;
	//$smarty->assign("g_page_title", $params['title']);
}


?>
