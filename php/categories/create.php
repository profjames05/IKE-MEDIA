<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$name = sanitizeInput($_POST['name'] ?? '');
$description = sanitizeInput($_POST['description'] ?? '');
if ($name === '') {
    jsonResponse(false, 'Category name is required.', [], 400);
}

$pdo = getDatabaseConnection();
$slug = slugify($name);
$stmt = $pdo->prepare('INSERT INTO categories (name, slug, description, created_at, updated_at) VALUES (:name, :slug, :description, NOW(), NOW())');
$stmt->execute([':name' => $name, ':slug' => $slug, ':description' => $description]);

jsonResponse(true, 'Category created successfully.', ['id' => $pdo->lastInsertId()], 201);
