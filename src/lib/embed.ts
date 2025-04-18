// lib/embed.ts
export async function generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(
      'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(text),
      }
    );
  
    const result = await response.json();
    if (!Array.isArray(result)) throw new Error('Invalid embedding response');
  
    return result;
  }
  