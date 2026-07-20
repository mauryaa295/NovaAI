import "dotenv/config";

const getGrokAIAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      options,
    ); // api response
    const data = await response.json();
    return data?.choices[0]?.message?.content; //reply
  } catch (error) {
    console.log(error);
  }
};

export default getGrokAIAPIResponse;
