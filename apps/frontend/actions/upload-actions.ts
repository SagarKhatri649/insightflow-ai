 
// "use server";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_DEMO_KEY, // Make sure this key is set!
// });

// export async function transcribeUploadedFile({
//   ufsUrl,
//   fileName,
// }: {
//   ufsUrl: string;
//   fileName: string;
// }) {
//   console.log("🧠 [transcribeUploadedFile] Started");
//   console.log("📂 ufsUrl:", ufsUrl);
//   console.log("📂 fileName:", fileName);

//   if (!ufsUrl || !fileName) {
//     console.error("❌ Missing file data.");
//     return {
//       success: false,
//       message: "Missing file URL or name",
//       data: null,
//     };
//   }

//   try {
//     const response = await fetch(ufsUrl);
//     if (!response.ok) {
//       return {
//         success: false,
//         message: "Failed to fetch file from URL",
//         data: null,
//       };
//     }

//     const blob = await response.blob();
//     const file = new File([blob], fileName, { type: blob.type });

//     const transcription = await openai.audio.transcriptions.create({
//       model: "whisper-1",
//       file: file,
//     });

//     console.log("📜 Transcription result:", transcription);

//     return {
//       success: true,
//       message: "Transcription completed!",
//       data: {
//         transcriptions: transcription,
//         userId: "mock-user-id", // or pass real userId if needed
//       },
//     };
//   } catch (error: any) {
//     console.error("❌ Error during transcription:", error);

//     if (error instanceof OpenAI.APIError && error.status === 429) {
//       return {
//         success: false,
//         message: "Rate limit exceeded. Check your usage & billing.",
//         data: null,
//       };
//     }

//     return {
//       success: false,
//       message: error.message ?? "Unknown error during transcription",
//       data: null,
//     };
//   }
// }

//  async function saveBlogPost(userId: string,title: string ,content:string){ 
//   try{
//     const sql = await getDbConnection();
//     const [insertedPost] = await sql`INSERT into posts (user_id, title, content) VALUES(${userId},${title}, ${content}) RETURNING id`;

//     return insertedPost.id;
//   } catch(error){
//     console.error("Error saving blog post" ,error);
//   }
  

// }

//  async function getLatestPosts(userId: string){
//   try{
//     const sql = await getDbConnection();
//     const posts = await sql`SELECT content from posts  where user_id = ${userId} ORDER BY created_at DESC LIMIT 3`;

//     return posts.map((post) => post.content).join("\n\n");
//   } catch(error){
//     console.error("Error getting user blog posts" ,error);
//   }
  

// }

// async function generateBlogPost ({
//   transcriptions,
//   userPosts,
// }:{
//   transcriptions: string
//   userPosts: string,        
// }) {

//   const completion = await openai.chat.completions.create({
//      messages: [
//         {
//             role: "system",
//             content:
//              "You are a skilled content writer that converts audio transcriptions into well-structured, engaging blog posts in Markdown format.Create a comprehensive blog post with a catchy titile,introduction ,main body with multiple sections,and a conclusion. Analyze the user's writing style from their previous posts and new emulate their tone and style in the new post. Keep the tone casual and professional.",
//         },
       
//         {
//           role: "user",
//           content: `Here are some of my  previous blog posts for reference:
          
//           ${userPosts}
// Please convert the following transcription into a well-structured blog post using Markdown formatting.Follow this structure:

// 1.Start with a SEO friendly catchy titile on the first line.
// 2. Add two newlines after the title.
// 3. write an engaging introduction paragraph.
// 4. Create multiple sections for the main content,using appropriate headings(##, ###).
// 5. Include relevant subheadings within sections if needed.
// 6. Use bullet points or numbered lists where appropriate.
// 7. Add a conclusion paragraph at the end.
// 8. Ensure the content is informative, well-organized, and easy to read.
// 9. Emulate my writing style, tone, and any recurring patterns you notice from my previous posts.

// Here's the transcription to convert: $
// {transcriptions}`,
//         },
//     ],
//     model: "gpt-4o-mini",
//     temperature: 0.7,
//     max_tokens: 1000,
//   });
//   return completion.choices[0].message.content; 
//   // console.log(completion.choices[0]);
//   // const content = completion.choices[0].message.content;
// }


// export async function generateBlogPostAction({
//   transcriptions,
//   userId,

// }: {
//   transcriptions: { text: string };
//   userId: string;
// })  {

//   const userPosts = []; 
//   if(transcriptions){
//     const blogPost =await generateBlogPost({

//       transcriptions: transcriptions.text,
//       userPosts: "",
//     });

//     console.log({ blogPost});
//     if(!blogPost){
//       return {
//         success: false,
//         message: "Blog post generation failed,please try again...",
         
//       };
//     }
//   }
// }

// export async function generateBlogPostAction({
//   transcriptions,
//   userId,
// }: {
//   transcriptions: { text: string };
//   userId: string;
// }) {
//   if (!transcriptions?.text) {
//     return {
//       success: false,
//       message: "No transcription available",
//     };
//   }

//   // const userPosts = (await getLatestPosts(userId)) ?? ""; // In production, fetch posts from DB for style matching

