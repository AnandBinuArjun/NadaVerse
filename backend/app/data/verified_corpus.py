"""
Verified Carnatic Musicology Corpus with full provenance.
Based on historical treatises and Madras Music Academy publications.
"""

VERIFIED_RAGAS_DATA = [
    {
        "id": "raga-mayamalavagowla",
        "slug": "mayamalavagowla",
        "canonical_name": "Mayamalavagowla",
        "alternate_names": ["Mayamalavagaula", "Māyāmāḷavagauḷa"],
        "melakarta_number": 15,
        "is_melakarta": True,
        "chakra": "Agni (3rd Chakra, 3rd Raga)",
        "arohanam": "S R₁ G₃ M₁ P D₁ N₃ Ṡ",
        "avarohanam": "Ṡ N₃ D₁ P M₁ G₃ R₁ S",
        "arohanam_notes": ["Sa", "Shuddha Rishabham (R1)", "Antara Gandharam (G3)", "Shuddha Madhyamam (M1)", "Panchamam (P)", "Shuddha Dhaivatam (D1)", "Kakali Nishadam (N3)", "Tara Sa (Ṡ)"],
        "avarohanam_notes": ["Tara Sa (Ṡ)", "Kakali Nishadam (N3)", "Shuddha Dhaivatam (D1)", "Panchamam (P)", "Shuddha Madhyamam (M1)", "Antara Gandharam (G3)", "Shuddha Rishabham (R1)", "Sa"],
        "swaras": [
            {"symbol": "S", "full_name": "Shadjam", "frequency_ratio": 1.0, "swarasthana_name": "Adhara Shadjam"},
            {"symbol": "R₁", "full_name": "Shuddha Rishabham", "frequency_ratio": 16 / 15, "swarasthana_name": "Minor semitone above Sa"},
            {"symbol": "G₃", "full_name": "Antara Gandharam", "frequency_ratio": 5 / 4, "swarasthana_name": "Major third above Sa"},
            {"symbol": "M₁", "full_name": "Shuddha Madhyamam", "frequency_ratio": 4 / 3, "swarasthana_name": "Perfect fourth above Sa"},
            {"symbol": "P", "full_name": "Panchamam", "frequency_ratio": 3 / 2, "swarasthana_name": "Invariable fifth"},
            {"symbol": "D₁", "full_name": "Shuddha Dhaivatam", "frequency_ratio": 8 / 5, "swarasthana_name": "Minor sixth above Sa"},
            {"symbol": "N₃", "full_name": "Kakali Nishadam", "frequency_ratio": 15 / 8, "swarasthana_name": "Major seventh leading note"},
            {"symbol": "Ṡ", "full_name": "Tara Shadjam", "frequency_ratio": 2.0, "swarasthana_name": "Higher octave tonic"}
        ],
        "characteristic_phrases": ["P M₁ G₃ M₁ R₁ G₃ R₁ S", "S R₁ G₃ M₁ P D₁ P", "D₁ N₃ Ṡ, Ṡ N₃ D₁ P"],
        "mood_and_rasa": "Devotion (Bhakti), serene contemplation (Shanta), and inner poise.",
        "educational_summary": "The universal pedagogical raga of Carnatic music. Purandara Dasa (1484–1564 CE) established Mayamalavagowla as the baseline scale for all fundamental exercises.",
        "historical_context": "Chosen by Purandara Dasa due to the exact symmetrical tetrachord intervals between Sa-Ma and Pa-Tara Sa.",
        "famous_compositions": [
            {"title": "Tulasidala", "composer": "Saint Tyagaraja", "tala": "Rupaka", "language": "Telugu"},
            {"title": "Mayateeta Svarupini", "composer": "Ponniah Pillai", "tala": "Rupaka", "language": "Telugu"}
        ],
        "sources": [
            {
                "title": "Sangita Sampradaya Pradarsini",
                "author_or_creator": "Subbarama Dikshitar",
                "citation": "Vidya Vilasini Press, Ettayapuram, 1904; Vol. 1, p. 112.",
                "publication_year": 1904
            }
        ],
        "rights": {
            "status": "public_domain",
            "rights_holder": "Carnatic Musical Heritage / Traditional Knowledge"
        },
        "review_status": "expert_reviewed",
        "reviewer_name": "NadaVerse Editorial Musicology Board",
        "reviewed_at": "2026-10-15"
    },
    {
        "id": "raga-shankarabharanam",
        "slug": "shankarabharanam",
        "canonical_name": "Dheerasankarabharanam",
        "alternate_names": ["Shankarabharanam", "Dheerasankarabharana"],
        "melakarta_number": 29,
        "is_melakarta": True,
        "chakra": "Bana (5th Chakra, 5th Raga)",
        "arohanam": "S R₂ G₃ M₁ P D₂ N₃ Ṡ",
        "avarohanam": "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
        "arohanam_notes": ["Sa", "Chatushruti Rishabham (R2)", "Antara Gandharam (G3)", "Shuddha Madhyamam (M1)", "Panchamam (P)", "Chatushruti Dhaivatam (D2)", "Kakali Nishadam (N3)", "Tara Sa (Ṡ)"],
        "avarohanam_notes": ["Tara Sa (Ṡ)", "Kakali Nishadam (N3)", "Chatushruti Dhaivatam (D2)", "Panchamam (P)", "Shuddha Madhyamam (M1)", "Antara Gandharam (G3)", "Chatushruti Rishabham (R2)", "Sa"],
        "swaras": [
            {"symbol": "S", "full_name": "Shadjam", "frequency_ratio": 1.0, "swarasthana_name": "Adhara Shadjam"},
            {"symbol": "R₂", "full_name": "Chatushruti Rishabham", "frequency_ratio": 9 / 8, "swarasthana_name": "Major tone"},
            {"symbol": "G₃", "full_name": "Antara Gandharam", "frequency_ratio": 5 / 4, "swarasthana_name": "Major third"},
            {"symbol": "M₁", "full_name": "Shuddha Madhyamam", "frequency_ratio": 4 / 3, "swarasthana_name": "Perfect fourth"},
            {"symbol": "P", "full_name": "Panchamam", "frequency_ratio": 3 / 2, "swarasthana_name": "Invariable fifth"},
            {"symbol": "D₂", "full_name": "Chatushruti Dhaivatam", "frequency_ratio": 27 / 16, "swarasthana_name": "Major sixth"},
            {"symbol": "N₃", "full_name": "Kakali Nishadam", "frequency_ratio": 15 / 8, "swarasthana_name": "Major seventh"},
            {"symbol": "Ṡ", "full_name": "Tara Shadjam", "frequency_ratio": 2.0, "swarasthana_name": "Higher tonic"}
        ],
        "characteristic_phrases": ["S R₂ G₃ M₁ P, M₁ G₃ R₂ S", "P D₂ N₃ Ṡ, Ṡ D₂ P M₁ G₃"],
        "mood_and_rasa": "Majestic grandeur, courage (Veera), and devotion.",
        "educational_summary": "Major scale equivalent (Ionian mode) rendered with rich Carnatic kampita gamakas on Gandharam and Nishadam.",
        "historical_context": "Ancient major raga described in Sarangadeva's Sangita Ratnakara.",
        "famous_compositions": [
            {"title": "Akshaya Linga Vibho", "composer": "Muthuswami Dikshitar", "tala": "Misra Chapu", "language": "Sanskrit"},
            {"title": "Swara Raga Sudharasa", "composer": "Saint Tyagaraja", "tala": "Adi", "language": "Telugu"}
        ],
        "sources": [
            {
                "title": "Ragas of South India",
                "author_or_creator": "Walter Kaufmann",
                "citation": "Indiana University Press, pp. 210–218.",
                "publication_year": 1976
            }
        ],
        "rights": {
            "status": "public_domain",
            "rights_holder": "Traditional Knowledge"
        },
        "review_status": "expert_reviewed",
        "reviewer_name": "NadaVerse Editorial Musicology Board",
        "reviewed_at": "2026-10-15"
    }
]

