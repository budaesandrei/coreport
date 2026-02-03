from __future__ import annotations

import os
from pathlib import Path

import httpx
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.context import get_current_workspace_id
from app.db.session import get_db
from app.models.upload_job import UploadJob
from app.schemas.upload import ProposedMapping, UploadJobOut
from app.services.smart_mapper import propose_mapping
from app.services.storage import ensure_storage_dir

router = APIRouter()

MAX_BYTES = 10 * 1024 * 1024


@router.get("/", response_model=list[UploadJobOut])
async def list_uploads(db: AsyncSession = Depends(get_db)) -> list[UploadJob]:
    workspace_id = get_current_workspace_id()
    res = await db.execute(select(UploadJob).where(UploadJob.workspace_id == workspace_id).order_by(UploadJob.id))
    return list(res.scalars().all())


@router.post("/", response_model=UploadJobOut)
async def create_upload(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)) -> UploadJob:
    storage = ensure_storage_dir()
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large")

    # Save to disk for now.
    safe_name = os.path.basename(file.filename or "upload.bin")
    dest = storage / safe_name
    dest.write_bytes(data)

    job = UploadJob(file_name=safe_name, status="uploaded")
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


@router.post("/from-url", response_model=UploadJobOut)
async def create_upload_from_url(url: str, db: AsyncSession = Depends(get_db)) -> UploadJob:
    if not (url.startswith("http://") or url.startswith("https://")):
        raise HTTPException(status_code=400, detail="Only http(s) URLs are allowed")

    async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.content

    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="Downloaded file too large")

    storage = ensure_storage_dir()
    name = os.path.basename(url.split("?")[0]) or "download.bin"
    dest = storage / name
    dest.write_bytes(data)

    job = UploadJob(file_name=name, status="downloaded")
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


@router.post("/{upload_id}/propose-mapping", response_model=ProposedMapping)
async def propose_mapping_for_upload(upload_id: int, db: AsyncSession = Depends(get_db)) -> ProposedMapping:
    workspace_id = get_current_workspace_id()
    res = await db.execute(
        select(UploadJob).where(UploadJob.workspace_id == workspace_id, UploadJob.id == upload_id)
    )
    job = res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Upload not found")

    # Prototype schema + context. Real version uses ReportType + file parsing.
    report_schema = {
        "name": "rent_roll",
        "fields": [
            {"key": "property_id"},
            {"key": "unit_id"},
            {"key": "workspace_name"},
            {"key": "lease_start"},
            {"key": "lease_end"},
            {"key": "rent_amount_monthly"},
            {"key": "currency"},
        ],
    }
    file_context = {"file_name": job.file_name, "headers": []}
    proposed = await propose_mapping(report_schema, file_context)
    return ProposedMapping(mapping_spec=proposed.mapping_spec, confidence=proposed.confidence, warnings=proposed.warnings)
