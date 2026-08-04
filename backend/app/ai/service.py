from app.ai.heuristic_provider import HeuristicSummaryProvider
from app.ai.openai_provider import ExternalAISummaryProvider
from app.core.config import settings

class AISummaryService:
    @staticmethod
    def generate_summary(text: str) -> tuple[str, str]:
        provider_name = settings.AI_PROVIDER.lower()
        
        if provider_name in ["openai", "gemini"] and (settings.OPENAI_API_KEY or settings.GEMINI_API_KEY):
            provider = ExternalAISummaryProvider(provider_type=provider_name)
            summary = provider.summarize(text)
            return summary, f"AI ({provider_name.capitalize()})"
        
        provider = HeuristicSummaryProvider()
        summary = provider.summarize(text)
        return summary, "MeetFlow AI Engine"
