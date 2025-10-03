import { PrismaClient, UserRole } from '@prisma/client'; // Import UserRole enum
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
    // --- Admin User Creation ---
    const adminEmail = 'admin@iitrcampus.com';
    const admin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (!admin) {
        const hashedPassword = await bcrypt.hash('admin123', 10); // Consider a stronger password for production
        await prisma.user.create({
            data: {
                name: 'IT Admin',
                email: adminEmail,
                password: hashedPassword,
                role: UserRole.ADMIN, // Fixed: Use the enum value
                departmentName: 'IT',
                headName: 'Admin Head',
                phoneNumber: '1234567890',
            },
        });
        console.log(`Admin user '${adminEmail}' created!`);
    }
    else {
        console.log(`Admin user '${adminEmail}' already exists.`);
    }
    // --- Dummy User 1 Creation ---
    const dummyUser1Email = 'dummyuser1@example.com';
    const dummyUser1 = await prisma.user.findUnique({
        where: { email: dummyUser1Email },
    });
    if (!dummyUser1) {
        const hashedPassword = await bcrypt.hash('dummy123', 10); // Dummy password
        await prisma.user.create({
            data: {
                name: 'Dummy User One',
                email: dummyUser1Email,
                password: hashedPassword,
                role: UserRole.USER, // Set role to USER
                departmentName: 'Sales', // Example department
                headName: 'Sales Head',
                phoneNumber: '0987654321',
            },
        });
        console.log(`Dummy user '${dummyUser1Email}' created!`);
    }
    else {
        console.log(`Dummy user '${dummyUser1Email}' already exists.`);
    }
    // --- Dummy User 2 Creation ---
    const dummyUser2Email = 'dummyuser2@example.com';
    const dummyUser2 = await prisma.user.findUnique({
        where: { email: dummyUser2Email },
    });
    if (!dummyUser2) {
        const hashedPassword = await bcrypt.hash('dummy123', 10); // Dummy password
        await prisma.user.create({
            data: {
                name: 'Dummy User Two',
                email: dummyUser2Email,
                password: hashedPassword,
                role: UserRole.USER, // Set role to USER
                departmentName: 'Marketing', // Example department
                headName: 'Marketing Head',
                phoneNumber: '1122334455',
            },
        });
        console.log(`Dummy user '${dummyUser2Email}' created!`);
    }
    else {
        console.log(`Dummy user '${dummyUser2Email}' already exists.`);
    }
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
