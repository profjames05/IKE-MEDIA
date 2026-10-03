<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
if ($id <= 0) {
    jsonResponse(false, 'Invalid media ID.', [], 400);
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('SELECT file_path FROM media_files WHERE id = :id LIMIT 1');
$stmt->execute([':id' => $id]);
$file = $stmt->fetch();

if ($file) {
    $path = realpath(__DIR__ . '/../..') . $file['file_path'];
    if (is_file($path)) {
        unlink($path);
    }
    $pdo->prepare('DELETE FROM media_files WHERE id = :id')->execute([':id' => $id]);
}

jsonResponse(true, 'Image deleted successfully.', [], 200);
