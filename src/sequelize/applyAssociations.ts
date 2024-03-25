const applyAssociations = (sequelize) => {
  const { Booking, User, Credit, BookingStatusHistory } = sequelize.models;

  Booking.belongsTo(Credit);
  Credit.hasOne(Booking);

  // Define the relationship between Booking and BookingStatusHistory
  Booking.hasMany(BookingStatusHistory);
  BookingStatusHistory.belongsTo(Booking);
  Booking.belongsTo(User);
  User.hasMany(Booking);
};
