from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/i18n", tags=["i18n"])

FALLBACK_LOCALE = "en"
SUPPORTED_LOCALES = {"en", "ar", "ja"}


def _get_locale_map(db: Session, locale: str, keys_filter: set[str] | None = None) -> dict[str, str]:
    query = (
        db.query(models.I18nKey.key_name, models.I18nTranslation.translation_text)
        .join(models.I18nTranslation, models.I18nTranslation.i18n_key_id == models.I18nKey.i18n_key_id)
        .filter(models.I18nTranslation.locale == locale)
    )

    if keys_filter:
        query = query.filter(models.I18nKey.key_name.in_(keys_filter))

    return {key_name: text for key_name, text in query.all()}


@router.get("/translations", response_model=schemas.I18nTranslationsResponse)
def get_translations(
    locale: str = Query(default=FALLBACK_LOCALE),
    keys: list[str] | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Return key-value UI translations for the requested locale with fallback to English per missing key."""
    locale = locale.lower()
    if locale not in SUPPORTED_LOCALES:
        locale = FALLBACK_LOCALE

    keys_filter = set(keys) if keys else None
    fallback_map = _get_locale_map(db, FALLBACK_LOCALE, keys_filter)
    requested_map = _get_locale_map(db, locale, keys_filter)

    merged = {**fallback_map, **requested_map}
    return {
        "locale": locale,
        "fallback_locale": FALLBACK_LOCALE,
        "translations": merged,
    }
