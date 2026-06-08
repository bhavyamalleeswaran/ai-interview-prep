from fastapi import APIRouter
from pydantic import BaseModel
from utils.claude_client import call_ai
import json

router = APIRouter()

class QuestionRequest(BaseModel):
    role: str
    level: str
    q_type: str
    count: int = 5

@router.post("/generate-questions")
def generate_questions(req: QuestionRequest):
    prompt = f"""Generate {req.count} {req.q_type} interview questions
for a {req.level} {req.role}.

Return ONLY a JSON array like this:
[
  {{"id": 1, "question": "...", "type": "{req.q_type}", "difficulty": "medium"}},
  {{"id": 2, "question": "...", "type": "{req.q_type}", "difficulty": "medium"}}
]

No extra text, just the JSON array."""

    response = call_ai(prompt)

    try:
        clean = response.strip()
        if "```" in clean:
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        questions = json.loads(clean)
    except:
        questions = [{"id": 1, "question": response, "type": req.q_type}]

    return {"questions": questions, "role": req.role, "level": req.level}