import getDbConnection from "@/lib/db";
import { redirect } from "next/dist/server/api-utils";

export default async function PostPage({
  params: { id },
}: {

  params: { id: string };
}) {


  const user = await currentUser();

  if (!user) {

    return redirect("/sign-in");
  }

  const sql = await getDbConnection();

  const posts = await sql`SELECT  * FROM POSTS where user_id = ${user.id} and id = ${id}`;

  return <div>{JSON.stringify{posts}}</div>;
}