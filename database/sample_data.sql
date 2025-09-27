-- =====================================================
-- PetCare Sample Data
-- Use this file to populate the database with test data
-- =====================================================

USE petcare_db;

-- =====================================================
-- SAMPLE USERS
-- =====================================================
INSERT INTO users (full_name, email, password_hash, role, phone, address, is_active, email_verified) VALUES
('Admin User', 'admin@petcare.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', '+91-9876543210', 'PetCare Office, Kochi, Kerala', TRUE, TRUE),
('John Doe', 'john@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Adopter', '+91-9876543211', '123 Main Street, Mumbai, Maharashtra', TRUE, TRUE),
('Jane Smith', 'jane@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Owner', '+91-9876543212', '456 Oak Avenue, Delhi, Delhi', TRUE, TRUE),
('Mike Johnson', 'mike@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Adopter', '+91-9876543213', '789 Pine Road, Bangalore, Karnataka', TRUE, TRUE),
('Sarah Wilson', 'sarah@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Owner', '+91-9876543214', '321 Elm Street, Chennai, Tamil Nadu', TRUE, TRUE),
('David Brown', 'david@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Adopter', '+91-9876543215', '654 Maple Drive, Pune, Maharashtra', TRUE, TRUE);

-- =====================================================
-- SAMPLE PETS
-- =====================================================
INSERT INTO pets (owner_id, category, pet_name, breed, age, gender, color, weight, temperament, location, pet_image, diet_preferences, special_notes, is_available, is_adopted) VALUES
(3, 'Dog', 'Bruno', 'Labrador Retriever', 3, 'Male', 'Golden', 28.5, 'Friendly, Active, Great with kids', 'Kochi, Kerala', 'pet1.jpg', 'Pedigree dry food, chicken, rice, occasional treats', 'Requires daily walks (at least 2x a day). Gets anxious if left alone for too long.', TRUE, FALSE),
(3, 'Dog', 'Max', 'German Shepherd', 2, 'Male', 'Black and Tan', 32.0, 'Loyal, Protective, Intelligent', 'Mumbai, Maharashtra', 'pet2.jpg', 'Royal Canin, raw meat, vegetables', 'Needs experienced owner. Excellent guard dog.', TRUE, FALSE),
(5, 'Cat', 'Whiskers', 'Persian', 2, 'Female', 'White', 4.2, 'Calm, Gentle, Indoor cat', 'Delhi, Delhi', 'pet3.jpg', 'Royal Canin, wet food, treats', 'Prefers quiet environment. Loves to be brushed daily.', TRUE, FALSE),
(5, 'Cat', 'Luna', 'Siamese', 1, 'Female', 'Cream', 3.8, 'Playful, Vocal, Social', 'Chennai, Tamil Nadu', 'pet4.jpg', 'Hills Science Diet, fish, chicken', 'Very talkative. Needs attention and playtime.', TRUE, FALSE),
(3, 'Bird', 'Charlie', 'African Grey Parrot', 1, 'Male', 'Grey', 0.5, 'Intelligent, Talkative, Social', 'Bangalore, Karnataka', 'pet5.jpg', 'Seeds, fruits, vegetables, nuts', 'Can mimic human speech. Needs mental stimulation.', TRUE, FALSE),
(5, 'Bird', 'Sunny', 'Cockatiel', 2, 'Male', 'Yellow and White', 0.3, 'Friendly, Musical, Curious', 'Pune, Maharashtra', 'pet6.jpg', 'Bird seed mix, fresh fruits, vegetables', 'Loves to whistle and sing. Enjoys being out of cage.', TRUE, FALSE),
(3, 'Dog', 'Bella', 'Golden Retriever', 4, 'Female', 'Golden', 26.0, 'Gentle, Patient, Great with children', 'Kochi, Kerala', 'pet7.jpg', 'Hill\'s Science Diet, chicken, rice', 'Perfect family dog. Loves water and swimming.', TRUE, FALSE),
(5, 'Cat', 'Shadow', 'Maine Coon', 3, 'Male', 'Black', 6.5, 'Large, Gentle, Dog-like personality', 'Mumbai, Maharashtra', 'pet8.jpg', 'High-quality dry food, wet food', 'Large breed cat. Very social and friendly.', TRUE, FALSE);