VERIFIED_TALAS_DATA = [
    {
        "id": "tala-adi-tala",
        "slug": "adi-tala",
        "canonical_name": "Adi Tala (Chatusra Jati Triputa Tala)",
        "angas_formula": "I₄ + O + O",
        "total_aksharas": 8,
        "laghu_beats": 4,
        "dhrutam_count": 2,
        "jati": "Chatusra",
        "description": "The paramount rhythmic framework of Carnatic music. 1 Laghu of 4 counts + 2 Dhrutams of 2 counts = 8 aksharas.",
        "beat_actions": [
            {"beat_number": 1, "anga": "Laghu", "action_type": "thattu", "finger_or_motion_label": "Thattu (Palm Clap on lap)", "syllable": "Tha"},
            {"beat_number": 2, "anga": "Laghu", "action_type": "finger_count", "finger_or_motion_label": "Pinky finger tap", "syllable": "Dhi"},
            {"beat_number": 3, "anga": "Laghu", "action_type": "finger_count", "finger_or_motion_label": "Ring finger tap", "syllable": "Thom"},
            {"beat_number": 4, "anga": "Laghu", "action_type": "finger_count", "finger_or_motion_label": "Middle finger tap", "syllable": "Nam"},
            {"beat_number": 5, "anga": "Dhrutam", "action_type": "thattu", "finger_or_motion_label": "Thattu (Palm Clap)", "syllable": "Tha"},
            {"beat_number": 6, "anga": "Dhrutam", "action_type": "veecheduthal", "finger_or_motion_label": "Veechu (Wave)", "syllable": "Ka"},
            {"beat_number": 7, "anga": "Dhrutam", "action_type": "thattu", "finger_or_motion_label": "Thattu (Palm Clap)", "syllable": "Dhi"},
            {"beat_number": 8, "anga": "Dhrutam", "action_type": "veecheduthal", "finger_or_motion_label": "Veechu (Wave)", "syllable": "Mi"}
        ],
        "common_compositions": ["Vatapi Ganapatim", "Endaro Mahanubhavulu"],
        "sources": [
            {
                "title": "Tala Guide: Structure & Practice",
                "author_or_creator": "Madras Music Academy Tala Research Committee",
                "citation": "Journal of the Music Academy Madras, Vol. 48, pp. 78–92.",
                "publication_year": 1977
            }
        ],
        "rights": {
            "status": "public_domain",
            "rights_holder": "Carnatic Traditional Heritage"
        },
        "review_status": "expert_reviewed",
        "reviewer_name": "NadaVerse Laya Advisory",
        "reviewed_at": "2026-10-15"
    }
]

