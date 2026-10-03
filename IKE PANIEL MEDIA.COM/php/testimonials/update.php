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
$company = sanitizeInput($_POST['company'] ?? '');
$position = sanitizeInput($_POST['position'] ?? '');
$message = sanitizeInput($_POST['message'] ?? '');
$rating = (int) ($_POST['rating'] ?? 5);
$status = $_POST['status'] ?? 'published';

if ($id <= 0 || $name === '' || $message === '') {
    jsonResponse(false, 'Invalid testimonial data.', [], 400);
}

$pdo = getDatabaseConnection();
$sql = 'UPDATE testimonials SET name = :name, company = :company, position = :position, message = :message, rating = :rating, status = :status, updated_at = NOW()';
$bind = [
    ':name' => $name,
    ':company' => $company,
    ':position' => $position,
    ':message' => $message,
    ':rating' => $rating,
    ':status' => in_array($status, ['published', 'hidden'], true) ? $status : 'published',
    ':id' => $id,
];
if (!empty($_FILES['image']['name'])) {
    $imagePath = uploadImage($_FILES['image'], __DIR__ . '/../../assets/uploads/projects');
    if ($imagePath !== null) {
        $sql .= ', image = :image';
        $bind[':image'] = $imagePath;
    }
}
$sql .= ' WHERE id = :id';
$stmt = $pdo->prepare($sql);
$stmt->execute($bind);

jsonResponse(true, 'Testimonial updated successfully.', [], 200);
