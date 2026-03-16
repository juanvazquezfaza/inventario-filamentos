<?php
header('Content-Type: application/json; charset=utf-8');

$raw = file_get_contents('php://input');

if (!$raw) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "No se recibieron datos"]);
    exit;
}

json_decode($raw);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "JSON no válido"]);
    exit;
}

$file = __DIR__ . '/data/inventario.json';

$result = file_put_contents($file, $raw, LOCK_EX);

if ($result === false) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => "No se pudo guardar el archivo"]);
    exit;
}

echo json_encode(["ok" => true]);
