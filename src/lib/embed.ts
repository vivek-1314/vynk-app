// lib/embed.ts
export async function generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(
      'https://api.jina.ai/v1/embeddings',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            input: [text],
            model: "jina-embeddings-v2-small-en"
          }),
      }
    );
  
    const result = await response.json();
    if (!Array.isArray(result.data[0]?.embedding)) throw new Error('Invalid embedding response');
  
    return result.data[0]?.embedding ;
  }
