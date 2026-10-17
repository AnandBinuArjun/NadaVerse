"""
Endpoints for Carnatic Heritage Archive.
Provides discovery over peer-reviewed musicological history, regional traditions,
and instrument crafting treatises, with a transparent editorial workflow.
"""

from typing import List, Optional
import re
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, Query, status
from sqlalchemy import select, or_, and_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.entities import HeritageEntry, User, AuditEvent
from app.api.deps import get_optional_current_user, get_current_user, get_current_editor_or_admin
from app.schemas.heritage import (
    HeritageEntryCreate,
    HeritageEntryOut,
    HeritageReviewAction
)

router = APIRouter(prefix="/heritage", tags=["Carnatic Heritage Archive"])

# Curated baseline records loaded if DB table is fresh
BASELINE_HERITAGE_RECORDS = [
    {
        "slug": "thanjavur-veena-jackwood-crafting",
        "title": "Thanjavur Veena: The Craft of Single-Block Jackwood Carving",
        "category": "instrument_craft",
        "historical_period": "17th Century – Present",
        "summary": "Exploration of the traditional 'Ekanda Veena' method where the Kudam (resonator), Dandi (fingerboard), and Yali (scroll) are carved from a single mature Jackwood log.",
        "content": "The Thanjavur Veena represents the zenith of South Indian acoustic lutherie. Unlike composite instruments, the authentic Ekanda Veena is carved from a single solid trunk of the mature Jackfruit tree (Artocarpus heterophyllus), prized for its fine cellular grain and resonant tonal velocity. Traditional craftsmen in Panruti and Thanjavur carve the hemispherical Kudam, scrape the interior wall to a uniform 6mm thickness to achieve crystalline resonance, and fuse the 24 brass frets using an acoustic wax matrix composed of purified beeswax and powdered charcoal.",
        "primary_contributor": "Thanjavur Traditional Guild & NadaVerse Archival Team",
        "source_citations": "Prof. P. Sambamoorthy, 'South Indian Music', Vol. 4; Government of India GI Tag Documentation (GI-187); Thanjavur Musical Instrument Workers Co-operative Society.",
        "licensing_info": "Public Domain Documentation / Creative Commons Attribution-ShareAlike 4.0 International",
        "editorial_status": "published"
    },
    {
        "slug": "purandara-dasa-pedagogy-revolution",
        "title": "The Karnataka Sangita Pitamaha: Codification of the Abhyasa Gana",
        "category": "biography",
        "historical_period": "c. 1484 – 1564 CE",
        "summary": "How Saint Purandara Dasa revolutionized Carnatic pedagogy by establishing the Mayamalavagowla framework and the graded Varisai curriculum.",
        "content": "Prior to Purandara Dasa (1484–1564 CE), musical instruction lacked a standardized pedagogical sequence. Purandara Dasa formulated the entire graded curriculum used to this day: commencing with Sarali Varisais in Mayamalavagowla (utilizing symmetrical tetrachords separated by semitones), advancing through Jantai Varisais, Alankarams in the Sapta Talas, and Gita compositions in Malahari. His methodology transformed music from courtly exclusivity into an accessible sacred discipline.",
        "primary_contributor": "Carnatic Musicology Archive Project",
        "source_citations": "Sangita Kalanidhi T. V. Subba Rao, 'Studies in Indian Music'; Prof. S. R. Janakiraman, 'Ragas of Indian Music'.",
        "licensing_info": "Public Domain Academic Excerpt / Educational Fair Use",
        "editorial_status": "published"
    },
    {
        "slug": "sangita-sampradaya-pradarsini-lineage",
        "title": "Subbarama Dikshitar & the Printing of Sangita Sampradaya Pradarsini (1904)",
        "category": "treatise_history",
        "historical_period": "1904 CE",
        "summary": "The monumental publication of Subbarama Dikshitar's 1,700-page encyclopedia, documenting Muttuswami Dikshitar's authentic compositions and notation systems.",
        "content": "Published under the patronage of the Maharaja of Ettayapuram in 1904, the 'Sangita Sampradaya Pradarsini' stands as the single most comprehensive notated repository of Carnatic classical compositions. Subbarama Dikshitar devised intricate notation symbols to document the 10 vital gamakas (deflections, Kampita, Nokku, Ravai, Khandippu) that are otherwise lost in plain letter notation.",
        "primary_contributor": "Ettayapuram Heritage Preservation Trust",
        "source_citations": "Subbarama Dikshitar, 'Sangita Sampradaya Pradarsini' (Ettayapuram Samsthanam, 1904); Music Academy Madras Commemorative Edition (1961).",
        "licensing_info": "Public Domain 1904 Publication",
        "editorial_status": "published"
    },
    {
        "slug": "kudumiyanmalai-rock-inscriptions",
        "title": "Kudumiyanmalai Rock Inscriptions: 7th Century Musicological Epigraphy",
        "category": "regional_tradition",
        "historical_period": "7th Century CE (Pallava Dynasty)",
        "summary": "Ancient musical notations carved in rock at the Sikhagiriswara temple in Pudukkottai, commissioned by King Mahendravarman I.",
        "content": "The Kudumiyanmalai rock inscription in Pudukkottai District, Tamil Nadu, is one of the world's earliest extant epigraphic records of musical notation. Inscribed in Pallava Grantha script, the inscription contains musical notations arranged in seven sections corresponding to seven ancient Grama Ragas (Madhyama Grama, Shadja Grama, etc.), each organized in four-note permutations. The final colophon attributes the compilation to Parama Mahesvara (King Mahendravarman I) guided by teacher Rudracharya.",
        "primary_contributor": "Tamil Nadu Epigraphy Society",
        "source_citations": "Archaeological Survey of India, 'Epigraphia Indica', Vol. XII; Dr. C. Meenakshi, 'Administration and Social Life under the Pallavas'.",
        "licensing_info": "Public Domain Archaeological Documentation",
        "editorial_status": "published"
    }
]


