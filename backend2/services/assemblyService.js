import axios from "axios";

const ASSEMBLY_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const assemblyClient = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: ASSEMBLY_API_KEY
    }
});

// Upload audio to AssemblyAI
const uploadAudio = async (audioBuffer) => {
    try {
        const response = await assemblyClient.post(
            "/upload",
            audioBuffer,
            {
                headers:{
                    "Content-Type":"application/octet-stream"
                }
            }
        );
        return response.data.upload_url;
    } catch(error){
        console.log(
            "Assembly upload error:",
            error.response?.data || error.message
        );
        throw error;
    }

};
// Start transcription
const startTranscription = async (audioUrl) => {
    try {
        const response = await assemblyClient.post(
            "/transcript",
            {
                audio_url: audioUrl,
               // Mentor/student separation
                speaker_labels:true,
                // Summary generation
                summarization:true,
                summary_model:"informative",
                summary_type:"bullets",
                // Useful for AlgoNest analytics
                sentiment_analysis:true,
                // Creates topic sections
                auto_chapters:true
            }
        );
        return response.data.id;
    } catch(error){
        console.log(
            "Transcription error:",
            error.response?.data || error.message
        );
        throw error;
    }
};
// Wait until AssemblyAI finishes processing
const getTranscriptResult = async(transcriptId)=>{
    while(true){
        const response =
            await assemblyClient.get(
                `/transcript/${transcriptId}`
            );
        const transcript = response.data;
        if(transcript.status === "completed"){
            return transcript;
        }
        if(transcript.status === "error"){
            throw new Error(
                transcript.error
            );

        }
        await new Promise(
            resolve => setTimeout(resolve,5000)
        );
    }
};
// Main function called by controller
export const analyzeMeeting = async(audioBuffer)=>{
    const audioUrl =
        await uploadAudio(audioBuffer);
    const transcriptId =
        await startTranscription(audioUrl);
    const result =
        await getTranscriptResult(transcriptId);
    return {
        fullTranscript:
            result.text,
        conversation:
            result.utterances,
        summary:
            result.summary,
        chapters:
            result.chapters,
        sentiment:
            result.sentiment_analysis_results
    };
};