import express from 'express';
import bodyParser from 'body-parser';

import {
  createBooking,
  getBookingHistory,
  getBookings,
  getCredits,
} from './routes/routes';

const app = express();
app.use(bodyParser.json());
const router = express.Router();
// Define routes using router
router.get('/bookings/history', getBookingHistory);
router.get('/bookings', getBookings);
router.post('/bookings', createBooking);
router.get('/credits/:patientId', getCredits);

// Mount the router on the main app
app.use('/', router);

app.get('/', router);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
