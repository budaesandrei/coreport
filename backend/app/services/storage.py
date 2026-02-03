from __future__ import annotations

import hashlib
from pathlib import Path

from app.core.config import settings


def ensure_storage_dir() -> Path:
    p = Path(settings.FILE_STORAGE_PATH)
    p.mkdir(parents=True, exist_ok=True)
    return p


def file_fingerprint(sheet_names: list[str], headers_sample: list[str]) -> str:
    h = hashlib.sha256()
    h.update("|".join(sheet_names).encode())
    h.update("|".join(headers_sample).encode())
    return h.hexdigest()
