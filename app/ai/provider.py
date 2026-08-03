from abc import ABC, abstractmethod

class AISummaryProvider(ABC):
    @abstractmethod
    def summarize(self, text: str) -> str:
        """Generate summary for input text."""
        pass
