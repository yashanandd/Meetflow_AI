from datetime import datetime, timezone

def format_datetime(dt: datetime) -> str:
    """Format datetime to ISO 8601 string representation."""
    if dt is None:
        return ""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()
