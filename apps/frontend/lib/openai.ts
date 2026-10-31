// import OpenAI from "openai";

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("❌ OPENAI_API_KEY is missing in environment variables.");
// }

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export default openai;


import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("❌ OPENAI_API_KEY is missing in environment variables.");
}
console.log("✅ OPENAI_API_KEY loaded:", process.env.OPENAI_API_KEY.slice(0,8) + "…");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;