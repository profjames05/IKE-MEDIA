<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

$name = sanitizeInput($_POST['name'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$phone = sanitizeInput($_POST['phone'] ?? '');
$projectType = sanitizeInput($_POST['project_type'] ?? '');
$budget = sanitizeInput($_POST['budget'] ?? '');
$deadline = sanitizeInput($_POST['deadline'] ?? '');
$description = sanitizeInput($_POST['description'] ?? '');

if ($name === '' || $email === '' || $description === '') {
    jsonResponse(false, 'Name, email, and project description are required.', [], 400);
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('INSERT INTO hire_requests (name, email, phone, project_type, budget, deadline, description, status, created_at, updated_at) VALUES (:name, :email, :phone, :project_type, :budget, :deadline, :description, "new", NOW(), NOW())');
$stmt->execute([
    ':name' => $name,
    ':email' => $email,
    ':phone' => $phone,
    ':project_type' => $projectType,
    ':budget' => $budget,
    ':deadline' => $deadline,
    ':description' => $description,
]);

jsonResponse(true, 'Hire request submitted successfully.', [], 201);
