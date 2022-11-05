import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async signUp(dto: AuthDto) {
        // hash the password
        const hash = await argon.hash(dto.password);

        // add new user to db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password_hash: hash,
                },
            });

            // return token
            return this.signToken(user.id, user.email);
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ForbiddenException('Email is already taken');
                }
            }

            throw e;
        }
    }

    async signIn(dto: AuthDto) {
        // find the user
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        // if user does not exit throw exception
        if (!user) {
            throw new ForbiddenException('Incorrect credentials');
        }

        // compare passwords
        const passwordCheck = await argon.verify(
            user.password_hash,
            dto.password,
        );
        // if password incorrect throw exception
        if (!passwordCheck) {
            throw new ForbiddenException('Incorrect credentials');
        }

        // return token
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string) {
        const payload = {
            sub: userId,
            email: email,
        };

        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '60m',
            secret: secret,
        });

        return {
            token: token,
        };
    }
}
