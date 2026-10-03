<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$pdo = getDatabaseConnection();
$title = sanitizeInput($_POST['title'] ?? '');
$categoryId = (int) ($_POST['category_id'] ?? 0);
$description = sanitizeInput($_POST['description'] ?? '');
$client = sanitizeInput($_POST['client'] ?? '');
$projectDate = $_POST['project_date'] ?? null;
$tools = sanitizeInput($_POST['tools'] ?? '');
$projectType = sanitizeInput($_POST['project_type'] ?? '');
$featured = isset($_POST['featured']) ? (int) $_POST['featured'] : 0;

if ($title === '' || $categoryId <= 0 || $description === '') {
    jsonResponse(false, 'Title, category, and description are required.', [], 400);
}

$imagePath = null;
if (!empty($_FILES['image']['name'])) {
    $imagePath = uploadImage($_FILES['image'], __DIR__ . '/../../assets/uploads/projects');
    if ($imagePath === null) {
        jsonResponse(false, 'Image upload failed. Use JPG, JPEG, PNG, or WEBP under 5MB.', [], 400);
    }
}

$slug = slugify($title);
$stmt = $pdo->prepare('SELECT id FROM projects WHERE slug = :slug LIMIT 1');
$stmt->execute([':slug' => $slug]);
if ($stmt->fetch()) {
    $slug = $slug . '-' . time();
}

$sql = 'INSERT INTO projects (title, slug, category_id, description, client, project_date, tools, project_type, image, featured, created_at, updated_at)
        VALUES (:title, :slug, :category_id, :description, :client, :project_date, :tools, :project_type, :image, :featured, NOW(), NOW())';

$insert = $pdo->prepare($sql);
$insert->execute([
    ':title' => $title,
    ':slug' => $slug,
    ':category_id' => $categoryId,
    ':description' => $description,
    ':client' => $client,
    ':project_date' => $projectDate ?: null,
    ':tools' => $tools,
    ':project_type' => $projectType,
    ':image' => $imagePath ?: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    ':featured' => $featured,
]);

jsonResponse(true, 'Project created successfully.', ['id' => $pdo->lastInsertId()], 201);
