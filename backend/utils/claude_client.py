from groq import Groq
client = Groq(api_key="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")

def call_ai(prompt: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role":"user","content":prompt}],
        max_tokens=1024
    )
    return response.choices[0].message.content
    