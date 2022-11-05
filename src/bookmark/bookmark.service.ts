import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {}

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        return await this.prisma.bookmark.create({
            data: {
                userId: userId,
                ...dto,
            },
        });
    }

    getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: {
                userId: userId,
            },
        });
    }

    getBookmarkById(userId: number, bookmarkId: number) {
        return this.prisma.bookmark.findFirst({
            where: {
                userId: userId,
                id: bookmarkId,
            },
        });
    }

    async editBookmark(
        userId: number,
        bookmarkId: number,
        dto: EditBookmarkDto,
    ) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });

        if (!bookmarkId || bookmark.userId != userId) {
            throw new ForbiddenException('Access to resource denied');
        }

        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto,
            },
        });
    }

    async deleteBookmark(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });

        if (!bookmarkId || bookmark.userId != userId) {
            throw new ForbiddenException('Access to resource denied');
        }

        return this.prisma.bookmark.delete({
            where: {
                id: bookmarkId,
            },
        });
    }
}
