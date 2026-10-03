<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

$name = sanitizeInput($_POST['name'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$phone = sanitizeInput($_POST['phone'] ?? '');
$subject = sanitizeInput($_POST['subject'] ?? '');
$message = sanitizeInput($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    jsonResponse(false, 'Name, email, and message are required.', [], 400);
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('INSERT INTO messages (name, email, phone, subject, message, status, created_at, updated_at) VALUES (:name, :email, :phone, :subject, :message, "unread", NOW(), NOW())');
$stmt->execute([
    ':name' => $name,
    ':email' => $email,
    ':phone' => $phone,
    ':subject' => $subject,
    ':message' => $message,
]);

jsonResponse(true, 'Message sent successfully.', [], 201);
