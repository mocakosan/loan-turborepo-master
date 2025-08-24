import { Injectable } from '@nestjs/common';
import { EnterprisersService } from 'src/enterprisers/enterprisers.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Enterpriser } from '@repo/db';

@Injectable()
export class AuthService {
  constructor(
    private enterprisersService: EnterprisersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identity: string, pass: string) {
    const enterpriser = await this.enterprisersService.findOne(identity);
    if (!enterpriser) {
      return null;
    }

    const verify = await argon2.verify(enterpriser.password, pass);
    if (!verify) {
      return null;
    }

    const { password, ...result } = enterpriser;

    return result;
  }

  async login(enterpriser: Enterpriser) {
    const payload = { name: enterpriser.name, sub: enterpriser.identity };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
