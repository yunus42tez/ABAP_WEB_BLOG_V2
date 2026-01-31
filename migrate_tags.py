from app import app, db
from sqlalchemy import text

with app.app_context():
    print("Veritabanı güncellemesi başlatılıyor (Tags)...")
    try:
        with db.engine.connect() as conn:
            # 1. Tag tablosunu oluştur
            print("1. 'tag' tablosu oluşturuluyor...")
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS tag (
                    id INTEGER PRIMARY KEY,
                    name VARCHAR(50) NOT NULL UNIQUE
                )
            """))
            
            # 2. Post-Tag ilişki tablosunu oluştur
            print("2. 'post_tags' ilişki tablosu oluşturuluyor...")
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS post_tags (
                    post_id INTEGER NOT NULL,
                    tag_id INTEGER NOT NULL,
                    PRIMARY KEY (post_id, tag_id),
                    FOREIGN KEY(post_id) REFERENCES post(id),
                    FOREIGN KEY(tag_id) REFERENCES tag(id)
                )
            """))

            conn.commit()
            print("✅ Başarılı! Veritabanı şeması güncellendi.")
    except Exception as e:
        print(f"❌ Hata oluştu: {e}")
