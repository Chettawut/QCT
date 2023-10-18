<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

session_start();
date_default_timezone_set('Asia/Bangkok');
include_once( dirname(__FILE__, 1)."/conn.php");