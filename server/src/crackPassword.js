const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const passwords = ['password', 'admin123', 'admin', '123456', 'command', 'commander', 'password123'];

  for (const user of users) {
    for (const pwd of passwords) {
      const match = await bcrypt.compare(pwd, user.password);
      if (match) {
        console.log(`Found! Email: ${user.email}, Password: ${pwd}`);
      }
    }
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
