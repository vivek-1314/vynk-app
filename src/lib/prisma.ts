import { PrismaClient } from '../generated/prisma/client';  // Correct import for both JS and TS

const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();  
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();  
  }
})();

export default prisma;
