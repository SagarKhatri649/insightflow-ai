// // "use server";

// // import OpenAI from  'openai';

// // const openai = new OpenAI({
// //   apiKey: process.env.OPEN_AI_DEMO_KEY,
// // });

// // export async function transcribeUploadedFile(

// //   resp:{
// //     serverData: { userId: string; file: any };
// //   }[]
  
// // ) {
// //   if (!resp) {
// //     return {
// //       success: false,
// //       message: "File upload failed",
// //       data: null,
// //     };
// //   }

// //   const first = resp?.[0];

// //   if (!first || !first.serverData || !first.serverData.file) {
// //     return {
// //       success: false,
// //       message: "Missing file data from upload response",
// //       data: null,
// //    };
// //   }

// //   const {
// //     userId,
// //     // file: { url: fileUrl, name: fileName },
// //     file: { ufsUrl: fileUrl, name: fileName }
// //     } = first.serverData;
// //   // const {
// //   //   serverData :{
// //   //     userId,
// //   //     file: { url: fileUrl, name: fileName },
// //   //   },
// //   // } = resp[0];

// //   if (!fileUrl || !fileName){
// //     return {
// //       success: false,
// //       message: "File upload failed",
// //       data: null,
// //     };

// //   }
// //   // const response = await fetch(fileUrl);
// //   try {

// //     const response = await fetch(fileUrl);

// //     if (!response.ok) {
// //       return {
// //         success: false,
// //         message: "Failed to fetch uploaded file from URL",
// //         data: null,
// //       };
// //     }

// //     const blob = await response.blob();
// //     const file = new File([blob], fileName || "audio.webm", {
// //       type: blob.type,
// //     });


// //     const transcriptions = await openai.audio.transcriptions.create({
// //       model : 'whisper-1',
// //       file: file,
// //     });

// //     console.log("Transcribed Text:", transcriptions.text);
// //     return {
// //       success : true,
// //       message: "File uploaded successfully!",
// //       data: { transcriptions, userId},
// //     };
// //   }
// //   catch (error){

// //     console.error('Error processing file', error);

// //     if(error instanceof OpenAI.APIError && error.status === 413)
// //     {
// //       return {
// //         success: false,
// //         message:
// //         "File size exceeds the max limit of 20MB",

// //         data : null,
// //       };
// //     }
// //     return{
// //       success: false,   
// //       message: error instanceof Error ? error.
// //       message : "Error processing file",
// //       data: null,
// //     };

// //   }
  
// // }
// "use server";

// import { revalidatePath } from "next/cache";
// // import OpenAI from "openai";

// // const openai = new OpenAI({
// //   apiKey: process.env.OPEN_AI_DEMO_KEY,
// // });

// // export async function transcribeUploadedFile({
// //   ufsUrl,
// //   fileName,
// // }: {
// //   ufsUrl: string;
// //   fileName: string;
// // }) {
// //   console.log("🧠 [transcribeUploadedFile] Started");
// //   console.log("📦 Raw response:", { ufsUrl, fileName });

// //   if (!ufsUrl || !fileName) {
// //     console.error("❌ Missing ufsUrl or fileName");
// //     return {
// //       success: false,
// //       message: "Missing file URL or name",
// //       data: null,
// //     };
// //   }

// //   // ✅ MOCK transcription result
// //   const transcriptions = {
// //     text: "This is a mock transcription of the uploaded file.",
// //   };

// //   return {
// //     success: true,
// //     message: "Mock transcription successful!",
// //     data: {
// //       transcriptions,
// //       userId: "mock-user-id", // Optional if you're not using it
// //     },
// //   };
// // }

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

// //  async function saveBlogPost(userId: string,title: string ,content:string){
// //   try{
// //     const sql = await getDbConnection();
// //     const [insertedPost] = await sql`INSERT into posts (user_id, title, content) VALUES(${userId},${title}, ${content}) RETURNING id`;

// //     return insertedPost.id;
// //   } catch(error){
// //     console.error("Error saving blog post" ,error);
// //   }
  

// // }

// //  async function getLatestPosts(userId: string){
// //   try{
// //     const sql = await getDbConnection();
// //     const posts = await sql`SELECT content from posts  where user_id = ${userId} ORDER BY created_at DESC LIMIT 3`;

