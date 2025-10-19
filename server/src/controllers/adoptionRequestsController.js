import { db } from '../server.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// @desc    Create a new adoption request
// @route   POST /api/adoption-requests
// @access  Private (authenticated adopters)
export const createAdoptionRequest = asyncHandler(async (req, res, next) => {
	const adopterId = req.user.userId;
	const {
		pet_id,
		full_name,
		age,
		email,
		phone,
		address,
		home_type,
		has_fenced_yard,
		household_members,
		other_pets,
		adopted_before,
		pet_experience,
		dedicated_hours_per_day,
		willing_medical_care,
		adoption_reason,
		preferences,
		ready_for_training,
		willing_agreement,
		references_info,
		aware_of_fees,
		commitment_promise,
		home_photo,
		scheduled_visit
	} = req.body;

	// Basic validation
	if (!pet_id) throw new AppError('pet_id is required', 400);
	if (!full_name || !email || !phone || !address) {
		throw new AppError('Please provide full_name, email, phone and address', 400);
	}

	// Check pet exists and is available
	const [pets] = await db.query('SELECT * FROM pets WHERE pet_id = ?', [pet_id]);
	if (pets.length === 0) throw new AppError('Pet not found', 404);
	const pet = pets[0];
	if (!pet.is_available) throw new AppError('Pet is not available for adoption', 400);

	const sql = `
		INSERT INTO adoption_requests (
			pet_id, adopter_id, full_name, age, email, phone, address,
			home_type, has_fenced_yard, household_members, other_pets,
			adopted_before, pet_experience, dedicated_hours_per_day, willing_medical_care,
			adoption_reason, preferences, ready_for_training, willing_agreement,
			references_info, aware_of_fees, commitment_promise, home_photo, scheduled_visit
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`;

	const params = [
		pet_id,
		adopterId,
		full_name,
		age || null,
		email,
		phone,
		address,
		home_type || null,
		has_fenced_yard ? 1 : 0,
		household_members || null,
		other_pets || null,
		adopted_before ? 1 : 0,
		pet_experience || null,
		dedicated_hours_per_day || null,
		willing_medical_care ? 1 : 0,
		adoption_reason || null,
		preferences || null,
		ready_for_training ? 1 : 0,
		willing_agreement ? 1 : 0,
		references_info || null,
		aware_of_fees ? 1 : 0,
		commitment_promise ? 1 : 0,
		home_photo || null,
		scheduled_visit || null
	];

	const [result] = await db.query(sql, params);

	res.status(201).json({
		status: 'success',
		message: 'Adoption request submitted successfully',
		requestId: result.insertId
	});
});

export default {
	createAdoptionRequest
};