-- =====================================================
-- SAMPLE HEALTH RECORDS
-- =====================================================
INSERT INTO pet_health_records (pet_id, is_dewormed, is_neutered, is_spayed, is_wings_clipped, has_major_illness, illness_description, last_checkup_date, next_checkup_date, vet_name, vet_contact) VALUES
(1, TRUE, TRUE, FALSE, FALSE, FALSE, NULL, '2024-07-01', '2024-12-01', 'Dr. Sarah Wilson', '+91-9876543301'),
(2, TRUE, TRUE, FALSE, FALSE, FALSE, NULL, '2024-06-15', '2024-12-15', 'Dr. John Brown', '+91-9876543302'),
(3, TRUE, FALSE, TRUE, FALSE, FALSE, NULL, '2024-08-01', '2025-02-01', 'Dr. Lisa Davis', '+91-9876543303'),
(4, TRUE, FALSE, TRUE, FALSE, FALSE, NULL, '2024-07-20', '2025-01-20', 'Dr. Michael Chen', '+91-9876543304'),
(5, TRUE, FALSE, FALSE, TRUE, FALSE, NULL, '2024-08-15', '2025-02-15', 'Dr. Emily White', '+91-9876543305'),
(6, TRUE, FALSE, FALSE, TRUE, FALSE, NULL, '2024-09-01', '2025-03-01', 'Dr. Robert Taylor', '+91-9876543306'),
(7, TRUE, FALSE, TRUE, FALSE, FALSE, NULL, '2024-06-30', '2024-12-30', 'Dr. Sarah Wilson', '+91-9876543301'),
(8, TRUE, TRUE, FALSE, FALSE, FALSE, NULL, '2024-07-10', '2025-01-10', 'Dr. John Brown', '+91-9876543302');

-- =====================================================
-- SAMPLE VACCINATIONS
-- =====================================================
INSERT INTO vaccinations (pet_id, vaccine_name, vaccine_type, vaccination_date, certificate_file, is_completed) VALUES
-- Bruno (Dog) - Compulsory vaccines
(1, 'Rabies', 'Compulsory', '2024-07-01', 'bruno_rabies_cert.pdf', TRUE),
(1, 'DHPPi', 'Compulsory', '2024-07-01', 'bruno_dhppi_cert.pdf', TRUE),
(1, 'Leptospirosis', 'Compulsory', '2024-07-01', 'bruno_lepto_cert.pdf', TRUE),
(1, 'Bordetella', 'Extra', '2024-07-15', 'bruno_bordetella_cert.pdf', TRUE),

-- Max (Dog) - Compulsory vaccines
(2, 'Rabies', 'Compulsory', '2024-06-15', 'max_rabies_cert.pdf', TRUE),
(2, 'DHPPi', 'Compulsory', '2024-06-15', 'max_dhppi_cert.pdf', TRUE),
(2, 'Leptospirosis', 'Compulsory', '2024-06-15', 'max_lepto_cert.pdf', TRUE),

-- Whiskers (Cat) - Compulsory vaccines
(3, 'Rabies', 'Compulsory', '2024-08-01', 'whiskers_rabies_cert.pdf', TRUE),
(3, 'Feline Distemper', 'Compulsory', '2024-08-01', 'whiskers_distemper_cert.pdf', TRUE),
(3, 'Calicivirus', 'Compulsory', '2024-08-01', 'whiskers_calici_cert.pdf', TRUE),
(3, 'Feline Leukemia', 'Extra', '2024-08-10', 'whiskers_leukemia_cert.pdf', TRUE),

