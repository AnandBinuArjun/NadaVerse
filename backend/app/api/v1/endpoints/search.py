from typing import List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel

from app.data.verified_corpus import (
    VERIFIED_RAGAS_DATA,
    VERIFIED_TALAS_DATA,
    VERIFIED_INSTRUMENTS_DATA,
    VERIFIED_COMPOSERS_DATA,
    VERIFIED_COMPOSITIONS_DATA,
)

router = APIRouter(prefix="/search", tags=["Global Search & Discovery"])


class SearchResultItem(BaseModel):
    id: str
    slug: str
    title: str
    content_type: str # "raga", "tala", "instrument", "composer", "composition"
    subtitle: Optional[str] = None
    description: str
    review_status: Optional[str] = "expert_reviewed"


@router.get("", response_model=List[SearchResultItem])
async def global_search(
    q: str = Query(..., min_length=1, description="Search term across all Carnatic entities"),
    types: Optional[List[str]] = Query(None, description="Optional entity types to filter by")
):
    query = q.lower().strip()
    results: List[SearchResultItem] = []

    # 1. Search Ragas
    if not types or "raga" in types:
        for r in VERIFIED_RAGAS_DATA:
            if (
                query in r["canonical_name"].lower()
                or any(query in a.lower() for a in r.get("alternate_names", []))
                or query in r["arohanam"].lower()
                or query in r.get("educational_summary", "").lower()
            ):
                results.append(
                    SearchResultItem(
                        id=r["id"],
                        slug=r["slug"],
                        title=r["canonical_name"],
                        content_type="raga",
                        subtitle=f"Melakarta #{r.get('melakarta_number')}" if r.get("melakarta_number") else "Janya Raga",
                        description=r["educational_summary"][:160] + "...",
                        review_status=r.get("review_status", "expert_reviewed")
                    )
                )

    # 2. Search Talas
    if not types or "tala" in types:
        for t in VERIFIED_TALAS_DATA:
            if query in t["canonical_name"].lower() or query in t["description"].lower() or query in t["angas_formula"].lower():
                results.append(
                    SearchResultItem(
                        id=t["id"],
                        slug=t["slug"],
                        title=t["canonical_name"],
                        content_type="tala",
                        subtitle=f"{t['angas_formula']} ({t['total_aksharas']} Aksharas)",
                        description=t["description"][:160] + "...",
                        review_status=t.get("review_status", "expert_reviewed")
                    )
                )

    # 3. Search Instruments
    if not types or "instrument" in types:
        for inst in VERIFIED_INSTRUMENTS_DATA:
            if query in inst["canonical_name"].lower() or query in inst["family"].lower() or query in inst["role_in_concert"].lower():
                results.append(
                    SearchResultItem(
                        id=inst["id"],
                        slug=inst["slug"],
                        title=inst["canonical_name"],
                        content_type="instrument",
                        subtitle=f"Family: {inst['family']}",
                        description=inst["role_in_concert"][:160] + "...",
                        review_status=inst.get("review_status", "expert_reviewed")
                    )
                )

    # 4. Search Composers
    if not types or "composer" in types:
        for comp in VERIFIED_COMPOSERS_DATA:
            if query in comp["name"].lower() or query in comp["tradition"].lower() or query in comp["biography"].lower():
                results.append(
                    SearchResultItem(
                        id=comp["id"],
                        slug=comp["slug"],
                        title=comp["name"],
                        content_type="composer",
                        subtitle=f"{comp['tradition']} · {comp['lifespan']}",
                        description=comp["biography"][:160] + "...",
                        review_status="expert_reviewed"
                    )
                )

    # 5. Search Compositions
    if not types or "composition" in types:
        for kriti in VERIFIED_COMPOSITIONS_DATA:
            if query in kriti["title"].lower() or query in kriti["composer"].lower() or query in kriti["raga"].lower():
                results.append(
                    SearchResultItem(
                        id=kriti["id"],
                        slug=kriti["slug"],
                        title=kriti["title"],
                        content_type="composition",
                        subtitle=f"Raga: {kriti['raga']} · Tala: {kriti['tala']} · Composer: {kriti['composer']}",
                        description=kriti["summary"],
                        review_status="expert_reviewed"
                    )
                )

    return results