VERIFIED_INSTRUMENTS_DATA = [
    {
        "id": "inst-saraswati-veena",
        "slug": "saraswati-veena",
        "canonical_name": "Saraswati Veena",
        "family": "Chordophone",
        "materials": ["Jackwood", "Beeswax fretboard compound", "Brass frets", "Steel & bronze strings"],
        "playing_technique": "Plucked with right index/middle fingers; left fingers glide across 24 brass frets with lateral string deflection for gamakas.",
        "tuning_system": "Main strings: Low Sa, Pa, Mid Sa, Mid Pa. Tala strings: High Sa, Pa, Higher Sa.",
        "role_in_concert": "The primordial solo melodic string instrument of Carnatic music.",
        "historical_context": "Codified in 17th century Thanjavur by King Raghunatha Nayak and Govinda Dikshitar.",
        "learning_curve_guide": "Demands delicate left-hand string deflection to emulate the gayaki singing voice.",
        "samples": [],
        "sources": [
            {
                "title": "The Veena and Its Technique",
                "author_or_creator": "S. Balachander",
                "citation": "Sangeet Natak Akademi monograph, 1968.",
                "publication_year": 1968
            }
        ],
        "rights": {
            "status": "public_domain",
            "rights_holder": "Carnatic Cultural Heritage"
        },
        "review_status": "expert_reviewed",
        "reviewer_name": "NadaVerse Organology Board",
        "reviewed_at": "2026-10-15"
    }
]
