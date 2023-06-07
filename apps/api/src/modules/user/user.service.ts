import { Prisma, PrismaService, User } from '@kalmiawoods/database';
import { Injectable, Logger } from '@nestjs/common';
import { Result, err, ok } from 'neverthrow';

import { CRUDException } from '@/common/exceptions/crud-service.exception';
// import { EncryptionService } from '@/services/encryption.service';
// import { User } from '@/common/entities/user.entity';

import { CreateUserInputDTO } from './dtos/create-user.input.dto';
import { UserDTO } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService, // private encryptionService: EncryptionService,
  ) {}

  private readonly logger: Logger = new Logger(UserService.name);

  // exclude(users: any, keys: Array<string>): Promise<User> {
  //   users.forEach((user: any) => {
  //     keys.forEach((key) => delete user[key]);
  //   });
  //   return users;
  // }

  protected handleError(e: any) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      return new CRUDException<User>(
        'EXISTS',
        e,
        (e.meta?.target as any)?.[0] as any,
      );
    }

    this.logger.error(e);

    return new CRUDException<User>('UNKNOWN', e);
  }

  async user(where: Prisma.UserWhereUniqueInput): Promise<UserDTO | null> {
    const user = await this.prisma.user.findUnique({
      where: where,
      include: { profile: true },
    });
    this.logger.log(user);
    const { profile, ...rest } = user!;
    return user && new UserDTO({ ...profile, ...rest });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({ skip, take, cursor, where, orderBy });
  }

  async createUser(
    data: CreateUserInputDTO,
    // data: Prisma.UserCreateInput,
  ): Promise<Result<User, CRUDException<User>>> {
    // const hashedPassword = await this.encryptionService.hash(
    //   data.password,
    // );

    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          // password: hashedPassword,
          role: 'USER',
        },
      });

      return ok(user);
    } catch (e: any) {
      return err(this.handleError(e));
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<Result<User, CRUDException<User>>> {
    try {
      const { where, data } = params;
      const updatedUser = await this.prisma.user.update({ data, where });
      return ok(updatedUser);
    } catch (e) {
      return err(this.handleError(e));
    }
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }
}
