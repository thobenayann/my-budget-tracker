import { PrismaClient } from '@prisma/client';
import { fieldEncryptionExtension } from 'prisma-field-encryption';

const prismaClientSingleton = () => {
    const globalClient = new PrismaClient();
    return globalClient.$extends(
        fieldEncryptionExtension({
            encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
        })
    );
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
