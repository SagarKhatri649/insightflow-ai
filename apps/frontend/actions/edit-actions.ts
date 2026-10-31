
'use server';

import getDbConnection from "@/lib/db";
import { revalidatePath } from "next/cache";
import {redirect} from "next/navigation";
export async function updatePostActions(data : {
  postId: string;
  content: string;
}) {
  const {postId,content} = data;

  console.log({content});
  const user = await currentUser();
  if(!user) {

    redirect("/sign-in");
  }

  try{
    
    const sql  = await getDbConnection();

    const [title,...contentParts] = content?.split("\n\n") || [];

    console.log({title});
    const updatedTitle = title.split("#")[1].trim();
    console.log(updatedTitle);

    await sql`UPDATE posts SET content = ${content } , title = ${updatedTitle} where id = ${postId}`;
  }catch(error){

    console.error("Error occurred in updating the post",postId);

    return{
      success: false,
    };
  }

  revalidatePath(`/posts/${postId}`);

  return  {
    success:true,
  };
  
  
  
}