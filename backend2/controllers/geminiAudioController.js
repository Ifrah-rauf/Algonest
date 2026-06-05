import { analyzeMeetingAudio } from "../services/geminiAudioService.js";
import path from "path";

const normalizeAudioMimeType = (file) => {
    if (!file) {
        return "audio/mp4";
    }

    if (file.mimetype && file.mimetype !== "application/octet-stream") {
        return file.mimetype;
    }

    const ext = path.extname(file.originalname || "").toLowerCase();
    if (ext === ".m4a" || ext === ".mp4") {
        return "audio/mp4";
    }
    if (ext === ".mp3") {
        return "audio/mpeg";
    }
    if (ext === ".wav") {
        return "audio/wav";
    }

    return "audio/mp4";
};



export const analyzeMeetingController = async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"Audio file required"
            });
        }

        const analysis =
        await analyzeMeetingAudio(
            req.file.buffer,
            normalizeAudioMimeType(req.file)
        );

        const cleanedText = analysis.replace(/```json|```/g,"").trim();
        let parsedAnalysis;
        try{
            parsedAnalysis = JSON.parse(cleanedText);
        }catch(parseError){
            return res.status(200).json({
                success:true,
                raw_output: analysis,
                parse_error: parseError.message
            });
        }

        return res.status(200).json({
            success:true,
            analysis: parsedAnalysis,
            raw_output: analysis
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            error:error.message
        });
    }
};
