// import { neon } from '@neondatabase/serverless';

// export default async function getDbConnection() {
//   if(!process.env.DATABASE_URL){
//     throw new Error("Neon Database URL is not defined");
//   }
//   return neon(process.env.DATABASE_URL);
// }

// export default async function Page() {
//   const data = await getData();
//   return <>{data}</>;
// }

import { neon } from '@neondatabase/serverless';

export async function getDbConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Neon Database URL is not defined");
  }
  return neon(process.env.DATABASE_URL);
}

export default getDbConnection;
