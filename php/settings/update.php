<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$pdo = getDatabaseConnection();
$fields = [
    'website_name', 'website_title', 'website_description', 'developer_name', 'designer_name',
    'designer_email', 'designer_phone', 'designer_whatsapp', 'designer_location',
    'logo', 'favicon', 'facebook', 'instagram', 'tiktok', 'linkedin', 'behance', 'dribbble', 'youtube',
    'hero_heading', 'hero_description', 'hero_image', 'primary_button_text', 'primary_button_link',
    'secondary_button_text', 'secondary_button_link', 'projects_completed', 'happy_clients',
    'client_satisfaction', 'years_experience', 'about_heading', 'about_biography', 'profile_image',
    'skills', 'about_years_experience', 'about_projects_completed', 'about_happy_clients',
    'footer_copyright'
];

foreach ($fields as $field) {
    if (array_key_exists($field, $_POST)) {
        $value = sanitizeInput((string) $_POST[$field]);
        saveSettingValue($pdo, $field, $value);
    }
}

jsonResponse(true, 'Settings updated successfully.', [], 200);
