<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$id = (int) ($_POST['id'] ?? 0);
$name = sanitizeInput($_POST['name'] ?? '');
$description = sanitizeInput($_POST['description'] ?? '');
if ($id <= 0 || $name === '') {
    jsonResponse(false, 'Category ID and name are required.', [], 400);
}

$pdo = getDatabaseConnection();
$slug = slugify($name);
$update = $pdo->prepare('UPDATE categories SET name = :name, slug = :slug, description = :description, updated_at = NOW() WHERE id = :id');
$update->execute([':name' => $name, ':slug' => $slug, ':description' => $description, ':id' => $id]);

jsonResponse(true, 'Category updated successfully.', [], 200);
