CREATE DATABASE IF NOT EXISTS graphic_designer_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE graphic_designer_portfolio;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category_id INT NOT NULL,
  description TEXT NOT NULL,
  client VARCHAR(200) DEFAULT NULL,
  project_date DATE DEFAULT NULL,
  tools VARCHAR(255) DEFAULT NULL,
  project_type VARCHAR(120) DEFAULT NULL,
  image VARCHAR(255) DEFAULT NULL,
  featured TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category_id (category_id),
  INDEX idx_featured (featured),
  CONSTRAINT fk_projects_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  company VARCHAR(150) DEFAULT NULL,
  position VARCHAR(150) DEFAULT NULL,
  message TEXT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  image VARCHAR(255) DEFAULT NULL,
  status ENUM('published','hidden') DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  subject VARCHAR(200) DEFAULT NULL,
  message TEXT NOT NULL,
  status ENUM('unread','read','replied') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hire_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  project_type VARCHAR(150) DEFAULT NULL,
  budget VARCHAR(100) DEFAULT NULL,
  deadline VARCHAR(100) DEFAULT NULL,
  description TEXT NOT NULL,
  status ENUM('new','contacted','in_progress','completed','cancelled') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS media_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) DEFAULT 'image',
  size INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(120) DEFAULT '✦',
  sort_order INT DEFAULT 0,
  published TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO categories (name, slug, description) VALUES
('Logos', 'logos', 'Professional logo creation and visual identity systems.'),
('Flyers', 'flyers', 'Promotional design for campaigns, launches, and events.'),
('Social Media', 'social-media', 'Engaging digital graphics for marketing and brand growth.'),
('Branding', 'branding', 'Creative branding and identity design for businesses.'),
('Posters', 'posters', 'Eye-catching posters for events, launches, and awareness campaigns.'),
('Business Cards', 'business-cards', 'Elegant contact cards that make a strong first impression.'),
('Print Design', 'print-design', 'Print-ready marketing and editorial visual designs.'),
('UI Design', 'ui-design', 'User-focused digital design experiences and interfaces.')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);

INSERT INTO settings (setting_key, setting_value) VALUES
('website_name', 'Ike Peniel Media'),
('website_title', 'Ike Peniel Media | Creative Designer Portfolio'),
('website_description', 'Expanding brands through creativity. Ghanaian graphic design for brand identity, campaigns, and visual communication.'),
('developer_name', 'JTECH SOLUTIONS'),
('designer_name', 'Ike Peniel Media'),
('designer_email', 'istawiah2134@gmail.com'),
('designer_phone', '+233 20 696 3041'),
('designer_whatsapp', '+233 53 234 9114'),
('designer_location', 'Ghana'),
('facebook', ''),
('instagram', ''),
('tiktok', ''),
('linkedin', ''),
('behance', ''),
('dribbble', ''),
('youtube', ''),
('hero_heading', 'Design that speaks before you do.'),
('hero_description', 'Ghanaian graphic designer creating distinctive brand identities, campaign visuals, and digital experiences that help ambitious businesses stand out.'),
('hero_image', 'assets/images/profile/ike-peniel.jpg'),
('primary_button_text', 'View My Work'),
('primary_button_link', 'portfolio.html'),
('secondary_button_text', 'Hire Me'),
('secondary_button_link', 'contact.html#hire'),
('projects_completed', '120+'),
('happy_clients', '80+'),
('client_satisfaction', '98%'),
('years_experience', '6+'),
('about_heading', 'Meet Ike Peniel'),
('about_biography', 'Ike Peniel is the founder and CEO of Ike Peniel Media, a Ghana-based creative studio expanding brands through thoughtful graphic design, visual storytelling, and polished digital and print experiences.'),
('profile_image', 'assets/images/profile/ike-peniel.jpg'),
('skills', 'Brand Identity, Print Design, Social Media Design, UI Design, Marketing Creative, Campaign Art Direction'),
('about_years_experience', '6+'),
('about_projects_completed', '120+'),
('about_happy_clients', '80+'),
('footer_copyright', '© 2026 Ike Peniel Media. All Rights Reserved.'),
('logo', 'assets/images/logo/ike-peniel-logo.png'),
('favicon', 'assets/images/favicon.png')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

