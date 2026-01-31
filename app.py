# ==========================
# 🔧 Standard Library Imports
# ==========================
import os
import re
from datetime import datetime, timedelta
from io import BytesIO
import json
import base64
from math import ceil

import requests
from docx import Document
from docx.shared import Inches
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from sqlalchemy import or_, and_

# ==========================
# 🧩 Third-Party Imports
# ==========================
from flask import (Flask, Response, flash, redirect, render_template, request,
                   send_from_directory, session, url_for, jsonify)
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Configure Flask to serve static files from the React build directory
app = Flask(__name__, static_folder='frontend/dist/assets', template_folder='templates')
CORS(app)

load_dotenv()

app.secret_key = os.getenv("SECRET_KEY", "dev_key")
ADMIN_ID = os.getenv("ADMIN_ID")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

# Database Config
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///blog.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# -------------------------------
# MODELS
# -------------------------------

# Association Table for Many-to-Many relationship between Post and Tag
post_tags = db.Table('post_tags',
    db.Column('post_id', db.Integer, db.ForeignKey('post.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True)
)

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    def __repr__(self):
        return f"<Tag {self.name}>"

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=True)
    
    # Relationship
    posts = db.relationship('Post', backref='category', lazy=True)

    def __repr__(self):
        return f"<Category {self.name}>"

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    views = db.Column(db.Integer, default=0)
    
    # Foreign Key
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)
    
    # Many-to-Many Relationship
    tags = db.relationship('Tag', secondary=post_tags, lazy='subquery',
        backref=db.backref('posts', lazy=True))

    def __repr__(self):
        return f"<Post {self.title}>"

with app.app_context():
    db.create_all()
    
    # Create default category if none exists
    if not Category.query.first():
        default_cat = Category(name="General", description="General topics")
        db.session.add(default_cat)
        db.session.commit()

# -------------------------------
# ADMIN ROUTES
# -------------------------------
@app.route("/zytez-login", methods=["GET", "POST"])
def zytez_login():
    if request.method == "POST":
        user_id = request.form.get("user_id")
        password = request.form.get("password")
        app.permanent_session_lifetime = timedelta(minutes=30)
        session.permanent = True

        if user_id == ADMIN_ID and password == ADMIN_PASSWORD:
            session["is_admin"] = True
            flash("✅ Giriş başarılı!", "success")
            return redirect(url_for("zytez"))
        else:
            flash("❌ Hatalı ID veya şifre!", "error")
            return redirect(url_for("zytez_login"))

    return render_template("zytez_login.html")

@app.route("/zytez")
def zytez():
    if not session.get("is_admin"):
        flash("🔒 Lütfen giriş yapın!", "warning")
        return redirect(url_for("zytez_login"))
    
    categories = Category.query.all()
    tags = Tag.query.all() # Fetch all tags for the checkbox list
    return render_template("zytez.html", categories=categories, tags=tags)

@app.route("/zytez/add", methods=["POST"])
def zytez_add_post():
    if not session.get("is_admin"):
        flash("🔒 Giriş yapmanız gerekiyor!", "warning")
        return redirect(url_for("zytez_login"))

    title = request.form.get("title")
    content = request.form.get("content")
    category_id = request.form.get("category_id")
    
    # Get list of selected tag IDs from checkboxes
    selected_tag_ids = request.form.getlist("tags") 

    if not title or not content:
        flash("⚠️ Başlık ve içerik boş olamaz!", "error")
        return redirect(url_for("zytez"))

    new_post = Post(title=title, content=content, category_id=category_id)

    # Handle Tags
    for tag_id in selected_tag_ids:
        tag = Tag.query.get(int(tag_id))
        if tag:
            new_post.tags.append(tag)

    db.session.add(new_post)
    db.session.commit()
    flash("✅ Yeni yazı eklendi!", "success")

    return redirect(url_for("zytez"))