//   let postId = null; 
//   try {
//     const blogPost = await generateBlogPost({
//       transcriptions: transcriptions.text,
//       userPosts,
//     });

//     return {
//       success: true,
//       message: "Blog post generated successfully",
//       data: blogPost,
//     };
//   } catch (error) {
//     console.error("🔥 Error generating blog post:", error);
//     return {
//       success: false,
//       message: "Blog generation failed",
//     };

//     const [title,...contentParts] = blogPost?.split("\n\n") || [];

//     // database connection
//     if(userId){
      
//     const postId = await saveBlogPost(userId,title,blogPost);
//     }
 
//   }

//   // navigate

//   revalidatePath(`/posts/${postId}`);
//   redirect{`/posts/${postId}`}

// }


 
///////////////////////////////////////////////////////////////////////////////////////////////

// This file lives entirely on the server (it’s used by server actions or API routes),
// so it’s safe to import Node.js modules like child_process and fs.
// We define two exports:
//  1. transcribeUploadedFile: runs Whisper locally to get raw transcript
//  2. generateBlogPostAction: calls OpenAI to turn that transcript into a Markdown blog post

// "use server";

// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import OpenAI from "openai";
// import { spawn } from "child_process";
// import fs from "fs/promises";
// import path from "path";
// import os from "os";
// import { fileURLToPath } from "url";

// // ─── Utilities to find __dirname in ESM ───────────────────────────────────────
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ─── Whisper Setup ────────────────────────────────────────────────────────────
// // Make sure you’ve activated your .venv so that python points to the Whisper install
// function getPythonBinary() {
//   const root = process.cwd(); // apps/frontend
//   return process.platform === "win32"
//     ? path.join(root, ".venv", "Scripts", "python.exe")
//     : path.join(root, ".venv", "bin", "python");
// }

// /**
//  * Downloads the uploaded file, runs your local `transcribe.py` via spawn,
//  * and returns the raw transcript text.
//  */
// export async function transcribeUploadedFile({
//   ufsUrl,
//   fileName,
// }: {
//   ufsUrl: string;
//   fileName: string;
// }) {
//   // 1) Fetch the binary from UploadThing
//   const resp = await fetch(ufsUrl);
//   if (!resp.ok) {
//     return { success: false, message: "Failed to fetch file", data: null };
//   }
//   const buffer = Buffer.from(await resp.arrayBuffer());

//   // 2) Write to OS temp dir
//   const tempPath = path.join(os.tmpdir(), fileName);
//   await fs.writeFile(tempPath, buffer);

//   // 3) Locate your Python Whisper wrapper
//   const scriptPath = path.join(__dirname, "../../scripts/transcribe.py");

//   // 4) Spawn the local Whisper script
//   const pythonBin = getPythonBinary();
//   console.log("🔧 Spawning whisper:", pythonBin, scriptPath, tempPath);
//   const proc = spawn(pythonBin, [scriptPath, tempPath], {
//     cwd: path.resolve(process.cwd()),
//   });

//   // 5) Capture stdout/stderr
//   let transcript = "", stderr = "";
//   proc.stdout.on("data", (c) => (transcript += c.toString()));
//   proc.stderr.on("data", (c) => (stderr += c.toString()));

//   // 6) Await exit
//   const code = await new Promise<number>((r) => proc.on("close", r));
//   if (code !== 0) {
//     console.error("❌ Whisper failed:", stderr);
//     return {
//       success: false,
//       message: stderr || `Whisper exited with code ${code}`,
//       data: null,
//     };
//   }

//   // 7) Return the transcript
//   return {
//     success: true,
//     message: "Transcription complete",
//     data: { transcriptions: { text: transcript }, userId: "local-test-user" },
//   };
// }

// // ─── OpenAI Setup ─────────────────────────────────────────────────────────────
// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_DEMO_KEY!, // ensure this is set in your .env
// });

// /**
//  * Internal helper to call OpenAI chat-completions and format a blog post.
//  */
// async function generateBlogPost({
//   transcriptionText,
//   userPosts,
// }: {
//   transcriptionText: string;
//   userPosts: string;
// }): Promise<string> {
//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a skilled content writer that converts audio transcriptions into well-structured, engaging blog posts in Markdown format. Emulate the user's style.",
//       },
//       {
//         role: "user",
//         content: `Reference posts:\n${userPosts}\n\nTranscript:\n${transcriptionText}`,
//       },
//     ],
//   });
//   return completion.choices[0].message.content;
// }

// /**
//  * Takes the raw transcript and optional user posts, generates a Markdown blog post,
//  * optionally saves it to your database, revalidates the `/posts` path, then redirects.
//  */
// export async function generateBlogPostAction({
//   transcriptions,
//   userId,
// }: {
//   transcriptions: { text: string };
//   userId: string;
// }) {
//   if (!transcriptions?.text) {
//     return { success: false, message: "No transcription provided" };
//   }

//   // (Optional) load past posts for style matching:
//   // const userPosts = await getLatestPosts(userId) ?? "";

