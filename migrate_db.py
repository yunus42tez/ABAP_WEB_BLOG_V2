from app import app, db
from sqlalchemy import text

with app.app_context():
    print("Veritabanı güncellemesi başlatılıyor...")
    try:
        with db.engine.connect() as conn:
            # 1. category_id sütununu ekle
            print("1. 'category_id' sütunu ekleniyor...")
            conn.execute(text("ALTER TABLE post ADD COLUMN IF NOT EXISTS category_id INTEGER"))
            
            # 2. Foreign Key bağlantısını kur
            print("2. Foreign Key bağlantısı kuruluyor...")
            try:
                conn.execute(text("ALTER TABLE post ADD CONSTRAINT fk_post_category FOREIGN KEY (category_id) REFERENCES category(id)"))
            except Exception as e:
                print(f"Not: Constraint zaten var olabilir veya bir hata oluştu: {e}")

            conn.commit()
            print("✅ Başarılı! Veritabanı şeması güncellendi.")
    except Exception as e:
        print(f"❌ Hata oluştu: {e}")
