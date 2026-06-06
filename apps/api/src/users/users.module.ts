import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UsersPublicController } from "./users-public.controller";

@Module({
  providers: [UsersService],
  controllers: [UsersController, UsersPublicController],
  exports: [UsersService],
})
export class UsersModule {}
