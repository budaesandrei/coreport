from __future__ import annotations

import json
from dataclasses import dataclass

from openai import AsyncOpenAI

from app.core.config import settings


@dataclass
class ProposedMapping:
    mapping_spec: dict
    confidence: float
    warnings: list[str]


async def propose_mapping(report_schema: dict, file_context: dict) -> ProposedMapping:
    """Propose a mapping between a file and a report schema.

    Primary path: OpenAI structured JSON suggestion.
    Fallback: naive fuzzy/keyword matching.

    This is intentionally lightweight for the prototype; the UI flow can iterate on it.
    """

    if not settings.OPENAI_API_KEY:
        # Fallback: match by exact header keys if present.
        headers = [h.lower().strip() for h in file_context.get("headers", [])]
        mapping: dict = {}
        for field in report_schema.get("fields", []):
            key = field["key"] if isinstance(field, dict) else str(field)
            try:
                idx = headers.index(key.lower())
                mapping[key] = {"type": "column", "columnIndex": idx}
            except ValueError:
                mapping[key] = {"type": "constant", "value": None}
        return ProposedMapping(
            mapping_spec=mapping,
            confidence=0.2,
            warnings=["OPENAI_API_KEY missing; used heuristic mapping"],
        )

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    system = (
        "You are an expert data mapping assistant for financial reporting. "
        "Return ONLY valid JSON. No markdown."
    )
    user = {
        "task": "Propose a mapping from file_context to report_schema.",
        "report_schema": report_schema,
        "file_context": file_context,
        "mapping_types": [
            "column (sheet + headerRowIndex + columnIndex + headerText)",
            "cell (A1)",
            "range (A1:A10 or A4:G200)",
            "constant",
        ],
        "must_detect": [
            "header rows and table ranges",
            "sheet selection",
            "multilingual headers",
            "date format (mm/dd vs dd/mm) with confidence + warnings if ambiguous",
            "multiple entities in one file (split strategy or require user selection)",
        ],
        "output_schema": {
            "mapping_spec": "object keyed by report field key",
            "confidence": "0..1",
            "warnings": "array of strings",
        },
    }

    resp = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": json.dumps(user)},
        ],
        temperature=0.2,
    )

    content = resp.choices[0].message.content or "{}"
    data = json.loads(content)
    return ProposedMapping(
        mapping_spec=data.get("mapping_spec", {}),
        confidence=float(data.get("confidence", 0.0)),
        warnings=list(data.get("warnings", [])),
    )