-- Luna (Cat) - Compulsory vaccines
(4, 'Rabies', 'Compulsory', '2024-07-20', 'luna_rabies_cert.pdf', TRUE),
(4, 'Feline Distemper', 'Compulsory', '2024-07-20', 'luna_distemper_cert.pdf', TRUE),
(4, 'Calicivirus', 'Compulsory', '2024-07-20', 'luna_calici_cert.pdf', TRUE),

-- Charlie (Bird) - Compulsory vaccines
(5, 'Avian Influenza', 'Compulsory', '2024-08-15', 'charlie_avian_cert.pdf', TRUE),
(5, 'Newcastle Disease', 'Compulsory', '2024-08-15', 'charlie_newcastle_cert.pdf', TRUE),

-- Sunny (Bird) - Compulsory vaccines
(6, 'Avian Influenza', 'Compulsory', '2024-09-01', 'sunny_avian_cert.pdf', TRUE),
(6, 'Newcastle Disease', 'Compulsory', '2024-09-01', 'sunny_newcastle_cert.pdf', TRUE),

-- Bella (Dog) - Compulsory vaccines
(7, 'Rabies', 'Compulsory', '2024-06-30', 'bella_rabies_cert.pdf', TRUE),
(7, 'DHPPi', 'Compulsory', '2024-06-30', 'bella_dhppi_cert.pdf', TRUE),
(7, 'Leptospirosis', 'Compulsory', '2024-06-30', 'bella_lepto_cert.pdf', TRUE),

-- Shadow (Cat) - Compulsory vaccines
(8, 'Rabies', 'Compulsory', '2024-07-10', 'shadow_rabies_cert.pdf', TRUE),
(8, 'Feline Distemper', 'Compulsory', '2024-07-10', 'shadow_distemper_cert.pdf', TRUE),
(8, 'Calicivirus', 'Compulsory', '2024-07-10', 'shadow_calici_cert.pdf', TRUE);

-- =====================================================
-- SAMPLE ADOPTION REQUESTS
-- =====================================================
INSERT INTO adoption_requests (
    pet_id, adopter_id, full_name, age, email, phone, address,
    home_type, has_fenced_yard, household_members, other_pets,
    adopted_before, pet_experience, dedicated_hours_per_day, willing_medical_care,
    adoption_reason, preferences, ready_for_training, willing_agreement, references_info, aware_of_fees, commitment_promise,
    status, created_at
) VALUES
(1, 2, 'John Doe', 28, 'john@example.com', '+91-9876543211', '123 Main Street, Mumbai, Maharashtra',
 'Owned', TRUE, 'Wife and 2 children (ages 5 and 8)', 'None currently',
 TRUE, 'Grew up with dogs, had a Golden Retriever for 10 years', 4, TRUE,
 'Looking for a family companion for my children. Bruno seems perfect for our active family.', 'Prefer large, active dogs that are good with kids', TRUE, TRUE, 'Dr. Smith (Vet): +91-9876543401, Friend: Mike Johnson', TRUE, TRUE,
 'Pending', '2024-09-01 10:30:00'),

(3, 4, 'Mike Johnson', 35, 'mike@example.com', '+91-9876543213', '789 Pine Road, Bangalore, Karnataka',
 'Owned', FALSE, 'Live alone', '1 cat (Mittens, 3 years old)',
 TRUE, 'Have had cats for 15 years, very experienced', 6, TRUE,
 'Whiskers looks like a perfect companion for my current cat. Both are calm and gentle.', 'Prefer calm, indoor cats', TRUE, TRUE, 'Dr. Brown (Vet): +91-9876543402', TRUE, TRUE,
 'Pending', '2024-09-02 14:20:00'),

(5, 6, 'David Brown', 42, 'david@example.com', '+91-9876543215', '654 Maple Drive, Pune, Maharashtra',
 'Owned', TRUE, 'Wife and teenage daughter', 'None currently',
 FALSE, 'New to bird ownership but have done extensive research', 3, TRUE,
 'Always wanted a talking bird. Charlie seems intelligent and would be a great addition to our family.', 'Prefer intelligent, social birds', TRUE, TRUE, 'Dr. Davis (Vet): +91-9876543403', TRUE, TRUE,
 'Pending', '2024-09-03 09:15:00');

