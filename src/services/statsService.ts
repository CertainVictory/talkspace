import { Op } from 'sequelize';
import sequelize from '../sequelize';
import { Credit } from '../sequelize/models/creditModel';
import { Booking } from '../sequelize/models/bookingModel';

export const getProviderStats = async (providerId: string) => {
  try {
    const stats = Booking.findAll({
      attributes: [
        [
          sequelize.fn(
            'COUNT',
            sequelize.literal(
              'DISTINCT CASE WHEN status = "canceled" THEN id END'
            )
          ),
          'canceledBookings',
        ],
        [
          sequelize.fn(
            'COUNT',
            sequelize.literal(
              'DISTINCT CASE WHEN status = "rescheduled" THEN id END'
            )
          ),
          'rescheduledBookings',
        ],
      ],
      where: {
        provider: providerId,
        [Op.or]: [{ status: 'canceled' }, { status: 'rescheduled' }],
      },
    });

    // Extract the results from the stats
    const [result] = await stats;

    // Prepare the statistic information
    const canceledBookings = result.getDataValue('canceledBookings') || 0;
    const rescheduledBookings = result.getDataValue('rescheduledBookings') || 0;

    return [canceledBookings, rescheduledBookings];
  } catch (error) {
    console.error(
      'Error getting cancellation and reschedule statistics:',
      error
    );
    throw error;
  }
};

export const getCreditsUsedStats = async (patientId: string) => {
  try {
    // Retrieve total credits available for the specified patient
    const totalCreditsQuery = await Credit.sum('type', {
      where: {
        BookingId: null, // Credits not associated with any booking
      },
    });

    // Retrieve monthly credits used by the specified patient
    const stats = await Booking.findAll({
      attributes: [
        [
          sequelize.fn(
            'SUM',
            sequelize.literal(
              'CASE WHEN "Booking"."status" = "confirmed" THEN "Credit"."type" END'
            )
          ),
          'totalCreditsUsed',
        ],
        [sequelize.fn('MONTH', sequelize.col('"Booking"."time"')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('"Booking"."time"')), 'year'],
      ],
      include: [
        {
          model: Credit,
          attributes: [],
          where: {
            BookingId: sequelize.literal('"Booking"."id"'), // Match Credit to Booking
          },
        },
      ],
      where: {
        patient: patientId,
        status: 'confirmed',
      },
      group: ['month', 'year'],
    });

    // Extract the results from the stats
    const result = stats.map((row) => ({
      totalCreditsUsed: row.getDataValue('totalCreditsUsed') || 0,
      month: row.getDataValue('month'),
      year: row.getDataValue('year'),
    }));

    // Calculate the percentage for each month
    const totalCreditsAvailable = totalCreditsQuery || 1; // To avoid division by zero
    const monthlyStatsWithPercentage = result.map((row) => ({
      ...row,
      percentageCreditsUsed:
        (row.totalCreditsUsed / totalCreditsAvailable) * 100,
    }));

    return monthlyStatsWithPercentage;
  } catch (error) {
    console.error('Error getting monthly credits used statistics:', error);
    throw error;
  }
};
