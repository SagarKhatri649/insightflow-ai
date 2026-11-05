
import { neon } from '@neondatabase/serverless';

export async function getDbConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Neon Database URL is not defined");
  }
  return neon(process.env.DATABASE_URL);
}

export default getDbConnection;
