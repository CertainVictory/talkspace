import { Model, Op } from 'sequelize';
import sequelize from '../sequelize';
import { Credit } from '../sequelize/models/creditModel';
import { getProviderStats } from '../services/statsService';
import { Booking } from '../sequelize/models/bookingModel';
import { BookingStatusHistory } from '../sequelize/models/bookingStatusHistoryModel';

// Function to create a booking with an unused credit
const createBooking = async (req, res) => {
  const { time, patient, provider } = req.body;
  try {
    const result = await sequelize.transaction(async (transaction) => {
      // Find an unused credit that is not expired
      const d = new Date();
      const availableCredit = await Credit.findOne({
        where: {
          expirationDate: {
            [Op.gt]: d, // Expiration date is greater than the current date
          },
          BookingId: null, // Credit is not associated with any booking
        },
        transaction,
      });

      if (!availableCredit) {
        return res
          .status(404)
          .json({ error: 'No unused, non-expired credits found.' });
      }

      // Create a booking associated with the availableCredit
      const booking = await Booking.create(
        { time, patient, provider },
        { transaction }
      );

      // Record the initial status in the booking status history
      await BookingStatusHistory.create(
        { BookingId: booking },
        { transaction }
      );

      // Associate the booking with the credit
      await Booking.setCredit(availableCredit, { transaction });
      // need to address this later
      return {
        message: 'Booking created successfully',
        booking: booking.toJSON(),
      };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating booking:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the booking.' });
  }
};

// Function to retrieve bookings for a specific user
const getBookings = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ error: 'User ID must be provided as a query parameter.' });
  }

  try {
    // Retrieve bookings from the database for the specified user
    const bookings = await Booking.findAll({
      where: {
        [sequelize.Op.or]: [{ patient: userId }, { provider: userId }],
      },
    });

    let stats: any[] = [];
    if (bookings?.[0].provider === userId)
      stats = await getProviderStats(userId);

    res.status(200).json({ bookings, stats });
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while retrieving bookings.' });
  }
};

// Function to retrieve booking status history
const getBookingHistory = async (req, res) => {
  const { bookingId } = req.params;

  try {
    // Retrieve the booking status history from the database for the specified booking
    const history = await BookingStatusHistory.findAll({
      where: { BookingId: bookingId },
      order: [['timestamp', 'ASC']], // Order by timestamp in ascending order
    });

    res.status(200).json({ history });
  } catch (error) {
    console.error('Error retrieving booking status history:', error);
    res.status(500).json({
      error: 'An error occurred while retrieving booking status history.',
    });
  }
};
const setCredit = async (req, res) => {};
export { getBookingHistory, getBookings, createBooking };
