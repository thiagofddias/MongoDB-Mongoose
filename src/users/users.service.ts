import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './models/users.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { SingupDto } from './dto/singup.dto';
import { SinginDto } from './dto/singin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  public async signup(signupDto: SingupDto) {
    const user = new this.usersModel(signupDto);
    return user.save();
  }

  public async signin(
    singinDto: SinginDto,
  ): Promise<{ name: string; jwtToken: string; email: string }> {
    const user = await this.findByEmail(singinDto.email);
    const match = await this.checkPassword(singinDto.password, user);
    if (!match) {
      throw new NotFoundException('Invalid Credentials ');
    }

    const userId = user._id.toString();
    const jwtToken = await this.authService.createAccessToken(userId);

    return { name: user.name, jwtToken, email: user.email };
  }

  public async findAll(): Promise<User[]> {
    return this.usersModel.find();
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    return user;
  }

  private async checkPassword(password: string, user: User): Promise<boolean> {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new NotFoundException('Password not found');
    }
    return match;
  }
}