@app.route("/zytez/add-category", methods=["POST"])
def zytez_add_category():
    if not session.get("is_admin"):
        flash("🔒 Giriş yapmanız gerekiyor!", "warning")
        return redirect(url_for("zytez_login"))

    name = request.form.get("name")
    description = request.form.get("description")

    if not name:
        flash("⚠️ Kategori adı boş olamaz!", "error")
        return redirect(url_for("zytez"))
        
    if Category.query.filter_by(name=name).first():
        flash("⚠️ Bu kategori zaten var!", "error")
        return redirect(url_for("zytez"))

    new_cat = Category(name=name, description=description)
    db.session.add(new_cat)
    db.session.commit()
    flash("✅ Yeni kategori eklendi!", "success")

    return redirect(url_for("zytez"))

@app.route("/zytez/add-tag", methods=["POST"])
def zytez_add_tag():
    """Admin panelinden yeni sabit etiket ekleme"""
    if not session.get("is_admin"):
        flash("🔒 Giriş yapmanız gerekiyor!", "warning")
        return redirect(url_for("zytez_login"))

    name = request.form.get("name")

    if not name:
        flash("⚠️ Etiket adı boş olamaz!", "error")
        return redirect(url_for("zytez"))
        
    if Tag.query.filter_by(name=name).first():
        flash("⚠️ Bu etiket zaten var!", "error")
        return redirect(url_for("zytez"))

    new_tag = Tag(name=name)
    db.session.add(new_tag)
    db.session.commit()
    flash("✅ Yeni etiket eklendi!", "success")

    return redirect(url_for("zytez"))

@app.route("/zytez/delete", methods=["POST"])
def zytez_delete_post():
    if not session.get("is_admin"):
        flash("🔒 Giriş yapmanız gerekiyor!", "warning")
        return redirect(url_for("zytez_login"))

    title = request.form.get("title")

    if not title:
        flash("⚠️ Başlık boş olamaz!", "error")
        return redirect(url_for("zytez"))

    post = Post.query.filter_by(title=title).first()

    if not post:
        flash("❌ Bu başlığa sahip bir yazı bulunamadı!", "error")
    else:
        db.session.delete(post)
        db.session.commit()
        flash(f"🗑️ '{title}' başlıklı yazı silindi.", "success")

    return redirect(url_for("zytez"))

# -------------------------------
# API ROUTES
# -------------------------------
@app.route("/api/posts")
def api_posts():
    try:
        category_slug = request.args.get('category')
        search_query = request.args.get('q')
        
        query = Post.query
        
        if category_slug:
            clean_name = category_slug.replace('-', ' ')
            category = Category.query.filter(Category.name.ilike(clean_name)).first()
            if category:
                query = query.filter_by(category_id=category.id)
            else:
                return jsonify([])
        
        if search_query:
            # 1. Başlıkta Kısmi Eşleşme (LIKE %query%)
            title_match = Post.title.ilike(f"%{search_query}%")
            
            # 2. İçerikte Tam Kelime Eşleşmesi (Regex veya LIKE ile boşluklu kontrol)
            # SQLite'da REGEX desteği sınırlı olabilir, bu yüzden Python tarafında filtreleme yapmak daha güvenli olabilir
            # Ancak performans için önce geniş bir filtreleme yapıp sonra Python'da eleyebiliriz.
            # Veya basitçe LIKE kullanarak kelimenin başında ve sonunda boşluk/noktalama arayabiliriz.
            # Şimdilik basitlik ve uyumluluk için LIKE kullanıyoruz ama "kelime" mantığına yaklaşıyoruz.
            
            # Not: Tam kelime eşleşmesi veritabanı seviyesinde zordur (özellikle SQLite ile).
            # En iyi yöntem: İçeriği çekip Python'da regex ile kontrol etmektir.
            
            # Önce potansiyel adayları çekelim (Başlıkta VEYA İçerikte geçenler)
            candidates = query.filter(
                (Post.title.ilike(f"%{search_query}%")) | 
                (Post.content.ilike(f"%{search_query}%"))
            ).order_by(Post.date_posted.desc()).all()
            
            final_posts = []
            for p in candidates:
                # Başlıkta varsa direkt ekle
                if search_query.lower() in p.title.lower():
                    final_posts.append(p)
                    continue
                
                # İçerikte varsa, tam kelime kontrolü yap
                # HTML taglerini temizle
                soup = BeautifulSoup(p.content, 'html.parser')
                text_content = soup.get_text()
                
                # Regex ile tam kelime araması (case-insensitive)
                # \b kelime sınırı demektir.
                if re.search(r'\b' + re.escape(search_query) + r'\b', text_content, re.IGNORECASE):
                    final_posts.append(p)
            
            posts = final_posts
        else:
            posts = query.order_by(Post.date_posted.desc()).all()
        
        data = []
        for p in posts:
            soup = BeautifulSoup(p.content, 'html.parser')
            text = soup.get_text()
            excerpt = text[:200] + "..." if len(text) > 200 else text
            
            cat_name = p.category.name if p.category else "Uncategorized"
            tag_names = [t.name for t in p.tags]
            
            data.append({
                "id": str(p.id),
                "title": p.title,
                "excerpt": excerpt,
                "date": p.date_posted.strftime("%B %d, %Y"),
                "author": "Yunus Tez",
                "tags": tag_names,
                "category": cat_name
            })
        return jsonify(data)
    except Exception as e:
        print(f"Error fetching posts: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/posts/<int:id>")
