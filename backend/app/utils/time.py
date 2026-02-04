from datetime import datetime, timedelta, timezone
from app.schemas.enums import ExpiryPreset


def parse_expires_in(preset: ExpiryPreset) -> datetime:
    now = datetime.now(timezone.utc)
    mapping = {
        ExpiryPreset.ONE_HOUR: timedelta(hours=1),
        ExpiryPreset.SIX_HOURS: timedelta(hours=6),
        ExpiryPreset.TWENTY_FOUR_HOURS: timedelta(hours=24),
        ExpiryPreset.TWO_DAYS: timedelta(days=2),
        ExpiryPreset.SEVEN_DAYS: timedelta(days=7),
    }
    return now + mapping[preset]
