import re
from app.ai.provider import AISummaryProvider

class HeuristicSummaryProvider(AISummaryProvider):
    def summarize(self, text: str) -> str:
        if not text or not text.strip():
            return "No content available to summarize."

        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # Action item keywords
        action_keywords = ["action", "todo", "task", "assign", "follow up", "due", "deadline", "will", "need to"]
        key_decisions_keywords = ["decide", "agree", "resolve", "approved", "conclude", "decision", "planned"]
        
        key_points = []
        action_items = []

        for line in lines:
            clean_line = re.sub(r'^[•\-\*\d\.\s]+', '', line).strip()
            if not clean_line:
                continue
                
            lower_line = clean_line.lower()
            if any(kw in lower_line for kw in action_keywords):
                action_items.append(f"- {clean_line}")
            else:
                key_points.append(f"- {clean_line}")

        if not key_points and lines:
            key_points = [f"- {line}" for line in lines[:4]]

        summary_parts = ["📌 **Executive Key Takeaways**:"]
        summary_parts.extend(key_points[:5])
        
        if action_items:
            summary_parts.append("\n✅ **Action Items & Next Steps**:")
            summary_parts.extend(action_items[:5])
        else:
            summary_parts.append("\n✅ **Action Items & Next Steps**:\n- Review meeting discussion and align on follow-up responsibilities.")

        return "\n".join(summary_parts)
