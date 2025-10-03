import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function rehashPasswords() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    if (!user.password.startsWith('$2b$')) {
      const hashed = await bcrypt.hash(user.password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
      });
      console.log(`Rehashed: ${user.email}`);
    } else {
      console.log(`Already hashed: ${user.email}`);
    }
  }

  console.log('✅ All passwords checked/hashed.');
  process.exit();
}

rehashPasswords().catch((err) => {
  console.error(err);
  process.exit(1);
});
