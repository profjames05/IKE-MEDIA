<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$pdo = getDatabaseConnection();
$id = (int) ($_POST['id'] ?? 0);
$title = sanitizeInput($_POST['title'] ?? '');
$categoryId = (int) ($_POST['category_id'] ?? 0);
$description = sanitizeInput($_POST['description'] ?? '');
$client = sanitizeInput($_POST['client'] ?? '');
$projectDate = $_POST['project_date'] ?? null;
$tools = sanitizeInput($_POST['tools'] ?? '');
$projectType = sanitizeInput($_POST['project_type'] ?? '');
$featured = isset($_POST['featured']) ? (int) $_POST['featured'] : 0;

if ($id <= 0 || $title === '' || $categoryId <= 0 || $description === '') {
    jsonResponse(false, 'Invalid project data.', [], 400);
}

$imagePath = null;
if (!empty($_FILES['image']['name'])) {
    $imagePath = uploadImage($_FILES['image'], __DIR__ . '/../../assets/uploads/projects');
    if ($imagePath === null) {
        jsonResponse(false, 'Image upload failed. Use JPG, JPEG, PNG, or WEBP under 5MB.', [], 400);
    }
}

$slug = slugify($title);
$existing = $pdo->prepare('SELECT slug FROM projects WHERE id = :id LIMIT 1');
$existing->execute([':id' => $id]);
$current = $existing->fetch();
if ($current && $current['slug'] !== $slug) {
    $check = $pdo->prepare('SELECT id FROM projects WHERE slug = :slug AND id != :id LIMIT 1');
    $check->execute([':slug' => $slug, ':id' => $id]);
    if ($check->fetch()) {
        $slug = $slug . '-' . time();
    }
}

$sql = 'UPDATE projects SET title = :title, slug = :slug, category_id = :category_id, description = :description, client = :client, project_date = :project_date, tools = :tools, project_type = :project_type, featured = :featured, updated_at = NOW()';
if ($imagePath) {
    $sql .= ', image = :image';
}
$sql .= ' WHERE id = :id';

$stmt = $pdo->prepare($sql);
$bind = [
    ':title' => $title,
    ':slug' => $slug,
    ':category_id' => $categoryId,
    ':description' => $description,
    ':client' => $client,
    ':project_date' => $projectDate ?: null,
    ':tools' => $tools,
    ':project_type' => $projectType,
    ':featured' => $featured,
    ':id' => $id,
];
if ($imagePath) {
    $bind[':image'] = $imagePath;
}
$stmt->execute($bind);

jsonResponse(true, 'Project updated successfully.', [], 200);
