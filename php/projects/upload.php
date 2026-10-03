<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();

if (empty($_FILES['image']['name'])) {
    jsonResponse(false, 'No image file uploaded.', [], 400);
}

$uploaded = uploadImage($_FILES['image'], __DIR__ . '/../../assets/uploads/projects');
if ($uploaded === null) {
    jsonResponse(false, 'Image upload failed. Use JPG, JPEG, PNG, or WEBP under 5MB.', [], 400);
}

jsonResponse(true, 'Image uploaded.', ['image' => str_replace('\\', '/', $uploaded)], 200);
