import { prismaClient } from '@/db.js';
// import typo { Reservation } from '@kalmiawoods/database';
import { Reservation } from '@/types/reservation';
import { generateId } from '@/utils/generate-id';

const transformDatabaseReservation = (databaseReservation: any): Reservation => ({
  reservationId: databaseReservation.id,
  checkInDate: databaseReservation.check_in_date,
  checkOutDate: databaseReservation.check_out_date,
  userId: databaseReservation.user_id,
  user: {
    email: databaseReservation.auth_user.email,
    address: databaseReservation.auth_user.profile.address,
    firstName: databaseReservation.auth_user.profile.first_name,
    lastName: databaseReservation.auth_user.profile.last_name,
    mobilePhone: databaseReservation.auth_user.profile.mobile_phone,
    avatar: databaseReservation.auth_user.profile.avatar,
  },
});

export const createReservation = async ({
  checkInDate,
  checkOutDate,
  userId,
}: {
  checkInDate: Date;
  checkOutDate: Date;
  userId: string;
}) => {
  const createdReservation = await prismaClient.reservation.create({
    include: {
      auth_user: {
        include: {
          profile: true,
        },
      },
    },
    data: {
      id: generateId(8),
      check_in_date: new Date(checkInDate),
      check_out_date: new Date(checkOutDate),
      user_id: userId,
    },
  });

  return transformDatabaseReservation(createdReservation);
};

export const updateReservation = async ({
  reservationId,
  checkInDate,
  checkOutDate,
}: {
  reservationId: string;
  checkInDate: Date;
  checkOutDate: Date;
}) => {
  const updatedReservation = await prismaClient.reservation.update({
    where: { id: reservationId },
    data: {
      check_in_date: new Date(checkInDate),
      check_out_date: new Date(checkOutDate),
    },
    include: {
      auth_user: {
        include: {
          profile: true,
        },
      },
    },
  });

  return transformDatabaseReservation(updatedReservation);
};

interface ReservationQuery {
  startDate: string;
  endDate: string;
}

export const getReservations = async (reservationQuery: ReservationQuery) => {
  // const { startDate, endDate } = reservationQuery;
  const { startDate, endDate } = reservationQuery;

  const startDateCheck = new Date(`${startDate} 00:00:00`);
  // const endDateCheck = new Date(endDate + ' 23:59:00');

  // const startDateCheckString = `"${formatQueryDateRange(startDateCheck)}"`;
  // const startEndDateCheck = `"${formatQueryDateRange(endDateCheck)}"`;

  const databaseReservations = await prismaClient.reservation.findMany({
    where: {
      check_in_date: {
        gte: startDateCheck,
      },
      // check_out_date: {
      //   lte: endDateCheck,
      // },
    },
    include: {
      auth_user: {
        include: {
          profile: true,
        },
      },
    },
    // orderBy: {
    //   date_sent: "desc",
    // },
  });

  // return databaseReservations.map((databaseReservation: Reservation) => {
  return databaseReservations.map((databaseReservation: any) => transformDatabaseReservation(databaseReservation));
};

export const getReservation = async (reservationId: string) => {
  const databaseReservation = await prismaClient.reservation.findFirst({
    where: {
      id: reservationId,
    },
    include: {
      auth_user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!databaseReservation) {
    return null;
  }

  return transformDatabaseReservation(databaseReservation);
};

export const deleteReservation = async (reservationId: string) =>
  prismaClient.reservation.delete({
    where: { id: reservationId },
  });
