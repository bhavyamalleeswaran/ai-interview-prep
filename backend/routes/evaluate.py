from fastapi import APIRouter
from pydantic import BaseModel
from utils.claude_client import call_ai
import json

router = APIRouter()

class EvalRequest(BaseModel):
    question: str
    answer: str
    role: str

@router.post("/evaluate-answer")
def evaluate(req: EvalRequest):
    prompt = f"""You are an expert interviewer for a {req.role} position.

Question: {req.question}
Candidate's answer: {req.answer}

Evaluate the answer and return ONLY this JSON:
{{
  "score": <number 1-10>,
  "strengths": ["point 1", "point 2"],
  "weaknesses": ["point 1", "point 2"],
  "ideal_hint": "what a great answer would include",
  "summary": "overall feedback in 2 sentences"
}}

No extra text, just the JSON."""

    response = call_ai(prompt)

    try:
        clean = response.strip()
        if "```" in clean:
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        feedback = json.loads(clean)
    except:
        feedback = {"score": 0, "summary": response, "strengths": [], "weaknesses": [], "ideal_hint": ""}

    return {"feedback": feedback}