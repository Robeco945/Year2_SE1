from fastapi.testclient import TestClient

import models


def seed_i18n_data(db):
    key_app_brand = models.I18nKey(key_name="app.brand")
    key_auth_signin = models.I18nKey(key_name="auth.signIn")
    key_message_send = models.I18nKey(key_name="message.send")
    db.add_all([key_app_brand, key_auth_signin, key_message_send])
    db.flush()

    db.add_all([
        models.I18nTranslation(i18n_key_id=key_app_brand.i18n_key_id, locale="en", translation_text="ChatApp"),
        models.I18nTranslation(i18n_key_id=key_auth_signin.i18n_key_id, locale="en", translation_text="Sign in"),
        models.I18nTranslation(i18n_key_id=key_message_send.i18n_key_id, locale="en", translation_text="Send"),
        models.I18nTranslation(i18n_key_id=key_app_brand.i18n_key_id, locale="ar", translation_text="تطبيق الدردشة"),
        models.I18nTranslation(i18n_key_id=key_auth_signin.i18n_key_id, locale="ar", translation_text="تسجيل الدخول"),
        # Intentionally missing message.send in Arabic to validate fallback.
        models.I18nTranslation(i18n_key_id=key_app_brand.i18n_key_id, locale="ja", translation_text="チャットアプリ"),
        models.I18nTranslation(i18n_key_id=key_auth_signin.i18n_key_id, locale="ja", translation_text="サインイン"),
        models.I18nTranslation(i18n_key_id=key_message_send.i18n_key_id, locale="ja", translation_text="送信"),
    ])
    db.commit()



def test_i18n_get_translations_for_locale(client: TestClient, db):
    seed_i18n_data(db)

    response = client.get("/api/i18n/translations?locale=ja")
    assert response.status_code == 200

    payload = response.json()
    assert payload["locale"] == "ja"
    assert payload["fallback_locale"] == "en"
    assert payload["translations"]["app.brand"] == "チャットアプリ"
    assert payload["translations"]["auth.signIn"] == "サインイン"
    assert payload["translations"]["message.send"] == "送信"



def test_i18n_fallback_to_en_per_key(client: TestClient, db):
    seed_i18n_data(db)

    response = client.get("/api/i18n/translations?locale=ar")
    assert response.status_code == 200

    payload = response.json()
    assert payload["translations"]["app.brand"] == "تطبيق الدردشة"
    assert payload["translations"]["auth.signIn"] == "تسجيل الدخول"
    assert payload["translations"]["message.send"] == "Send"



def test_i18n_unsupported_locale_falls_back_to_en(client: TestClient, db):
    seed_i18n_data(db)

    response = client.get("/api/i18n/translations?locale=fr")
    assert response.status_code == 200

    payload = response.json()
    assert payload["locale"] == "en"
    assert payload["translations"]["app.brand"] == "ChatApp"



def test_i18n_key_filter(client: TestClient, db):
    seed_i18n_data(db)

    response = client.get("/api/i18n/translations?locale=ja&keys=app.brand&keys=message.send")
    assert response.status_code == 200

    payload = response.json()
    assert payload["translations"] == {
        "app.brand": "チャットアプリ",
        "message.send": "送信",
    }
