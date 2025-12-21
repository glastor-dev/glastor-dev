from datetime import datetime


def format_date(date: datetime) -> str:
    return date.isoformat(timespec="minutes")
