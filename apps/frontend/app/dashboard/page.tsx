import getDbConnection from "@/lib/db";

export default async function Dashboard() {

  const sql = await getDbConnection();
  const response = await sql`SELECT version()`;
  return (

    <section>Dashboard{response[0].version}</section>
  )
}