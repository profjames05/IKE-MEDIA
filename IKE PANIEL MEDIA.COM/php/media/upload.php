<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(false, 'No valid image was uploaded.', [], 400);
}

$uploadDir = __DIR__ . '/../../assets/uploads';
$uploaded = uploadImage($_FILES['image'], $uploadDir);
if ($uploaded === null) {
    jsonResponse(false, 'The image could not be uploaded. Check file type, size, or folder permissions.', [], 400);
}

$relativePath = str_replace('\\', '/', preg_replace('#^' . preg_quote(realpath(__DIR__ . '/../..'), '#') . '#', '', realpath($uploadDir) ?: $uploadDir));
$route = '/assets/uploads/' . basename($uploaded);
$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('INSERT INTO media_files (name, file_path, file_type, size, created_at) VALUES (:name, :file_path, :file_type, :size, NOW())');
$stmt->execute([
    ':name' => basename($_FILES['image']['name']),
    ':file_path' => $route,
    ':file_type' => mime_content_type($_FILES['image']['tmp_name']) ?: 'image',
    ':size' => (int) $_FILES['image']['size'],
]);

jsonResponse(true, 'Image uploaded successfully.', ['path' => $route], 201);
