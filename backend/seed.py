from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def seed_db():
    # Make sure tables are created
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if admin already exists
    admin = db.query(models.User).filter(models.User.email == "admin@threadlux.com").first()
    if not admin:
        print("Creating admin user...")
        admin = models.User(
            name="Super Admin",
            email="admin@threadlux.com",
            hashed_password=get_password_hash("admin123"),
            is_merchant=True,
            is_admin=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

    # Check if products exist
    product_count = db.query(models.Product).count()
    if product_count == 0:
        print("Seeding premium clothing products...")
        products = [
            models.Product(
                title="Cotton Crew Neck T-shirt",
                description="Our perfectly weighted premium cotton crew neck t-shirt. Ideal for layering or standing gracefully alone.",
                price=899.00,
                brand="HRX by Hrithik Roshan",
                discount_percent=55,
                gender_category="Men",
                sub_category="T-Shirts",
                is_weekly_offer=True,
                category="Men",
                size="S, M, L, XL",
                color="White",
                stock=150,
                owner_id=admin.id,
                image_url="http://127.0.0.1:8000/static/uploads/crew.png"
            ),
            models.Product(
                title="Women A-Line Midi Dress",
                description="Flowing silhouette woven with a delicate blend. The staple of our summer collection.",
                price=2499.00,
                brand="DressBerry",
                discount_percent=60,
                gender_category="Women",
                sub_category="Dresses",
                is_weekly_offer=True,
                category="Women",
                size="XS, S, M, L",
                color="Midnight",
                stock=80,
                owner_id=admin.id,
                image_url="http://127.0.0.1:8000/static/uploads/dress.png"
            ),
            models.Product(
                title="Men Slim Fit Casual Shirt",
                description="Breathable structure defining a sharp silhouette. Expertly tailored for casual affairs.",
                price=1499.00,
                brand="Roadster",
                discount_percent=40,
                gender_category="Men",
                sub_category="Shirts",
                is_weekly_offer=False,
                category="Men",
                size="M, L, XL",
                color="Navy",
                stock=120,
                owner_id=admin.id,
                image_url="http://127.0.0.1:8000/static/uploads/blazer.png"
            ),
            models.Product(
                title="High-Waist Wide Leg Trousers",
                description="Classic fit tailored to emphasize form with supreme comfort.",
                price=1999.00,
                brand="Mango",
                discount_percent=30,
                gender_category="Women",
                sub_category="Trousers",
                is_weekly_offer=False,
                category="Women",
                size="S, M, L",
                color="Beige",
                stock=40,
                owner_id=admin.id,
                image_url="http://127.0.0.1:8000/static/uploads/trouser.png"
            ),
            models.Product(
                title="Kids Printed T-Shirt",
                description="Soft, comfy cotton t-shirt with playful prints for everyday wear.",
                price=599.00,
                brand="Gini and Jony",
                discount_percent=20,
                gender_category="Kids",
                sub_category="T-Shirts",
                is_weekly_offer=False,
                category="Kids",
                size="4Y, 6Y, 8Y",
                color="Yellow",
                stock=60,
                owner_id=admin.id,
                image_url=None
            )
        ]
        db.bulk_save_objects(products)
        db.commit()
        print("Database seeded successfully!")
    else:
        print("Database already contains data. Skipped seeding.")

    db.close()

if __name__ == "__main__":
    seed_db()
