import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SingupDto } from './dto/singup.dto';
import { User } from './models/users.model';
import { SinginDto } from './dto/singin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('singup')
  @HttpCode(HttpStatus.CREATED)
  public async signup(@Body() singupDto: SingupDto): Promise<User> {
    return this.usersService.signup(singupDto);
  }

  @Post('singin')
  @HttpCode(HttpStatus.OK)
  public async signin(
    @Body() singinDto: SinginDto,
  ): Promise<{ name: string; jwtToken: string; email: string }> {
    return this.usersService.signin(singinDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