def api_post_detail(id):
    try:
        p = Post.query.get_or_404(id)
        p.views += 1
        db.session.commit()
        
        cat_name = p.category.name if p.category else "Uncategorized"
        tag_names = [t.name for t in p.tags]
        
        return jsonify({
            "id": str(p.id),
            "title": p.title,
            "content": p.content,
            "date": p.date_posted.strftime("%B %d, %Y"),
            "author": "Yunus Tez",
            "tags": tag_names,
            "category": cat_name
        })
    except Exception as e:
        print(f"Error fetching post detail: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/categories")
def api_categories():
    try:
        categories = Category.query.all()
        data = []
        for c in categories:
            post_count = Post.query.filter_by(category_id=c.id).count()
            data.append({
                "id": str(c.id),
                "name": c.name,
                "description": c.description or "",
                "count": post_count,
                "color": "#0A6ED1"
            })
        return jsonify(data)
    except Exception as e:
        print(f"Error fetching categories: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/tags")
def api_tags():
    try:
        tags = Tag.query.all()
        data = [t.name for t in tags]
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# FRONTEND SERVING
# -------------------------------
@app.route("/assets/<path:filename>")
def serve_assets(filename):
    return send_from_directory('frontend/dist/assets', filename)

@app.route("/robots.txt")
def robots():
    return send_from_directory('frontend/dist', 'robots.txt')

@app.route("/sitemap.xml", methods=["GET"])
def sitemap():
    try:
        posts = Post.query.order_by(Post.date_posted.desc()).all()
        base_url = "https://ytez-abap-blog.onrender.com"
        lastmod = posts[0].date_posted if posts else datetime.utcnow()
        xml = render_template("sitemap.xml", posts=posts, base_url=base_url, lastmod=lastmod)
        return Response(xml, mimetype="application/xml")
    except Exception:
        return "Sitemap not available", 404

@app.route("/", defaults={'path': ''})
@app.route("/<path:path>")
def serve_react_app(path):
    if path.startswith("zytez") or path.startswith("api"):
        return "Not Found", 404
        
    if path and os.path.exists(os.path.join('frontend/dist', path)):
        return send_from_directory('frontend/dist', path)
    
    return send_from_directory('frontend/dist', 'index.html')

