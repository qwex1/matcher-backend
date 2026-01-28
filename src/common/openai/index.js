import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export const createEmbedding = async (text) => {
    const embedding = await openai.embeddings.create({
        model: "text-embedding-3-large",
        input: text,
        encoding_format: "float",
    });
    return embedding.data[0].embedding;
};

export const checkIfIntro = async (text) => {
    const prompt = `You are given a user's message. Determine whether the message can be classified as a self-introduction — that is, a personal statement where the user talks about themselves, such as their name, background, interests, hobbies, goals, or experiences. Respond with a JSON object containing a boolean "isIntro" and a string "reason". Here is the message: "${text}"`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', 
            messages: [
                { role: 'system', content: 'You are given a user\'s message. Determine whether the message can be classified as a self-introduction — that is, a personal statement where the user talks about themselves, such as their name, background, interests, hobbies, goals, or experiences.' },
                { role: 'user', content: prompt }
            ],
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'intro_check',
                    schema: {
                        type: 'object',
                        properties: {
                            isIntro: { type: 'boolean' },
                            reason: { type: 'string' }
                        },
                        required: ['isIntro', 'reason']
                    }
                }
            }
        });

        const result = response.choices[0].message.content;
        return JSON.parse(result);
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        return null;
    }
};
