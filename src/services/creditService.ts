import { getCreditsUsedStats } from './statsService';
import { Credit } from '../sequelize/models/creditModel';

export const getCredits = async (req, res) => {
  const { patientId } = req.params;
  if (!patientId) {
    return res
      .status(400)
      .json({ error: 'patient Id must be provided as a query parameter.' });
  }

  try {
    // get credits for the specified patient
    const credits = await Credit.findAll({
      where: {
        patient: patientId,
      },
    });
    // Retrieve the monthly credits used statistics from the database for the specified patient
    const stats = await getCreditsUsedStats(patientId);

    res.status(200).json({ credits, stats });
  } catch (error) {
    console.error('Error retrieving monthly credits used statistics:', error);
    res.status(500).json({
      error:
        'An error occurred while retrieving monthly credits used statistics.',
    });
  }
};
