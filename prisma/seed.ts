import { PrismaClient } from '@prisma/client';
import { UserRole } from '../src/types/enums';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Organization ────────────────────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: 'my-studio' },
    update: {},
    create: {
      name: 'My Studio',
      slug: 'my-studio',
      primaryColor: '#111111',
      accentColor: '#7B1E2B',
    },
  });

  console.log(`✅ Organization: ${org.name} (${org.id})`);

  // ─── Super Admin User ─────────────────────────────────────────────────────────
  const password = 'admin123'; // ← Change this after first login
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'kln.kreates4u@gmail.com' },
    update: {},
    create: {
      email: 'kln.kreates4u@gmail.com',
      passwordHash,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      organizationId: org.id,
    },
  });

  console.log(`✅ Admin user: ${admin.email}`);
  console.log('');
  console.log('─────────────────────────────────────────');
  console.log('  🔐 Login Credentials');
  console.log('  Email:    kln.kreates4u@gmail.com');
  console.log('  Password: admin123');
  console.log('  URL:      http://localhost:3000/admin');
  console.log('─────────────────────────────────────────');
  console.log('  ⚠️  Change your password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
