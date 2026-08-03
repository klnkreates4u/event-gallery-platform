import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
  const email = 'kln.kreates4u@gmail.com';
  const password = 'admin123';

  console.log(`Testing login for ${email}`);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log('User not found in DB!');
    return;
  }

  console.log('User found:', { id: user.id, email: user.email, role: user.role });

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  console.log(`Password match? ${isMatch}`);
}

testLogin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