//   // 1) Generate the post
//   let markdown: string;
//   try {
//     markdown = await generateBlogPost({
//       transcriptionText: transcriptions.text,
//       userPosts: "",
//     });
//   } catch (err) {
//     console.error("❌ Blog generation error:", err);
//     return { success: false, message: "Blog generation failed" };
//   }

//   // 2) (Optional) save to DB, then revalidate & redirect:
//   // const postId = await saveBlogPost(userId, title, markdown);
//   // revalidatePath("/posts");
//   // redirect(`/posts/${postId}`);

//   return { success: true, message: "Blog generated", data: markdown };
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////
import { currentUser } from "@clerk/nextjs/server"; // only if needed in server actions
  // your initialized openai instance
import getDbConnection from "@/lib/db"; // if needed later
// import { revalidatePath } from "next/cache"; // optional

import openai from "@/lib/openai";

export async function transcribeUploadedFile({
  ufsUrl,
  fileName,
  userId,
}: {
  ufsUrl: string;
  fileName: string;
  userId: string;
}) {
  console.log("🧠 [transcribeUploadedFile] Started");

  if (!ufsUrl || !fileName || !userId) {
    return {
      success: false,
      message: "Missing file URL, name, or user ID",
      data: {
        transcriptions: null,
        userId,
      },
    };
  }

  try {
    const response = await fetch(ufsUrl);
    if (!response.ok) {
      return {
        success: false,
        message: "Failed to fetch file from URL",
        data: {
          transcriptions: null,
          userId,
        },
      };
    }

    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file,
    });

    const { text } = transcription;

   return {
  success: true,
  message: "Transcription completed!",
  data: {
    transcriptions: {
      text: transcription.text,
    },
    userId,
  },
};
  } catch (error: any) {
    console.error("❌ Transcription error:", error);
    return {
      success: false,
      message: error?.message || "Unknown transcription error",
      data: {
        transcriptions: null,
        userId,
      },
    };
  }
}




async function saveBlogPost(userId: string, title: string, content: string) {
  try {
    const sql = await getDbConnection();
    const [insertedPost] = await sql`
      INSERT INTO posts (user_id, title, content)
      VALUES (${userId}, ${title}, ${content})
      RETURNING id;
    `;
    return insertedPost.id;
  } catch (error) {
    console.error("Error saving blog post:", error);
    return null;
  }
}

async function getLatestPosts(userId: string) {
  try {
    const sql = await getDbConnection();
    const posts = await sql`
      SELECT content FROM posts
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 3;
    `;
    return posts.map((post) => post.content).join("\n\n");
  } catch (error) {
    console.error("Error getting user blog posts:", error);
    return "";
  }
}

async function generateBlogPost({
  transcriptions,
  userPosts,
}: {
  transcriptions: string;
  userPosts: string;
}) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 1000,
    messages: [
      {
        role: "system",
        content:
          "You are a skilled content writer that converts audio transcriptions into well-structured, engaging blog posts in Markdown format. Create a comprehensive blog post with a catchy title, introduction, main body with multiple sections, and a conclusion. Analyze the user's writing style from their previous posts and emulate their tone and style in the new post. Keep the tone casual and professional.",
      },
      {
        role: "user",
        content: `Here are some of my previous blog posts for reference:\n\n${userPosts}

Please convert the following transcription into a well-structured blog post using Markdown formatting. Follow this structure:

1. Start with a SEO friendly catchy title on the first line.
2. Add two newlines after the title.
3. Write an engaging introduction paragraph.
4. Create multiple sections for the main content, using appropriate headings (##, ###).
5. Include relevant subheadings within sections if needed.
6. Use bullet points or numbered lists where appropriate.
7. Add a conclusion paragraph at the end.
8. Ensure the content is informative, well-organized, and easy to read.
9. Emulate my writing style, tone, and any recurring patterns you notice from my previous posts.

Here's the transcription to convert:\n\n${transcriptions}`,
      },
    ],
  });

  return completion.choices[0].message.content;
}
 

export async function generateBlogPostAction({
  transcriptions,
  userId,
}: {
  transcriptions: {
    text: string;
    usage: {
      type: string;
      seconds: number;
    };
  };
  userId: string;
}) {
  try {
    const sql = await getDbConnection();

    // 🧠 Derive title from first line or fallback
    const lines = transcriptions.text.split("\n").filter(Boolean);
    const title = lines.length > 0 ? lines[0].slice(0, 100) : "Untitled Post";

    // 📦 Insert into DB and get post ID
    const result = await sql`
      INSERT INTO posts (title, content, user_id)
      VALUES (${title}, ${transcriptions.text}, ${userId})
      RETURNING id
    `;

    const postId = result?.[0]?.id;
    console.log("✅ Post inserted with ID:", postId);
     console.log("User ID attached to post:", userId);
    if (!postId) {
      return {
        success: false,
        message: "Failed to create post in database.",
      };
    }

    // 🔁 Revalidate post listing (optional)
    // revalidatePath("/posts");

    return {
      success: true,
      postId,
    };
  } catch (error: any) {
    console.error("❌ Error in generateBlogPostAction:", error);

    return {
      success: false,
      message: error.message || "Unknown error while generating blog post",
    };
  }
}
