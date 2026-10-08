<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

verifyCsrfToken();

$name = sanitizeInput($_POST['name'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$phone = sanitizeInput($_POST['phone'] ?? '');
$subject = sanitizeInput($_POST['subject'] ?? '');
$message = sanitizeInput($_POST['message'] ?? '');

if ($name === '' || $email === '' || $phone === '' || $subject === '' || $message === '') {
    jsonResponse(false, 'All fields are required.', [], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'Enter a valid email address.', [], 400);
}
if (!preg_match('/^[+0-9][0-9().\-\s]{7,25}$/', $phone)) {
    jsonResponse(false, 'Enter a valid phone number.', [], 400);
}
if (mb_strlen($subject) < 3 || mb_strlen($subject) > 200) {
    jsonResponse(false, 'Subject must be between 3 and 200 characters.', [], 400);
}
if (mb_strlen($message) < 10 || mb_strlen($message) > 5000) {
    jsonResponse(false, 'Message must be between 10 and 5,000 characters.', [], 400);
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
