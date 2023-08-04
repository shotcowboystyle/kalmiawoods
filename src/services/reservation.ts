import { prisma } from '@/lib/db.js';
import type { BuildingEnum, Reservation } from '@/types/Reservation';
import type { Reservation as PrismaReservation, User, UserProfile } from '@prisma/client';

interface AuthUserWithProfile extends User {
  profile: UserProfile;
}

interface DatabaseReservation extends PrismaReservation {
  user: AuthUserWithProfile;
}

const transformDatabaseReservation = (databaseReservation: DatabaseReservation): Reservation => ({
  reservationId: databaseReservation.id,
  title: databaseReservation.title ?? undefined,
  checkInDate: databaseReservation.check_in_date,
  checkOutDate: databaseReservation.check_out_date,
  buildings: databaseReservation.buildings,
  userId: databaseReservation.user_id,
  user: {
    email: databaseReservation.user.email,
    address: databaseReservation.user.profile.address ?? undefined,
    firstName: databaseReservation.user.profile.first_name,
    lastName: databaseReservation.user.profile.last_name,
    mobilePhone: databaseReservation.user.profile.mobile_phone,
    avatar: databaseReservation.user.profile.avatar ?? undefined,
  },
});

export const createReservation = async ({
  title,
  checkInDate,
  checkOutDate,
  buildings,
  userId,
}: {
  title?: string;
  checkInDate: Date;
  checkOutDate: Date;
  buildings: BuildingEnum[];
  userId: string;
}) => {
  const createdReservation = await prisma.reservation.create({
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
    data: {
      ...(title && title.length && { title }),
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      buildings,
      user_id: userId,
    },
  });

  return transformDatabaseReservation(createdReservation as DatabaseReservation);
};

export const updateReservation = async ({
  reservationId,
  title,
  checkInDate,
  checkOutDate,
  buildings,
}: {
  reservationId: string;
  title?: string;
  checkInDate: Date;
  checkOutDate: Date;
  buildings: BuildingEnum[];
}) => {
  try {
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        ...(title && title.length && { title }),
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        buildings,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return transformDatabaseReservation(updatedReservation as DatabaseReservation);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

interface ReservationQuery {
  startDate?: string | null;
  endDate?: string | null;
}

export const getReservations = async (reservationQuery: ReservationQuery) => {
  // const { startDate, endDate } = reservationQuery;
  const { startDate, endDate } = reservationQuery;

  const startDateCheck = new Date(`${startDate} 00:00:00`);
  // const endDateCheck = new Date(endDate + ' 23:59:00');

  // const startDateCheckString = `"${formatQueryDateRange(startDateCheck)}"`;
  // const startEndDateCheck = `"${formatQueryDateRange(endDateCheck)}"`;

  try {
    const databaseReservations = await prisma.reservation.findMany({
      where: {
        check_in_date: {
          gte: startDateCheck,
        },
        // check_out_date: {
        //   lte: endDateCheck,
        // },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      // orderBy: {
      //   date_sent: "desc",
      // },
    });

    return (databaseReservations as DatabaseReservation[]).map((databaseReservation) =>
      transformDatabaseReservation(databaseReservation),
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getReservation = async (reservationId: string) => {
  try {
    const databaseReservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!databaseReservation) {
      return null;
    }

    return transformDatabaseReservation(databaseReservation as DatabaseReservation);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteReservation = async (reservationId: string) => {
  try {
    return await prisma.reservation.delete({
      where: { id: reservationId },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
