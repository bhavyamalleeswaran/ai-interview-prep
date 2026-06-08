from utils.claude_client import call_ai
import json

prompt = """Generate 3 behavioral interview questions
for a Mid-level Software Engineer.
Return ONLY a JSON array like:
[{"id":1,"question":"...","type":"behavioral","difficulty":"medium"}]
No extra text."""

result = call_ai(prompt)
print(result)