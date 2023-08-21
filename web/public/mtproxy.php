<?php
// 需要使用百度翻译，请根据keys.php.example，创建一个keys.php文件，把api key填入
!file_exists("keys.php") ?: require_once('keys.php');
isset($API_PROVIDER) ?: $API_PROVIDER = "youdao";

$to = isset($_REQUEST['to']) ? $_REQUEST['to'] : "zh";
$from = isset($_REQUEST['from']) ? $_REQUEST['from'] : "auto";

if (isset($_REQUEST['text'])) {
    if ($API_PROVIDER == 'baidu') {
        $translated_raw = translate_baidu($_REQUEST['text'], $from, $to);
        $translated_list = array_map(fn($item) => $item["dst"], $translated_raw["trans_result"]);
    } else {
        $translated_raw = translate_youdao($_REQUEST['text']);
        $translated_list = array_map(fn($item) => $item[0]["tgt"], $translated_raw["translateResult"]);
    }
    die(implode("|", $translated_list));
}

die('缺少要翻译的参数');

function translate_youdao($query)
{
    $args = array(
        'i' => $query,
        'doctype' => "json",
        'type' => "auto"
    );
    $ret = call("https://fanyi.youdao.com/translate", $args);
    $ret = json_decode($ret, true);
    return $ret;
}

/********************************************
 * 下面的代码 Copyright (c) 2015 Baidu.com
 * @author mouyantao(mouyantao@baidu.com)
 *********************************************/

//翻译入口
function translate_baidu($query, $from, $to)
{
    global $APP_ID, $SEC_KEY;
    $args = array(
        'q' => $query,
        'appid' => $APP_ID,
        'salt' => rand(10000, 99999),
        'from' => $from,
        'to' => $to
    );
    $args['sign'] = buildSign($query, $APP_ID, $args['salt'], $SEC_KEY);
    $ret = call("https://fanyi-api.baidu.com/api/trans/vip/translate", $args);
    $ret = json_decode($ret, true);
    return $ret;
}

//加密
function buildSign($query, $appID, $salt, $secKey)
{
    $str = $appID . $query . $salt . $secKey;
    $ret = md5($str);
    return $ret;
}

//发起网络请求
function call($url, $args = null, $method = "post", $testflag = 0, $timeout = 10, $headers = array())
{
    $ret = false;
    $i = 0;
    while ($ret === false) {
        if ($i > 1)
            break;
        if ($i > 0) {
            sleep(1);
        }
        $ret = callOnce($url, $args, $method, false, $timeout, $headers);
        $i++;
    }
    return $ret;
}

function callOnce($url, $args = null, $method = "post", $withCookie = false, $timeout = 10, $headers = array())
{
    $ch = curl_init();
    if ($method == "post") {
        $data = convert($args);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_POST, 1);
    } else {
        $data = convert($args);
        if ($data) {
            if (stripos($url, "?") > 0) {
                $url .= "&$data";
            } else {
                $url .= "?$data";
            }
        }
    }
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    if (!empty($headers)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    if ($withCookie) {
        curl_setopt($ch, CURLOPT_COOKIEJAR, $_COOKIE);
    }
    $r = curl_exec($ch);
    curl_close($ch);
    return $r;
}

function convert(&$args)
{
    $data = '';
    if (is_array($args)) {
        foreach ($args as $key => $val) {
            if (is_array($val)) {
                foreach ($val as $k => $v) {
                    $data .= $key . '[' . $k . ']=' . rawurlencode($v) . '&';
                }
            } else {
                $data .= "$key=" . rawurlencode($val) . "&";
            }
        }
        return trim($data, "&");
    }
    return $args;
}
?>