-- =====================================================
-- PetCare Sample Data
-- Use this file to populate the database with test data
-- =====================================================

USE petcare_db;

-- =====================================================
-- SAMPLE USERS
-- =====================================================
INSERT INTO users (full_name, age, email, pass, role, phone, address, is_active, email_verified) VALUES
('John Doe', 30, 'john@example.com', '$2b$12$0W.E/HXm1qC8xzxnG5ZNy.uTI5GI1ki1/jxL.ir7IYDDQC.yZedGi', 'Adopter', '+91-9876543211', '123 Main Street, Mumbai, Maharashtra', TRUE, TRUE),
('Jane Smith', 28, 'jane@example.com', '$2b$12$0W.E/HXm1qC8xzxnG5ZNy.uTI5GI1ki1/jxL.ir7IYDDQC.yZedGi', 'Owner', '+91-9876543212', '456 Oak Avenue, Delhi, Delhi', TRUE, TRUE),
('Mike Johnson', 35, 'mike@example.com', '$2b$12$0W.E/HXm1qC8xzxnG5ZNy.uTI5GI1ki1/jxL.ir7IYDDQC.yZedGi', 'Adopter', '+91-9876543213', '789 Pine Road, Bangalore, Karnataka', TRUE, TRUE),
('Sarah Wilson', 32, 'sarah@example.com', '$2b$12$0W.E/HXm1qC8xzxnG5ZNy.uTI5GI1ki1/jxL.ir7IYDDQC.yZedGi', 'Owner', '+91-9876543214', '321 Elm Street, Chennai, Tamil Nadu', TRUE, TRUE),
('David Brown', 29, 'david@example.com', '$2b$12$0W.E/HXm1qC8xzxnG5ZNy.uTI5GI1ki1/jxL.ir7IYDDQC.yZedGi', 'Adopter', '+91-9876543215', '654 Maple Drive, Pune, Maharashtra', TRUE, TRUE);

