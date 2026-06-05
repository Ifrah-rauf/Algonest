import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);


export const analyzeMeetingAudio = async(audioBuffer, mimeType)=>{


    const model = genAI.getGenerativeModel({
        model:"gemini-2.5-flash"
    });


    const audioBase64 = audioBuffer.toString("base64");



    const prompt = `

You are AlgoNest's AI mentor evaluator.

This is a mentor-student coding session.

Conversation can contain:
- English
- Hindi
- Hinglish
- programming terms

Analyze the meeting.

Return ONLY JSON. Do not wrap it in markdown fences or add any extra prose:

{
 "transcript":[
    {
      "speaker":"mentor/student",
      "text":""
    }
 ],

 "summary":"",

 "student_analysis":{
    "understanding_score":0,
    "confidence_score":0,
    "weak_topics":[],
    "mistakes":[],
    "improvements":[]
 },

 "mentor_analysis":{
    "clarity_score":0,
    "feedback_quality":0,
    "remarks":[]
 },

 "next_tasks":[],

 "session_result":
 "excellent/average/needs_improvement"
}

`;



    const result =
    await model.generateContent([

        prompt,

        {
            inlineData:{
                data:audioBase64,
                mimeType:mimeType
            }
        }

    ]);



    return result.response.text();

};
