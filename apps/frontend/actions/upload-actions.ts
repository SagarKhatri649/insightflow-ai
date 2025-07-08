"use server";

import OpenAI from  'openai';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_DEMO_KEY
});

export async function transcribeUploadedFile(

  resp:{
    serverData: { userId: string; file: any };
  }[]
  
) {
  if (!resp) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  const {
    serverData :{
      userId,
      file: { url: fileUrl, name: fileName },
    },
  } = resp[0];

  if (!fileUrl || !fileName){
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };

  }
  const response = await fetch(fileUrl);
  try {
    const transcriptions = await openai.audio.transcriptions.create({
      model : 'whisper-1',
      file: response,
    });

    console.log({ transcriptions});
    return {
      success : true,
      message: "File uploaded successfully!",
      data: { transcriptions, userId},
    };
  }
  catch (error){

    console.error('Error processing file', error);

    if(error instanceof OpenAI.APIError && error.status === 413)
    {
      return {
        succes: false,
        message:
        "File size exceeds the max limit of 20MB",

        data : null,
      };
    }
    return{
      success: false,   
      message: error instanceof Error ? error.
      message : "Error processing file",
      data: null,
    };

  }
  
}

async function generateBlogPost ({
  transcriptions,
  userPosts,
}:{
  transcriptions: string
  userPosts: string,        
}) {

  const completion = await openai.chat.completions.create({
     messages: [
        {
            role: "system",
            content:
             "You are a skilled content writer that converts audio transcriptions into well-structured, engaging blog posts in Markdown format.Create a comprehensive blog post with a catchy titile,introduction ,main body with multiple sections,and a conclusion. Analyze the user's writing style from their previous posts and new emulate their tone and style in the new post. Keep the tone casual and professional.",
        },
        {
          role: "user", content:"who won the world series in 2020?"
        },
        {
          role: "user",
          content: `Here are some of my  previous blog posts for reference:
          
          ${userPosts}
Please convert the following transcription into a well-structured blog post using Markdown formatting.Follow this structure:

1.Start with a SEO friendly catchy titile on the first line.
2. Add two newlines after the title.
3. write an engaging introduction paragraph.
4. Create multiple sections for the main content,using appropriate headings(##, ###).
5. Include relevant subheadings within sections if needed.
6. Use bullet points or numbered lists where appropriate.
7. Add a conclusion paragraph at the end.
8. Ensure the content is informative, well-organized, and easy to read.
9. Emulate my writing style, tone, and any recurring patterns you notice from my previous posts.

Here's the transcription to convert: $
{transcriptions}`,
        },
    ],
    model: "gpt-4o-mini",

  });
}

export async function generateBlogPostAction({
  transcriptions,
  userId,

}: {
  transcriptions: {text: string};
  userId: string;
}){

  const userPosts = [];
  if(transcriptions){
    const blogPost =await generateBlogPost({

      transcriptions: transcriptions.text,
      userPosts,
    });

    console.log({ blogPost});
    if(!blogPost){
      return {
        success: false,
        message: "Blog post generation failed,please try again...",
      };
    }
  }
}



// "use server";

// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_DEMO_KEY, // ← left exactly as you had it
// });

// export async function transcribeUploadedFile(
//   resp: {
//     serverData?: { userId: string }; // serverData may or may not exist
//     fileUrl: string;                 // top‑level field returned by UploadThing
//     name: string;                    // original filename
//   }[],
// ) {
//   if (!resp || resp.length === 0) {
//     return {
//       success: false,
//       message: "File upload failed",
//       data: null,
//     };
//   }

//   /* ── pull values from top level, not nested file.url ───────────── */
//   const { serverData, fileUrl, name: fileName } = resp[0];
//   const userId = serverData?.userId ?? "unknown";

//   if (!fileUrl || !fileName) {
//     return {
//       success: false,
//       message: "File upload failed",
//       data: null,
//     };
//   }

//   const response = await fetch(fileUrl);

//   try {
//     const transcriptions = await openai.audio.transcriptions.create({
//       model: "whisper-1",
//       file: response, // left unchanged
//     });

//     console.log({ transcriptions });
//     return {
//       success: true,
//       message: "File uploaded successfully!",
//       data: { transcriptions, userId },
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message:
//         error instanceof Error ? error.message : "Error processing file",
//       data: null,
//     };
//   }
// }
 
