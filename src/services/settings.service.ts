import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SettingsService {
    private static instance: SettingsService;

    private constructor() {}

    public static getInstance(): SettingsService {
        if (!SettingsService.instance) {
            SettingsService.instance = new SettingsService();
        }
        return SettingsService.instance;
    }

    async getUserSettings(userId: number) {
        let settings = await prisma.userSettings.findUnique({
            where: { userId: BigInt(userId) }
        });

        if (!settings) {
            settings = await prisma.userSettings.create({
                data: { userId: BigInt(userId) }
            });
        }

        return settings;
    }

    async updateDownloadType(userId: number, downloadType: 'mp3' | 'mp4') {
        return prisma.userSettings.upsert({
            where: { userId: BigInt(userId) },
            update: { downloadType },
            create: {
                userId: BigInt(userId),
                downloadType
            }
        });
    }
}