INSERT INTO projects (title, slug, category_id, description, client, project_date, tools, project_type, image, featured) VALUES
('JTech Logo Design', 'jtech-logo-design', 1, 'A premium logo identity designed for a technology startup to communicate innovation and trust.', 'JTech Labs', '2025-02-12', 'Adobe Illustrator, Figma', 'Brand Identity', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80', 1),
('Big Sale Campaign', 'big-sale-campaign', 2, 'A high-impact seasonal marketing flyer system built to boost customer engagement and campaign reach.', 'Urban Mart', '2025-03-15', 'Photoshop, InDesign', 'Marketing Flyer', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80', 1),
('Fresh Brand Identity', 'fresh-brand-identity', 4, 'A bold, modern branding concept for an organic food brand targeting premium lifestyle buyers.', 'Freshly Co.', '2025-04-18', 'Illustrator, Photoshop', 'Brand Strategy', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80', 1),
('Luxe Branding', 'luxe-branding', 4, 'Luxury rebranding for a boutique interior design company with an elevated editorial finishing.', 'Luxe Atelier', '2025-06-05', 'Illustrator, After Effects', 'Luxury Branding', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', 0),
('Food Menu Design', 'food-menu-design', 7, 'Sophisticated menu design for a restaurant collection with clear hierarchy and premium visual language.', 'Bistro 31', '2025-01-20', 'InDesign, Photoshop', 'Print Design', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80', 0),
('Birthday Flyer', 'birthday-flyer', 2, 'A playful birthday promotional flyer designed for online invitations and social promotions.', 'Pine & Co.', '2025-02-01', 'Canva, Photoshop', 'Event Flyer', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80', 0),
('Tech Conference Poster', 'tech-conference-poster', 5, 'Poster system for a tech conference featuring bold typography and futuristic visual accents.', 'LaunchCon 2025', '2025-05-24', 'Illustrator, Photoshop', 'Poster Design', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80', 1),
('Business Card Design', 'business-card-design', 6, 'Minimal corporate business cards with a luxury finish for premium client interactions.', 'North Peak', '2024-12-09', 'Illustrator, InDesign', 'Corporate Identity', 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=80', 1),
('Social Media Campaign', 'social-media-campaign', 3, 'Social media template system and creative assets for a month-long digital campaign refresh.', 'Nest Media', '2025-07-11', 'Photoshop, Figma', 'Social Graphics', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80', 0)
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), image = VALUES(image);

INSERT INTO testimonials (name, company, position, message, rating, image, status) VALUES
('Ama Serwaa', 'Sample client · Accra, Ghana', 'Business owner', 'Sample feedback: The new brand identity feels confident and consistent. The process was thoughtful, and the final designs represent our business beautifully.', 5, 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80', 'published'),
('Kofi Mensah', 'Sample client · Kumasi, Ghana', 'Marketing lead', 'Sample feedback: The campaign designs brought our ideas to life with clear messaging and a strong visual style across our channels.', 5, 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80', 'published'),
('Nana Akua Boateng', 'Sample client · Tema, Ghana', 'Creative entrepreneur', 'Sample feedback: I appreciated the care and communication throughout the project. The finished visuals gave our launch a polished, memorable look.', 5, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', 'published')
ON DUPLICATE KEY UPDATE message = VALUES(message), rating = VALUES(rating);

INSERT INTO messages (name, email, phone, subject, message, status) VALUES
('Maya Patel', 'maya@example.com', '+1 555 000 1111', 'Project Inquiry', 'I would love to discuss a premium branding package for my startup.', 'unread'),
('Leo Martin', 'leo@example.com', '+1 555 000 2222', 'Design Consultation', 'Could we schedule a call for a social media redesign?', 'read')
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO hire_requests (name, email, phone, project_type, budget, deadline, description, status) VALUES
('Harper Lane', 'harper@example.com', '+1 555 000 3333', 'Brand Identity', '$1,500 - $3,000', '2 weeks', 'Need a complete identity refresh with logo and social kit for my business launch.', 'new'),
('Noah Reed', 'noah@example.com', '+1 555 000 4444', 'Print Design', '$500 - $1,000', '1 week', 'Need a brochure and business card package for our local store.', 'contacted')
ON DUPLICATE KEY UPDATE status = VALUES(status);
