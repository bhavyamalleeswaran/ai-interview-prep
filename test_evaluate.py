import sys
sys.path.append('backend')
from backend.utils.claude_client import call_ai
import json

prompt = """You are an expert interviewer for a Software Engineer position.

Question: Tell me about a time you solved a difficult bug.
Candidate's answer: I once fixed a memory leak by using a profiler tool. I identified the issue and resolved it quickly.

Evaluate the answer and return ONLY this JSON:
{
  "score": <number 1-10>,
  "strengths": ["point 1", "point 2"],
  "weaknesses": ["point 1", "point 2"],
  "ideal_hint": "what a great answer would include",
  "summary": "overall feedback in 2 sentences"
}

No extra text, just the JSON."""

result = call_ai(prompt)
print(result)