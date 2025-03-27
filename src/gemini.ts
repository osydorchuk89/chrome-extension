import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const getKeywords = async (text: string) => {
    const prompt = `Extract important keywords from the following text: "${text}". The keyword should only consist of one word. For each keyword, explain why you have chosen it as important keyword. Format the response as an array of objects, where the keyword is the key and the explanation is the value.`;

    try {
        const result = await model.generateContent(prompt);

        if (!result) {
            return { keywords: null, errorMessage: "" };
        }

        const keywordsText = result.response.text();
        const keywordsTextClean = keywordsText
            .replace(/```json|```/g, "")
            .trim();
        const keywordsArray = JSON.parse(keywordsTextClean);
        const keywords = Object.entries(keywordsArray[0]).map(
            ([key, value]) => ({
                word: key,
                explanation: value,
            })
        );

        return { keywords: keywords, errorMessage: "" };
    } catch (error) {
        console.error(error);
        return {
            keywords: null,
            errorMessage: "Something went wrong. Please try again later.",
        };
    }
};

// export const getKeywordExplanations = async (
//     text: string,
//     keywords: string[]
// ) => {
//     const joinedKeywords = keywords.join(", ");
//     const prompt = `Based on the following text: "${text}", you have selected the following keywords: "${joinedKeywords}". For each of them, please explain why you have chosen them as important keywords.`;

//     // const prompt = `Based on the following text: "${text}", explain why these words were identified as important keywords: "${joinedKeywords}". Return the explanation for each of the keywords.`;
//     try {
//         const result = await model.generateContent(prompt);

//         if (!result) {
//             return { keywordExplanations: [], errorMessage: "" };
//         }

//         const responseText = result.response.text().split("\n").slice(1);

//         const explanations: any[] = [];
//         responseText.forEach((line) => {
//             if (line) {
//                 const cleanLine = line.replace(/\*/g, "");
//                 const [word, explanation] = cleanLine.split(":");
//                 explanations.push({
//                     word: word.trim(),
//                     explanation: explanation.trim(),
//                 });
//             }
//         });

//         return { keywordExplanations: explanations, errorMessage: "" };
//     } catch (error) {
//         console.error(error);
//         return {
//             keywordExplanations: [],
//             errorMessage: "Something went wrong. Please try again later.",
//         };
//     }
// };