-- =====================================================
-- SAMPLE MESSAGES
-- =====================================================
INSERT INTO messages (sender_id, receiver_id, pet_id, subject, message_text, is_read) VALUES
(2, 3, 1, 'Question about Bruno', 'Hi! I saw Bruno\'s profile and I\'m very interested. Can you tell me more about his exercise needs?', FALSE),
(3, 2, 1, 'Re: Question about Bruno', 'Bruno needs at least 2 walks per day, about 30-45 minutes each. He loves playing fetch and swimming!', TRUE),
(4, 5, 3, 'Whiskers adoption inquiry', 'Hello! I\'m interested in adopting Whiskers. Is she good with other cats?', FALSE),
(6, 3, 5, 'Charlie adoption questions', 'Hi! I\'m considering adopting Charlie. Does he need any special care or toys?', FALSE);

-- =====================================================
-- SAMPLE FAVORITES
-- =====================================================
INSERT INTO favorites (user_id, pet_id) VALUES
(2, 1), -- John likes Bruno
(2, 7), -- John likes Bella
(4, 3), -- Mike likes Whiskers
(4, 4), -- Mike likes Luna
(6, 5), -- David likes Charlie
(6, 6); -- David likes Sunny

-- =====================================================
-- SAMPLE SYSTEM SETTINGS (Additional)
-- =====================================================
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('max_adoption_requests_per_user', '5', 'Maximum adoption requests a user can have pending'),
('adoption_approval_required', 'true', 'Whether adoption requests need admin approval'),
('email_notifications_enabled', 'true', 'Enable email notifications for users'),
('file_upload_max_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('allowed_image_formats', 'jpg,jpeg,png,gif', 'Allowed image file formats'),
('allowed_document_formats', 'pdf,jpg,jpeg,png', 'Allowed document file formats'),
('adoption_fee_minimum', '0.00', 'Minimum adoption fee'),
('adoption_fee_maximum', '5000.00', 'Maximum adoption fee'),
('pet_listing_expiry_days', '90', 'Days after which pet listing expires'),
('user_registration_approval', 'false', 'Whether new user registrations need approval');

-- =====================================================
-- SAMPLE AUDIT LOGS
-- =====================================================
INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent) VALUES
(1, 'USER_REGISTERED', 'users', 2, NULL, '{"email":"john@example.com","role":"Adopter"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(1, 'USER_REGISTERED', 'users', 3, NULL, '{"email":"jane@example.com","role":"Owner"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
(3, 'PET_CREATED', 'pets', 1, NULL, '{"pet_name":"Bruno","category":"Dog","breed":"Labrador Retriever"}', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(2, 'ADOPTION_REQUEST_CREATED', 'adoption_requests', 1, NULL, '{"pet_id":1,"adopter_id":2,"status":"Pending"}', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check data insertion
SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Pets', COUNT(*) FROM pets
UNION ALL
SELECT 'Health Records', COUNT(*) FROM pet_health_records
UNION ALL
SELECT 'Vaccinations', COUNT(*) FROM vaccinations
UNION ALL
SELECT 'Adoption Requests', COUNT(*) FROM adoption_requests
UNION ALL
SELECT 'Messages', COUNT(*) FROM messages
UNION ALL
SELECT 'Favorites', COUNT(*) FROM favorites
UNION ALL
SELECT 'System Settings', COUNT(*) FROM system_settings
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM audit_logs;

-- Show available pets
SELECT pet_name, category, breed, age, gender, location, created_at 
FROM available_pets_view 
ORDER BY created_at DESC;

-- Show pending adoption requests
SELECT ar.request_id, p.pet_name, u.full_name as adopter_name, ar.status, ar.created_at
FROM adoption_requests ar
JOIN pets p ON ar.pet_id = p.pet_id
JOIN users u ON ar.adopter_id = u.user_id
WHERE ar.status = 'Pending'
ORDER BY ar.created_at DESC;