-- =====================================================
-- SAMPLE PETS
-- =====================================================
INSERT INTO pets (owner_id, category, pet_name, breed, age, gender, color, weight, temperament, location, pet_image, diet_preferences, special_notes, is_available, is_adopted) VALUES
(3, 'Dog', 'Bruno', 'Labrador Retriever', 3, 'Male', 'Golden', 28.5, 'Friendly, Active, Great with kids', 'Kochi, Kerala', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyPLH9OdILIqXHm5ibZTrTsFc0Se5kLxEqWWasJWjyV74cWBDKZLwqq639LOGvla2D8vKlpZAcR0a1Bkkr6lazgsRGDqLl2lJIkG9RF2w4', 'Pedigree dry food, chicken, rice, occasional treats', 'Requires daily walks (at least 2x a day). Gets anxious if left alone for too long.', TRUE, FALSE),
(3, 'Dog', 'Max', 'German Shepherd', 2, 'Male', 'Black and Tan', 32.0, 'Loyal, Protective, Intelligent', 'Mumbai, Maharashtra', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_Tz914zkmrjclqK5MlrcRO3lLE9CSr9-GJQ&s', 'Royal Canin, raw meat, vegetables', 'Needs experienced owner. Excellent guard dog.', TRUE, FALSE),
(5, 'Cat', 'Whiskers', 'Persian', 2, 'Female', 'White', 4.2, 'Calm, Gentle, Indoor cat', 'Delhi, Delhi', '', 'Royal Canin, wet food, treats', 'Prefers quiet environment. Loves to be brushed daily.', TRUE, FALSE),
(5, 'Cat', 'Luna', 'Siamese', 1, 'Female', 'Cream', 3.8, 'Playful, Vocal, Social', 'Chennai, Tamil Nadu', '', 'Hills Science Diet, fish, chicken', 'Very talkative. Needs attention and playtime.', TRUE, FALSE),
(3, 'Bird', 'Charlie', 'African Grey Parrot', 1, 'Male', 'Grey', 0.5, 'Intelligent, Talkative, Social', 'Bangalore, Karnataka', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMUMHjOWczDMIy6G3cys3N5F16RH6TE82s9Q&s', 'Seeds, fruits, vegetables, nuts', 'Can mimic human speech. Needs mental stimulation.', TRUE, FALSE),
(5, 'Bird', 'Sunny', 'Cockatiel', 2, 'Male', 'Yellow and White', 0.3, 'Friendly, Musical, Curious', 'Pune, Maharashtra', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHcIgtszPylocsE0iU6IVaQCMOjomNq-ZhUQ&s', 'Bird seed mix, fresh fruits, vegetables', 'Loves to whistle and sing. Enjoys being out of cage.', TRUE, FALSE),
(3, 'Dog', 'Bella', 'Golden Retriever', 4, 'Female', 'Golden', 26.0, 'Gentle, Patient, Great with children', 'Kochi, Kerala', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGVxFUJBylRrgYbvJiC42cjrQFvVXm4CIqbA&s', 'Hill\'s Science Diet, chicken, rice', 'Perfect family dog. Loves water and swimming.', TRUE, FALSE),
(5, 'Cat', 'Shadow', 'Maine Coon', 3, 'Male', 'Black', 6.5, 'Large, Gentle, Dog-like personality', 'Mumbai, Maharashtra', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn_vhmiEvc-hBJ7gyTul8w7M7nzMQISiL9sQ&s', 'High-quality dry food, wet food', 'Large breed cat. Very social and friendly.', TRUE, FALSE);

-- =====================================================
-- SAMPLE VACCINATIONS
-- =====================================================
INSERT INTO vaccinations (pet_id, vaccine_name, vaccine_type,  certificate_file) VALUES
-- Bruno (Dog) - Compulsory vaccines
(1, 'Rabies', 'Compulsory', 'bruno_rabies_cert.pdf'),
(1, 'DHPPi', 'Compulsory', 'bruno_dhppi_cert.pdf'),
(1, 'Leptospirosis', 'Compulsory', 'bruno_lepto_cert.pdf'),
(1, 'Bordetella', 'Extra', 'bruno_bordetella_cert.pdf'),

-- Max (Dog) - Compulsory vaccines
(2, 'Rabies', 'Compulsory', 'max_rabies_cert.pdf'),
(2, 'DHPPi', 'Compulsory', 'max_dhppi_cert.pdf'),
(2, 'Leptospirosis', 'Compulsory', 'max_lepto_cert.pdf'),

-- Whiskers (Cat) - Compulsory vaccines
(3, 'Rabies', 'Compulsory', 'whiskers_rabies_cert.pdf'),
(3, 'Feline Distemper', 'Compulsory', 'whiskers_distemper_cert.pdf'),
(3, 'Calicivirus', 'Compulsory', 'whiskers_calici_cert.pdf'),
(3, 'Feline Leukemia', 'Extra', 'whiskers_leukemia_cert.pdf'),

-- Luna (Cat) - Compulsory vaccines
(4, 'Rabies', 'Compulsory', 'luna_rabies_cert.pdf'),
(4, 'Feline Distemper', 'Compulsory', 'luna_distemper_cert.pdf'),
(4, 'Calicivirus', 'Compulsory', 'luna_calici_cert.pdf'),

-- Charlie (Bird) - Compulsory vaccines
(5, 'Avian Influenza', 'Compulsory', 'charlie_avian_cert.pdf'),
(5, 'Newcastle Disease', 'Compulsory', 'charlie_newcastle_cert.pdf'),

-- Sunny (Bird) - Compulsory vaccines
(6, 'Avian Influenza', 'Compulsory', 'sunny_avian_cert.pdf'),
(6, 'Newcastle Disease', 'Compulsory', 'sunny_newcastle_cert.pdf'),

-- Bella (Dog) - Compulsory vaccines
(7, 'Rabies', 'Compulsory', 'bella_rabies_cert.pdf'),
(7, 'DHPPi', 'Compulsory', 'bella_dhppi_cert.pdf'),
(7, 'Leptospirosis', 'Compulsory', 'bella_lepto_cert.pdf'),

-- Shadow (Cat) - Compulsory vaccines
(8, 'Rabies', 'Compulsory', 'shadow_rabies_cert.pdf'),
(8, 'Feline Distemper', 'Compulsory', 'shadow_distemper_cert.pdf'),
(8, 'Calicivirus', 'Compulsory', 'shadow_calici_cert.pdf');

-- =====================================================
-- SAMPLE ADOPTION REQUESTS
-- =====================================================
INSERT INTO adoption_requests (
    pet_id, adopter_id, full_name, age, email, phone, address,
    home_type, has_fenced_yard, household_members, other_pets,
    adopted_before, pet_experience, dedicated_hours_per_day, willing_medical_care,
    adoption_reason, preferences, ready_for_training, willing_agreement, references_info, aware_of_fees, commitment_promise, created_at
) VALUES
(1, 2, 'John Doe', 28, 'john@example.com', '+91-9876543211', '123 Main Street, Mumbai, Maharashtra',
 'Owned', TRUE, 'Wife and 2 children (ages 5 and 8)', 'None currently',
 TRUE, 'Grew up with dogs, had a Golden Retriever for 10 years', 4, TRUE,
 'Looking for a family companion for my children. Bruno seems perfect for our active family.', 'Prefer large, active dogs that are good with kids', TRUE, TRUE, 'Dr. Smith (Vet): +91-9876543401, Friend: Mike Johnson', TRUE, TRUE, '2024-09-01 10:30:00'),

(3, 4, 'Mike Johnson', 35, 'mike@example.com', '+91-9876543213', '789 Pine Road, Bangalore, Karnataka',
 'Owned', FALSE, 'Live alone', '1 cat (Mittens, 3 years old)',
 TRUE, 'Have had cats for 15 years, very experienced', 6, TRUE,
 'Whiskers looks like a perfect companion for my current cat. Both are calm and gentle.', 'Prefer calm, indoor cats', TRUE, TRUE, 'Dr. Brown (Vet): +91-9876543402', TRUE, TRUE, '2024-09-02 14:20:00'),

(5, 6, 'David Brown', 42, 'david@example.com', '+91-9876543215', '654 Maple Drive, Pune, Maharashtra',
 'Owned', TRUE, 'Wife and teenage daughter', 'None currently',
 FALSE, 'New to bird ownership but have done extensive research', 3, TRUE,
 'Always wanted a talking bird. Charlie seems intelligent and would be a great addition to our family.', 'Prefer intelligent, social birds', TRUE, TRUE, 'Dr. Davis (Vet): +91-9876543403', TRUE, TRUE, '2024-09-03 09:15:00');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check data insertion
SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Pets', COUNT(*) FROM pets
UNION ALL
SELECT 'Vaccinations', COUNT(*) FROM vaccinations
UNION ALL
SELECT 'Adoption Requests', COUNT(*) FROM adoption_requests;

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

UPDATE pets
SET pet_image = pet_image
WHERE pet_image IS NOT NULL AND pet_image != '' AND pet_image LIKE 'http%';

UPDATE pets
SET pet_image = CONCAT('/uploads/', pet_image)
WHERE pet_image IS NOT NULL AND pet_image != '' 
  AND pet_image NOT LIKE '/uploads/%'
  AND pet_image NOT LIKE 'http%';