# -------------------------------
# UTILS
# -------------------------------
@app.route('/backup')
def backup():
    posts = Post.query.order_by(Post.date_posted.desc()).all()
    doc = Document()
    doc.add_heading('📚 Blog Yedek Raporu', 0)

    for post in posts:
        doc.add_heading(post.title, level=1)
        doc.add_paragraph(f"Tarih: {post.date_posted.strftime('%Y-%m-%d %H:%M')}")
        doc.add_paragraph('')

        soup = BeautifulSoup(post.content, 'html.parser')
        for element in soup.find_all(['p', 'img']):
            if element.name == 'p':
                text = element.get_text(strip=True)
                if text:
                    doc.add_paragraph(text)
            elif element.name == 'img':
                src = element.get('src')
                if not src: continue
                if src.startswith('data:image'):
                    try:
                        header, data = src.split(',', 1)
                        data = data.replace('\n', '')
                        image_data = base64.b64decode(data)
                        doc.add_picture(BytesIO(image_data), width=Inches(4))
                    except Exception as e:
                        doc.add_paragraph(f"[Görsel çözülemedi: {e}]")
                elif src.startswith('http'):
                    try:
                        img_data = requests.get(src, timeout=10).content
                        doc.add_picture(BytesIO(img_data), width=Inches(4))
                    except Exception as e:
                        doc.add_paragraph(f"[Görsel indirilemedi: {src}]")
        doc.add_page_break()

    output = BytesIO()
    doc.save(output)
    output.seek(0)

    return Response(
        output,
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=blog_backup.docx"}
    )

@app.route("/dump")
def dump_db():
    posts = Post.query.all()
    categories = Category.query.all()
    tags = Tag.query.all()
    
    data = {
        "categories": [
            {"id": c.id, "name": c.name, "description": c.description}
            for c in categories
        ],
        "tags": [
            {"id": t.id, "name": t.name} for t in tags
        ],
        "posts": [
            {
                "id": p.id,
                "title": p.title,
                "content": p.content,
                "views": p.views,
                "date_posted": p.date_posted.strftime("%Y-%m-%d"),
                "category_id": p.category_id,
                "tags": [t.name for t in p.tags]
            }
            for p in posts
        ]
    }
    return Response(
        json.dumps(data, ensure_ascii=False, indent=4),
        mimetype="application/json",
        headers={"Content-Disposition": "attachment;filename=db_dump.json"}
    )

@app.route("/update", methods=["POST"])
def update_db():
    file = request.files.get("dumpfile")
    if not file: return "Dosya bulunamadı", 400
    try: data = json.load(file)
    except: return "JSON formatı hatalı!", 400

    # Clear existing data
    db.session.execute(post_tags.delete()) # Clear association table
    Post.query.delete()
    Category.query.delete()
    Tag.query.delete()
    db.session.commit()

    # Restore categories
    for c in data.get("categories", []):
        new_cat = Category(id=c.get("id"), name=c.get("name"), description=c.get("description"))
        db.session.add(new_cat)
    
    # Restore tags
    for t in data.get("tags", []):
        new_tag = Tag(id=t.get("id"), name=t.get("name"))
        db.session.add(new_tag)
        
    db.session.commit()

    # Restore posts
    for p in data.get("posts", []):
        new_post = Post(
            id=p.get("id"),
            title=p.get("title"),
            content=p.get("content"),
            views=p.get("views", 0),
            date_posted = datetime.strptime(p.get("date_posted"), "%Y-%m-%d"),
            category_id=p.get("category_id")
        )
        
        # Link tags
        if "tags" in p:
            for t_name in p["tags"]:
                tag = Tag.query.filter_by(name=t_name).first()
                if tag:
                    new_post.tags.append(tag)

        db.session.add(new_post)
    db.session.commit()
    return "DB başarıyla güncellendi!"

@app.route("/logout")
def logout():
    session.pop("is_admin", None)
    flash("👋 Oturum kapatıldı.", "info")
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)