def slugify(text: str) -> str:
    s = re.sub(r"[^\w\s-]", "", text.lower()).strip()
    return re.sub(r"[-\s]+", "-", s)


@router.get("", response_model=List[HeritageEntryOut])
async def list_published_heritage_entries(
    category: Optional[str] = Query(None, description="Filter by category"),
    q: Optional[str] = Query(None, description="Search query"),
    db: AsyncSession = Depends(get_db)
):
    """
    Public discovery endpoint for verified, source-attributed Carnatic heritage records.
    Only returns records with 'published' editorial status.
    """
    # Check if database has any records; if empty, seed baseline records
    count = await db.scalar(select(func.count(HeritageEntry.id))) or 0
    if count == 0:
        for r in BASELINE_HERITAGE_RECORDS:
            entry = HeritageEntry(
                slug=r["slug"],
                title=r["title"],
                category=r["category"],
                historical_period=r["historical_period"],
                summary=r["summary"],
                content=r["content"],
                primary_contributor=r["primary_contributor"],
                source_citations=r["source_citations"],
                licensing_info=r["licensing_info"],
                editorial_status=r["editorial_status"]
            )
            db.add(entry)
        await db.commit()

    conditions = [HeritageEntry.editorial_status == "published"]
    if category and category != "all":
        conditions.append(HeritageEntry.category == category)
    if q:
        query_like = f"%{q.lower()}%"
        conditions.append(
            or_(
                func.lower(HeritageEntry.title).like(query_like),
                func.lower(HeritageEntry.summary).like(query_like),
                func.lower(HeritageEntry.content).like(query_like),
                func.lower(HeritageEntry.historical_period).like(query_like)
            )
        )

    stmt = select(HeritageEntry).where(and_(*conditions)).order_by(HeritageEntry.created_at.desc())
    res = await db.execute(stmt)
    entries = res.scalars().all()

    return [
        HeritageEntryOut(
            id=e.id,
            slug=e.slug,
            title=e.title,
            category=e.category,
            historical_period=e.historical_period,
            summary=e.summary,
            content=e.content,
            primary_contributor=e.primary_contributor,
            source_citations=e.source_citations,
            licensing_info=e.licensing_info,
            editorial_status=e.editorial_status,
            reviewer_notes=e.reviewer_notes,
            created_at=e.created_at,
            updated_at=e.updated_at
        )
        for e in entries
    ]


