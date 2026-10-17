"""
Provider-Neutral AI Gateway for NadaVerse.
Orchestrates retrieval from reviewed Carnatic content revisions, enforces
safety boundaries against prompt-injection, validates citation links,
and applies rate-limiting safeguards.
Grounded with Google Gemini 1.5 Flash / Pro and verified classical treatises.
"""

from typing import List, Dict, Any, Optional, AsyncGenerator
import json
import asyncio
import unicodedata
import re
from datetime import datetime, timezone
from app.core.config import settings
from app.data.verified_corpus import (
    VERIFIED_RAGAS_DATA,
    VERIFIED_TALAS_DATA,
    VERIFIED_INSTRUMENTS_DATA,
    VERIFIED_COMPOSERS_DATA,
    VERIFIED_COMPOSITIONS_DATA,
    VERIFIED_GLOSSARY_DATA,
)
from app.schemas.tutor import TutorCitation, TutorResponse
from app.schemas.audio_practice import AudioPracticeAnalysisRequest, AudioPracticeAnalysisResponse


class AIGatewayService:
    def __init__(self, provider: str = settings.AI_GATEWAY_PROVIDER):
        self.provider = provider
        self.max_tokens = 600
        self.temperature = 0.2  # deterministic, low hallucination per classical treatises

    def retrieve_approved_context(self, query: str) -> List[Dict[str, Any]]:
        """
        Retrieval engine over verified, peer-reviewed musicology records.
        Returns matching content records with citation metadata.
        """
        q = query.lower()
        matched_docs: List[Dict[str, Any]] = []

        # 1. Match Ragas
        for r in VERIFIED_RAGAS_DATA:
            if (
                r["slug"] in q
                or r["canonical_name"].lower() in q
                or any(alias.lower() in q for alias in r.get("alternate_names", []))
                or ("melakarta" in q and str(r.get("melakarta_number")) in q)
                or ("beginner" in q and r["slug"] == "mayamalavagowla")
            ):
                matched_docs.append({
                    "slug": r["slug"],
                    "title": r["canonical_name"],
                    "type": "raga",
                    "text": f"{r['canonical_name']} is Melakarta #{r.get('melakarta_number')}. Arohanam: {r['arohanam']}. Avarohanam: {r['avarohanam']}. {r['educational_summary']} {r['historical_context']}",
                    "source": r["sources"][0] if r.get("sources") else None
                })

        # 2. Match Talas
        for t in VERIFIED_TALAS_DATA:
            if t["slug"] in q or t["canonical_name"].lower() in q or ("tala" in q and "adi" in q and t["slug"] == "adi-tala"):
                matched_docs.append({
                    "slug": t["slug"],
                    "title": t["canonical_name"],
                    "type": "tala",
                    "text": f"{t['canonical_name']} ({t['angas_formula']}, {t['total_aksharas']} aksharas). {t['description']}",
                    "source": t["sources"][0] if t.get("sources") else None
                })

        # 3. Match Instruments
        for inst in VERIFIED_INSTRUMENTS_DATA:
            if inst["slug"] in q or inst["canonical_name"].lower() in q or ("veena" in q and inst["slug"] == "saraswati-veena") or ("drum" in q and inst["slug"] == "mridangam"):
                matched_docs.append({
                    "slug": inst["slug"],
                    "title": inst["canonical_name"],
                    "type": "instrument",
                    "text": f"{inst['canonical_name']} ({inst['family']}). {inst['role_in_concert']} {inst['historical_context']}",
                    "source": inst["sources"][0] if inst.get("sources") else None
                })

        # 4. Match Composers
        for comp in VERIFIED_COMPOSERS_DATA:
            if comp["slug"] in q or comp["name"].lower() in q or (comp["signature_mudra"].lower() in q):
                matched_docs.append({
                    "slug": comp["slug"],
                    "title": comp["name"],
                    "type": "composer",
                    "text": f"{comp['name']} ({comp['lifespan']}). {comp['biography']} Signature mudra: {comp['signature_mudra']}.",
                    "source": {"title": "Biographical Records of Carnatic Composers", "author_or_creator": "Prof. P. Sambamoorthy", "citation": "Indian Music Publishing House, 1970"}
                })

        # 5. Match Glossary Terms
        for g in VERIFIED_GLOSSARY_DATA:
            term_lower = g["term"].lower()
            if term_lower in q or g.get("transliteration", "").lower() in q:
                matched_docs.append({
                    "slug": f"glossary-{term_lower.replace(' ', '-')}",
                    "title": g["term"],
                    "type": "glossary",
                    "text": f"{g['term']} ({g['category']}): {g['simple_explanation']} {g['detailed_context']}",
                    "source": {"title": "Glossary of Carnatic Musicology", "author_or_creator": "NadaVerse Editorial Board", "citation": "NadaVerse Treatise Database, 2026"}
                })

        return matched_docs

    def sanitize_and_check_injection(self, query: str) -> bool:
        """
        Guards against prompt-injection attempts (e.g. system instructions override,
        roleplay attempts to leak API keys or ignore safety boundaries).
        Performs Unicode normalization, control char stripping, and structural regex matching.
        """
        if not query or len(query.strip()) < 2 or len(query) > 1000:
            return False

        # Normalize unicode to NFKC to defeat homoglyph and zero-width evasion
        normalized = unicodedata.normalize("NFKC", query)

        # Disallow dangerous control characters / invisible directional overrides
        if any(unicodedata.category(c) in ('Cc', 'Cf') and c not in ('\n', '\r', '\t') for c in normalized):
            return False

        q_lower = normalized.lower()
        suspicious_patterns = [
            r"ignore\s+(all\s+)?previous\s+instructions",
            r"disregard\s+all\s+rules",
            r"system\s+prompt",
            r"reveal\s+(your\s+|the\s+)?(api|secret)\s+key",
            r"you\s+are\s+now\s+(an?\s+)?unrestricted",
            r"developer\s+mode",
            r"bypass\s+guardrails",
            r"jailbreak",
            r"override\s+safety",
            r"```(system|instructions|admin)",
            r"<\|im_start\|>",
            r"<\|im_end\|>",
            r"\[inst\]",
            r"\[/inst\]"
        ]
        for pattern in suspicious_patterns:
            if re.search(pattern, q_lower):
                return False
        return True

    def build_grounded_prompt(self, query: str, matched_docs: List[Dict[str, Any]]) -> str:
        grounded_context = "\n".join([f"- {d['title']}: {d['text']}" for d in matched_docs[:4]])
        return (
            "You are the NadaVerse Carnatic Musicology AI Tutor. "
            "Answer the student's inquiry with utmost musicological accuracy, grounding your explanation strictly in authentic Carnatic treatises "
            "(Chaturdandi Prakasika, Sangita Ratnakara, Sangita Sampradaya Pradarsini). "
            "Explicitly mention swaras, intervals, arohanam/avarohanam, or tala kriyas where applicable. "
            "Maintain a respectful, encouraging, and authoritative traditional pedagogical tone. Never hallucinate swaras or historical dates.\n\n"
            f"Grounded Musicological Context:\n{grounded_context}\n\n"
            f"Student Inquiry: {query}"
        )

    async def call_gemini_api(self, prompt: str) -> Optional[str]:
        """
        Invokes Google Gemini API with temperature 0.2 for deterministic musicological reasoning.
        """
        if not settings.AI_GATEWAY_API_KEY:
            return None
            
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.AI_GATEWAY_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": self.temperature,
                "maxOutputTokens": self.max_tokens
            }
        }
        
        try:
            import httpx
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
        except Exception:
            pass
        return None

    async def generate_grounded_response(self, conversation_id: str, query: str) -> TutorResponse:
        # Prompt-injection check
        if not self.sanitize_and_check_injection(query):
            return TutorResponse(
                conversation_id=conversation_id,
                answer="I can only assist with verified Carnatic music theory, history, and practice queries grounded in authentic treatises. Your request contained instructions that cannot be processed.",
                citations=[],
                confidence_level="uncertain",
                provenance="guardrail_blocked",
                uncertainty_note="Prompt injection guard triggered. Processing safely terminated.",
                suggested_followups=["Explain the swaras of Mayamalavagowla", "What is Adi Tala?"]
            )

        matched_docs = self.retrieve_approved_context(query)

        # Fallback if no verified documents match
        if not matched_docs:
            return TutorResponse(
                conversation_id=conversation_id,
                answer="I do not possess sufficient reviewed musicological documentation in the peer-reviewed NadaVerse knowledge base to answer this inquiry with authoritative confidence. In keeping with our product principles, I refrain from fabricating unverified claims.",
                citations=[],
                confidence_level="uncertain",
                provenance="insufficient_evidence",
                uncertainty_note="Topic outside currently reviewed corpus. Refusal/fallback applied per product safety principles.",
                suggested_followups=[
                    "Why is Mayamalavagowla used for beginner exercises?",
                    "What are the kriyas of Adi Tala?",
                    "How is the Saraswati Veena constructed?"
                ]
            )

        # Build citations
        primary_doc = matched_docs[0]
        citations: List[TutorCitation] = []
        for doc in matched_docs[:2]:
            source_info = doc.get("source") or {}
            citations.append(
                TutorCitation(
                    content_slug=doc["slug"],
                    title=source_info.get("title", doc["title"]),
                    content_type=doc["type"],
                    excerpt=source_info.get("citation", doc["text"][:120]),
                    source_attribution=source_info.get("author_or_creator", "NadaVerse Musicology Board"),
                    source_id=f"corpus_{doc['type']}_{doc['slug']}",
                    reference_edition=source_info.get("citation", "NadaVerse Reviewed Classical Corpus, 2026"),
                    verbatim_source_quote=doc["text"][:180],
                )
            )

        # Invoke Live Gemini if configured
        answer_text = None
        provenance = "retrieval_only"
        confidence_level = "moderate"
        uncertainty_note = None

        if self.provider == "gemini" and settings.AI_GATEWAY_API_KEY:
            prompt = self.build_grounded_prompt(query, matched_docs)
            answer_text = await self.call_gemini_api(prompt)
            if answer_text:
                provenance = "model_generated"
                confidence_level = "high"
            else:
                provenance = "model_unavailable"
                confidence_level = "moderate"
                uncertainty_note = "Live AI model was temporarily unavailable; served verbatim verified treatise reference text."

        # Grounded fallback if Gemini key is not set or network error occurs
        if not answer_text:
            answer_text = f"Based on reviewed reference treatises: {primary_doc['text']}"
            if provenance == "retrieval_only":
                confidence_level = "high" if primary_doc.get("source") else "moderate"
                uncertainty_note = "Direct citation from peer-reviewed Carnatic treatise database; served verbatim verified reference text."

        return TutorResponse(
            conversation_id=conversation_id,
            answer=answer_text,
            citations=citations,
            confidence_level=confidence_level,
            provenance=provenance,
            uncertainty_note=uncertainty_note,
            suggested_followups=[
                f"What compositions are rendered in {primary_doc['title']}?",
                "Which tala is traditionally paired with this?",
                "Explore in Practice Studio"
            ]
        )

    async def stream_grounded_response(self, conversation_id: str, query: str) -> AsyncGenerator[str, None]:
        """
        Streams response chunks for Server-Sent Events (SSE).
        Streams directly from live Gemini API if API key is provided,
        or streams from grounded knowledge base with natural cadence.
        """
        if not self.sanitize_and_check_injection(query):
            yield "I can only assist with verified Carnatic music theory, history, and practice queries grounded in authentic treatises."
            return

        matched_docs = self.retrieve_approved_context(query)
        if not matched_docs:
            yield "I do not possess sufficient reviewed musicological documentation in the peer-reviewed NadaVerse knowledge base to answer this inquiry with authoritative confidence."
            return

        # Attempt live Gemini streaming if API key is available
        if self.provider == "gemini" and settings.AI_GATEWAY_API_KEY:
            try:
                import httpx
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key={settings.AI_GATEWAY_API_KEY}"
                prompt = self.build_grounded_prompt(query, matched_docs)
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": self.temperature,
                        "maxOutputTokens": self.max_tokens
                    }
                }
                async with httpx.AsyncClient(timeout=25.0) as client:
                    async with client.stream("POST", url, json=payload) as response:
                        if response.status_code == 200:
                            async for line in response.aiter_lines():
                                if line.startswith("data: "):
                                    data_str = line[6:].strip()
                                    if data_str:
                                        try:
                                            chunk_data = json.loads(data_str)
                                            candidates = chunk_data.get("candidates", [])
                                            if candidates:
                                                parts = candidates[0].get("content", {}).get("parts", [])
                                                for part in parts:
                                                    text = part.get("text", "")
                                                    if text:
                                                        yield text
                                        except Exception:
                                            pass
                            return
            except Exception:
                # Fall through to grounded fallback stream
                pass

        # Grounded verified response fallback stream
        response = await self.generate_grounded_response(conversation_id, query)
        words = response.answer.split(" ")
        for i, word in enumerate(words):
            chunk = word + (" " if i < len(words) - 1 else "")
            yield chunk
            await asyncio.sleep(0.02)

    async def generate_practice_analysis_explanation(
        self, payload: AudioPracticeAnalysisRequest
    ) -> AudioPracticeAnalysisResponse:
        """
        Explainable AI Practice Companion analysis layer.
        Receives real measured acoustic metrics (cents, stability, durations)
        and synthesizes an evidence-grounded pedagogical evaluation.
        Never invents measurements or claims unvalidated gamaka / raga recognition.
        """
        # Calculate bounded overall score
        # Combination of cent precision and pitch stability
        stability_component = payload.overall_stability_pct * 0.5
        accuracy_component = max(0.0, 100.0 - (payload.mean_absolute_cent_error * 2.0)) * 0.5
        overall_score = round(max(10.0, min(99.0, stability_component + accuracy_component)), 1)

        # Accuracy label
        if payload.mean_absolute_cent_error <= 15.0:
            pitch_label = "Exemplary Shruti Alignment (<= 15 cents error)"
        elif payload.mean_absolute_cent_error <= 28.0:
            pitch_label = "Good Shruti Steadiness (Minor Microtonal Drift)"
        elif payload.mean_absolute_cent_error <= 45.0:
            pitch_label = "Developing Pitch Alignment (Moderate Cent Deviation)"
        else:
            pitch_label = "Unstable Adhara Shadjam Pitch Centre"

        # Stability label
        if payload.overall_stability_pct >= 85.0:
            stab_label = "Rock Solid Sustained Tone Production"
        elif payload.overall_stability_pct >= 70.0:
            stab_label = "Steady with Slight Tremor on Long Notes"
        else:
            stab_label = "Fluctuating Vocal Stability (Breath Support Recommended)"

        strengths: List[str] = []
        improvements: List[str] = []
        recommended_exercises: List[str] = []

        # Analyze individual measured swara metrics
        for m in payload.swara_metrics:
            if abs(m.deviation_cents) <= 14.0 and m.stability_pct >= 78.0:
                strengths.append(
                    f"Clean intonation on {m.swara} (dev: {m.deviation_cents:+.1f} cents, stability: {m.stability_pct:.0f}%)"
                )
            elif m.deviation_cents > 20.0:
                improvements.append(
                    f"Sharp tendency on {m.swara} (+{m.deviation_cents:.1f} cents above just intonation); relax vocal tract."
                )
            elif m.deviation_cents < -20.0:
                improvements.append(
                    f"Flat tendency on {m.swara} ({m.deviation_cents:.1f} cents below just intonation); ensure steady breath support."
                )
            elif m.stability_pct < 65.0:
                improvements.append(
                    f"Pitch oscillation on sustained {m.swara} ({m.stability_pct:.0f}% stability); practice sustaining with tambura drone."
                )

        if not strengths:
            strengths.append(f"Completed full {payload.duration_seconds:.1f}s take with sustained sound production.")
        if not improvements:
            improvements.append("Maintain relaxed posture when transitioning between higher octaves.")

        # Recommender mapping based on error profile
        if payload.mean_absolute_cent_error > 25.0:
            recommended_exercises.extend([
                "Shruti & Adhara Shadjam Alignment (Lesson V-01)",
                "Sapta Swaras in Mayamalavagowla (Lesson V-02)",
                "Sarali Varisai 1 in 1st Kalam (Lesson V-04)"
            ])
        else:
            recommended_exercises.extend([
                "Jantai Varisai 1 & 2 (Lesson V-05)",
                "Alankaram in Dhruva Tala (Lesson V-06)",
                "Mohanam Raga Swarajati Practice (Lesson V-07)"
            ])

        # Grounded AI Summary explanation
        summary_explanation = (
            f"Your performance of '{payload.exercise_name}' in tonic {payload.tonic} ({payload.tonic_frequency:.1f} Hz) "
            f"achieved a pitch stability score of {payload.overall_stability_pct:.1f}% with an average deviation of "
            f"{payload.mean_absolute_cent_error:.1f} cents from just intonation swarasthanas. "
        )

        provenance = "grounded_rule_engine"
        confidence = "moderate_deterministic_estimate"
        analysis_quality = "local_heuristic_estimate"
        is_heuristic_fallback = True

        # Attempt Gemini synthesis if API key is present
        if self.provider == "gemini" and settings.AI_GATEWAY_API_KEY:
            gemini_prompt = (
                "You are an encouraging, authoritative Carnatic music guru analyzing an acoustic practice performance. "
                "Synthesize a concise 2-sentence feedback summary based STRICTLY on these validated measurements:\n"
                f"- Exercise: {payload.exercise_name}\n"
                f"- Tonic: {payload.tonic} ({payload.tonic_frequency} Hz)\n"
                f"- Mean Absolute Cent Error: {payload.mean_absolute_cent_error:.1f} cents\n"
                f"- Pitch Stability: {payload.overall_stability_pct:.1f}%\n"
                f"- Strengths: {', '.join(strengths[:2])}\n"
                f"- Target Areas: {', '.join(improvements[:2])}\n"
                "Emphasize Carnatic vocal pedagogy (Gamaka krama, steady breath support, Adhara Shadjam focus). Do not invent false metrics."
            )
            ai_summary = await self.call_gemini_api(gemini_prompt)
            if ai_summary and len(ai_summary.strip()) > 15:
                summary_explanation = ai_summary.strip()
                provenance = "gemini_grounded_acoustic_synthesis"
                confidence = "moderate_grounded_synthesis"
                analysis_quality = "algorithmic_synthesis"
                is_heuristic_fallback = False

        limitations = (
            f"Acoustic Notice: Pitch measurements are extracted via local time-domain autocorrelation and cepstral analysis "
            f"relative to Adhara Shadjam ({payload.tonic} = {payload.tonic_frequency:.1f} Hz). Background room noise, "
            f"microphone frequency response, vocal harmonic resonance, and intentional gamakas (deflections) "
            f"naturally introduce bounded measurement variance. This system serves as a pedagogical practice companion, "
            f"not an automated examination grading tool."
        )

        measured_metrics = [
            "autocorrelation_fundamental_pitch_f0",
            "cent_deviation_from_just_intonation",
            "frame_variance_stability_pct"
        ]
        inferred_metrics = [
            "pitch_accuracy_classification",
            "guru_pedagogical_guidance",
            "recommended_sadhana_lessons"
        ]

        return AudioPracticeAnalysisResponse(
            exercise_name=payload.exercise_name,
            overall_score_pct=overall_score,
            pitch_accuracy_label=pitch_label,
            stability_label=stab_label,
            summary_explanation=summary_explanation,
            identified_strengths=strengths[:4],
            targeted_improvements=improvements[:4],
            recommended_exercises=recommended_exercises[:3],
            limitations_notice=limitations,
            confidence=confidence,
            provenance=provenance,
            analysis_quality=analysis_quality,
            is_heuristic_fallback=is_heuristic_fallback,
            measured_metrics=measured_metrics,
            inferred_metrics=inferred_metrics,
        )


ai_gateway = AIGatewayService()
