"""The natural key that makes loads idempotent.

Why a hash and not the URL
--------------------------
The warehouse has to accept rows from two sources: the original 2021 CSV
export, which has no article URL at all, and fresh scrapes, which do. Keying
on the URL would make the same article arrive twice — once from history, once
from the crawler.

``article_id`` is therefore derived from the content that identifies an
article regardless of where it came from: publication date, artist, and
album. It is a SHA-1 over those three normalised fields, so the same article
always produces the same id, on any machine, in any order. That is what lets
``INSERT ... ON CONFLICT (article_id) DO UPDATE`` be safely re-run: a refresh
that overlaps yesterday's run updates rows instead of duplicating them.

The article URL is still stored — it is the link the dashboard and web app
send people to — it just isn't the key.
"""
from __future__ import annotations

import hashlib
import re

import pandas as pd

ID_LENGTH = 16


def _normalise_key_part(value) -> str:
    """Lowercase, strip punctuation and collapse whitespace.

    Keeps the id stable against cosmetic differences ("Bjork" vs "Björk " vs
    "bjork") that would otherwise mint a second id for the same article.
    """
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return ""
    text = str(value).strip().lower()
    text = re.sub(r"[^\w\s]", "", text, flags=re.UNICODE)
    return re.sub(r"\s+", " ", text).strip()


def make_article_id(published_date, artist, album) -> str | None:
    """Return the deterministic id for one article, or None if unidentifiable."""
    parts = [_normalise_key_part(published_date),
             _normalise_key_part(artist),
             _normalise_key_part(album)]
    if not any(parts):
        return None
    digest = hashlib.sha1("|".join(parts).encode("utf-8")).hexdigest()
    return digest[:ID_LENGTH]


def add_article_id(df: pd.DataFrame) -> pd.DataFrame:
    """Add the ``article_id`` column derived from date, artist and album."""
    out = df.copy()
    out["article_id"] = [
        make_article_id(date, artist, album)
        for date, artist, album in zip(
            out["published_date"], out["artist"], out["album"], strict=True
        )
    ]
    return out