@router.get("/{slug}", response_model=HeritageEntryOut)
async def get_heritage_entry(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(HeritageEntry).where(
        and_(HeritageEntry.slug == slug, HeritageEntry.editorial_status == "published")
    )
    res = await db.execute(stmt)
    entry = res.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Heritage entry not found or pending review.")

    return HeritageEntryOut(
        id=entry.id,
        slug=entry.slug,
        title=entry.title,
        category=entry.category,
        historical_period=entry.historical_period,
        summary=entry.summary,
        content=entry.content,
        primary_contributor=entry.primary_contributor,
        source_citations=entry.source_citations,
        licensing_info=entry.licensing_info,
        editorial_status=entry.editorial_status,
        reviewer_notes=entry.reviewer_notes,
        created_at=entry.created_at,
        updated_at=entry.updated_at
    )


@router.post("/submit", response_model=HeritageEntryOut, status_code=status.HTTP_201_CREATED)
async def submit_heritage_entry_for_review(
    payload: HeritageEntryCreate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Submits a new heritage archive entry.
    All submissions are entered with 'pending_review' status and are never published automatically.
    """
    base_slug = slugify(payload.title)
    slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"

    entry = HeritageEntry(
        slug=slug,
        title=payload.title,
        category=payload.category,
        historical_period=payload.historical_period,
        summary=payload.summary,
        content=payload.content,
        primary_contributor=payload.primary_contributor or (current_user.email if current_user else "Independent Scholar"),
        source_citations=payload.source_citations,
        licensing_info=payload.licensing_info,
        editorial_status="pending_review",
        submitter_id=current_user.id if current_user else None
    )
    db.add(entry)

    audit = AuditEvent(
        actor_id=current_user.id if current_user else "anonymous_contributor",
        action="submit_heritage_entry",
        target_type="heritage",
        target_id=slug,
        details=f"Title: {entry.title} | Citations: {entry.source_citations[:80]}"
    )
    db.add(audit)

    await db.commit()
    await db.refresh(entry)

    return HeritageEntryOut(
        id=entry.id,
        slug=entry.slug,
        title=entry.title,
        category=entry.category,
        historical_period=entry.historical_period,
        summary=entry.summary,
        content=entry.content,
        primary_contributor=entry.primary_contributor,
        source_citations=entry.source_citations,
        licensing_info=entry.licensing_info,
        editorial_status=entry.editorial_status,
        reviewer_notes=entry.reviewer_notes,
        created_at=entry.created_at,
        updated_at=entry.updated_at
    )


@router.get("/editorial/pending", response_model=List[HeritageEntryOut])
async def list_pending_heritage_reviews(
    current_user: User = Depends(get_current_editor_or_admin),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(HeritageEntry)
        .where(HeritageEntry.editorial_status == "pending_review")
        .order_by(HeritageEntry.created_at.desc())
    )
    res = await db.execute(stmt)
    entries = res.scalars().all()
    return [
        HeritageEntryOut(
            id=e.id,
            slug=e.slug,
            title=e.title,
            category=e.category,
            historical_period=e.historical_period,
            summary=e.summary,
            content=e.content,
            primary_contributor=e.primary_contributor,
            source_citations=e.source_citations,
            licensing_info=e.licensing_info,
            editorial_status=e.editorial_status,
            reviewer_notes=e.reviewer_notes,
            created_at=e.created_at,
            updated_at=e.updated_at
        )
        for e in entries
    ]


@router.post("/{id}/review", response_model=HeritageEntryOut)
async def review_heritage_submission(
    id: str,
    action: HeritageReviewAction,
    current_user: User = Depends(get_current_editor_or_admin),
    db: AsyncSession = Depends(get_db)
):
    entry = await db.get(HeritageEntry, id)
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Heritage entry not found.")

    if action.editorial_status not in ["published", "rejected"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Editorial status must be 'published' or 'rejected'.")

    entry.editorial_status = action.editorial_status
    entry.reviewer_notes = action.reviewer_notes
    entry.updated_at = datetime.now(timezone.utc)

    audit = AuditEvent(
        actor_id=current_user.id,
        action="review_heritage_entry",
        target_type="heritage",
        target_id=entry.slug,
        details=f"Status set to {entry.editorial_status} with notes: {entry.reviewer_notes}"
    )
    db.add(audit)

    await db.commit()
    await db.refresh(entry)

    return HeritageEntryOut(
        id=entry.id,
        slug=entry.slug,
        title=entry.title,
        category=entry.category,
        historical_period=entry.historical_period,
        summary=entry.summary,
        content=entry.content,
        primary_contributor=entry.primary_contributor,
        source_citations=entry.source_citations,
        licensing_info=entry.licensing_info,
        editorial_status=entry.editorial_status,
        reviewer_notes=entry.reviewer_notes,
        created_at=entry.created_at,
        updated_at=entry.updated_at
    )
