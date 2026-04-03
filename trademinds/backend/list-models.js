import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    console.log("Available models:", data.models?.map(m => m.name).join(', ') || data.error?.message);
  } catch (err) {
    console.log("Error listing models:", err.message);
  }
}
run();
