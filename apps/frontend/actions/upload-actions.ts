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
      file:{ url: fileUrl, name: fileName},
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
    }
  }
  catch (error){
    return{
      success: false,   
      message: error instanceof Error ? error.
      message : "Error processing file",
      data: null,
    }

  }
  
}