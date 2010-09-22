<?php

function smarty_function_page_title($params,&$smarty)
{
	$smarty->assign("g_page_title", $params['title']);
}


?>