// //     return posts.map((post) => post.content).join("\n\n");
// //   } catch(error){
// //     console.error("Error getting user blog posts" ,error);
// //   }
  

// // }

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
//           role: "user", content:"who won the world series in 2020?"
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
//   });
//   return completion.choices[0].message.content; 
//   // console.log(completion.choices[0]);
//   // const content = completion.choices[0].message.content;
// }


// // export async function generateBlogPostAction({
// //   transcriptions,
// //   userId,

// // }: {
// //   transcriptions: { text: string };
// //   userId: string;
// // })  {

// //   const userPosts = []; 
// //   if(transcriptions){
// //     const blogPost =await generateBlogPost({

// //       transcriptions: transcriptions.text,
// //       userPosts: "",
// //     });

// //     console.log({ blogPost});
// //     if(!blogPost){
// //       return {
// //         success: false,
// //         message: "Blog post generation failed,please try again...",
         
// //       };
// //     }
// //   }
// // }

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

//   //   const [title,...contentParts] = blogPost?.split("\n\n") || [];

//   //   // database connection
//   //   if(userId){
      
//   //   const postId = await saveBlogPost(userId,title,blogPost);
//   //   }
 
//   // }

//   // // navigate

//   // revalidatePath(`/posts/${postId}`);
//   // redirect{`/posts/${postId}`}

// }


// // "use server";

// // import OpenAI from "openai";

// // const openai = new OpenAI({
// //   apiKey: process.env.OPEN_AI_DEMO_KEY, // ← left exactly as you had it
// // });

// // export async function transcribeUploadedFile(
// //   resp: {
// //     serverData?: { userId: string }; // serverData may or may not exist
// //     fileUrl: string;                 // top‑level field returned by UploadThing
// //     name: string;                    // original filename
// //   }[],
// // ) {
// //   if (!resp || resp.length === 0) {
// //     return {
// //       success: false,
// //       message: "File upload failed",
// //       data: null,
// //     };
// //   }

// //   /* ── pull values from top level, not nested file.ufsUrl ───────────── */
// //   const { serverData, fileUrl, name: fileName } = resp[0];
// //   const userId = serverData?.userId ?? "unknown";

// //   if (!fileUrl || !fileName) {
// //     return {
// //       success: false,
// //       message: "File upload failed",
// //       data: null,
// //     };
// //   }

// //   const response = await fetch(fileUrl);

// //   try {
// //     const transcriptions = await openai.audio.transcriptions.create({
// //       model: "whisper-1",
// //       file: response, // left unchanged
// //     });

// //     console.log({ transcriptions });
// //     return {
// //       success: true,
// //       message: "File uploaded successfully!",
// //       data: { transcriptions, userId },
// //     };
// //   } catch (error) {
// //     return {
// //       success: false,
// //       message:
// //         error instanceof Error ? error.message : "Error processing file",
// //       data: null,
// //     };
// //   }
// // }
 
// at top of file
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";

// ...

export async function transcribeUploadedFile({
  ufsUrl,
  fileName,
}: {
  ufsUrl: string;
  fileName: string;
}) {
  // 1) Download the file to a temp path
  const res = await fetch(ufsUrl);
  if (!res.ok) throw new Error("Failed to fetch file");
  const buffer = Buffer.from(await res.arrayBuffer());
  const tempPath = path.join("/tmp", fileName);
  await fs.writeFile(tempPath, buffer);

  // 2) Spawn the local Whisper script
  const whisperProc = spawn("python3", [
    "scripts/transcribe.py",
    tempPath,
  ]);

  // 3) Collect stdout into a string
  let transcript = "";
  for await (const chunk of whisperProc.stdout) {
    transcript += chunk.toString();
  }

  // 4) Wait for it to finish
  const code = await new Promise<number>((resolve) => {
    whisperProc.on("close", resolve);
  });
  if (code !== 0) {
    throw new Error(`Whisper exited with code ${code}`);
  }

  console.log("📝 Local transcription:", transcript);

  return {
    success: true,
    message: "Transcription (local) completed",
    data: {
      transcriptions: { text: transcript },
      // If you have real user metadata from UploadThing, propagate it here:
      // userId: metadata.userId
      userId: "local-test-user",
    },
  };
}
/////////////////////////////////////////////////////////////////////////////////