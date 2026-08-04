import httpx
from app.ai.provider import AISummaryProvider
from app.ai.heuristic_provider import HeuristicSummaryProvider
from app.core.config import settings

class ExternalAISummaryProvider(AISummaryProvider):
    def __init__(self, api_key: str = "", provider_type: str = "openai"):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.provider_type = provider_type
        self.fallback = HeuristicSummaryProvider()

    def summarize(self, text: str) -> str:
        if not self.api_key:
            return self.fallback.summarize(text)

        try:
            if self.provider_type == "openai":
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": "You are MeetFlow AI, a meeting assistant. Summarize meeting notes with key takeaways and action items in markdown format."},
                        {"role": "user", "content": f"Summarize these meeting notes:\n\n{text}"}
                    ],
                    "max_tokens": 500
                }
                with httpx.Client(timeout=10.0) as client:
                    resp = client.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
                    if resp.status_code == 200:
                        data = resp.json()
                        return data["choices"][0]["message"]["content"].strip()
            return self.fallback.summarize(text)
        except Exception:
            return self.fallback.summarize(text)
