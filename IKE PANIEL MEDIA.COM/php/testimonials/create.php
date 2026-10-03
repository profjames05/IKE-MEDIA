<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$name = sanitizeInput($_POST['name'] ?? '');
$company = sanitizeInput($_POST['company'] ?? '');
$position = sanitizeInput($_POST['position'] ?? '');
$message = sanitizeInput($_POST['message'] ?? '');
$rating = (int) ($_POST['rating'] ?? 5);
$status = $_POST['status'] ?? 'published';

if ($name === '' || $message === '') {
    jsonResponse(false, 'Name and message are required.', [], 400);
}

$imagePath = null;
if (!empty($_FILES['image']['name'])) {
    $imagePath = uploadImage($_FILES['image'], __DIR__ . '/../../assets/uploads/projects');
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('INSERT INTO testimonials (name, company, position, message, rating, image, status, created_at, updated_at) VALUES (:name, :company, :position, :message, :rating, :image, :status, NOW(), NOW())');
$stmt->execute([
    ':name' => $name,
    ':company' => $company,
    ':position' => $position,
    ':message' => $message,
    ':rating' => $rating,
    ':image' => $imagePath ?: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    ':status' => in_array($status, ['published', 'hidden'], true) ? $status : 'published',
]);

jsonResponse(true, 'Testimonial created successfully.', ['id' => $pdo->lastInsertId()], 201);
