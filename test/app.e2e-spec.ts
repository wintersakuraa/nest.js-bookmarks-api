import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

describe('App e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                // remove elements that ae not defined in dto
                whitelist: true,
            }),
        );
        await app.init();
        await app.listen(3333);

        prisma = app.get(PrismaService);
        await prisma.cleanDb();

        pactum.request.setBaseUrl('http://localhost:3333');
    });

    afterAll(() => {
        app.close();
    });

    describe('Auth', () => {
        const dto: AuthDto = {
            email: 'wintersakura@gmail.com',
            password: 'qwerty',
        };

        describe('SignUp', () => {
            it('should throw if email empty', () => {
                return pactum
                    .spec()
                    .post('/auth/sign-up')
                    .withBody({
                        password: dto.password,
                    })
                    .expectStatus(400);
            });

            it('should throw if password empty', () => {
                return pactum
                    .spec()
                    .post('/auth/sign-up')
                    .withBody({
                        email: dto.email,
                    })
                    .expectStatus(400);
            });

            it('should throw if no body provided', () => {
                return pactum
                    .spec()
                    .post('/auth/sign-up')
                    .withBody({})
                    .expectStatus(400);
            });

            it('should sign-up', () => {
                return pactum
                    .spec()
                    .post('/auth/sign-up')
                    .withBody(dto)
                    .expectStatus(201);
            });
        });

        describe('SignIn', () => {
            it('should throw if email empty', () => {
                return pactum
                    .spec()
                    .post('/auth/sign-in')
                    .withBody({
                        password: dto.password,
                    })
                    .expectStatus(400);
            });

            it('should throw if password empty', () => {
                return pactum
                    .spec()
                    .post('/auth/sign-in')
                    .withBody({
                        email: dto.email,
                    })
                    .expectStatus(400);
            });

            it('should throw if no body provided', () => {
                return pactum
                    .spec()
                    .post('/auth/sign-in')
                    .withBody({})
                    .expectStatus(400);
            });

            it('should sign-in', () => {
                return pactum
                    .spec()
                    .post('/auth/sign-in')
                    .withBody(dto)
                    .expectStatus(200)
                    .stores('userAccToken', 'token');
            });
        });
    });

    describe('User', () => {
        describe('Get user', () => {
            it('should get current user', () => {
                return pactum
                    .spec()
                    .get('/users')
                    .withHeaders({ Authorization: 'Bearer $S{userAccToken}' })
                    .expectStatus(200);
            });
        });

        describe('Edit user', () => {
            it('should edit current user', () => {
                const dto: EditUserDto = {
                    username: 'wintersakura',
                };

                return pactum
                    .spec()
                    .patch('/users')
                    .withHeaders({ Authorization: 'Bearer $S{userAccToken}' })
                    .withBody(dto)
                    .expectStatus(200)
                    .expectBodyContains(dto.username);
            });
        });
    });

    describe('Bookmarks', () => {
        describe('Get empty bookmarks', () => {
            it('should get empty bookmarks', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({ Authorization: 'Bearer $S{userAccToken}' })
                    .expectStatus(200)
                    .expectBody([]);
            });
        });

        describe('Create bookmarks', () => {
            const dto: CreateBookmarkDto = {
                title: 'First Bookmark',
                link: 'https://www.youtube.com/watch?v=GHTA143_b-s&ab_channel=freeCodeCamp.org',
            };

            it('should create bookmarks', () => {
                return pactum
                    .spec()
                    .post('/bookmarks')
                    .withHeaders({ Authorization: 'Bearer $S{userAccToken}' })
                    .withBody(dto)
                    .expectStatus(201)
                    .stores('bookmarkId', 'id');
            });
        });

        describe('Get bookmarks', () => {
            it('should get bookmarks', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccToken}',
                    })
                    .expectStatus(200)
                    .expectJsonLength(1);
            });
        });

        describe('Get bookmark by id', () => {
            it('should get bookmark by id', () => {
                return pactum
                    .spec()
                    .get('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccToken}',
                    })
                    .expectStatus(200)
                    .expectBodyContains('$S{bookmarkId}');
            });
        });

        describe('Edit bookmark', () => {
            const dto: EditBookmarkDto = {
                description: 'Nest js course',
            };

            it('should edit bookmark', () => {
                return pactum
                    .spec()
                    .patch('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withBody(dto)
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccToken}',
                    })
                    .expectStatus(200)
                    .expectBodyContains('$S{bookmarkId}')
                    .expectBodyContains(dto.description);
            });
        });
        describe('Delete bookmark', () => {
            it('should delete bookmark', () => {
                return pactum
                    .spec()
                    .delete('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccToken}',
                    })
                    .expectStatus(204);
            });

            it('should get empty bookmarks', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({ Authorization: 'Bearer $S{userAccToken}' })
                    .expectStatus(200)
                    .expectBody([]);
            });
        });
    });
});
