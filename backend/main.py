import os
import uuid
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from database import engine, Base, get_db
import models, schemas, auth

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Clothing E-Commerce API", version="1.0.0")

os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Clothing Store API"}

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": "admin" if user.is_admin else "merchant" if user.is_merchant else "customer"}

@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # By default new users are customers unless changed by admin
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/products", response_model=List[schemas.Product])
def get_products(
    db: Session = Depends(get_db), 
    skip: int = 0, 
    limit: int = 100, 
    category: str = None,
    brand: str = None,
    gender_category: str = None,
    sub_category: str = None,
    is_weekly_offer: bool = None
):
    query = db.query(models.Product)
    if category:
        query = query.filter(models.Product.category.ilike(category))
    if brand:
        query = query.filter(models.Product.brand.ilike(brand))
    if gender_category:
        query = query.filter(models.Product.gender_category.ilike(gender_category))
    if sub_category:
        query = query.filter(models.Product.sub_category.ilike(sub_category))
    if is_weekly_offer is not None:
        query = query.filter(models.Product.is_weekly_offer == is_weekly_offer)
        
    products = query.offset(skip).limit(limit).all()
    return products

@app.get("/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/products", response_model=schemas.Product)
async def create_product(
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    brand: str = Form(...),
    discount_percent: int = Form(0),
    gender_category: str = Form(...),
    sub_category: str = Form(...),
    is_weekly_offer: bool = Form(False),
    category: str = Form(...),
    size: str = Form(...),
    color: str = Form(...),
    stock: int = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_merchant)
):
    image_url = None
    if image and image.filename:
        file_extension = image.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"static/uploads/{filename}"
        
        content = await image.read()
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        image_url = f"http://127.0.0.1:8000/{file_path}"

    db_product = models.Product(
        title=title,
        description=description,
        price=price,
        brand=brand,
        discount_percent=discount_percent,
        gender_category=gender_category,
        sub_category=sub_category,
        is_weekly_offer=is_weekly_offer,
        category=category,
        size=size,
        color=color,
        stock=stock,
        image_url=image_url,
        owner_id=current_user.id
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products/me", response_model=List[schemas.Product])
def get_my_products(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_merchant)):
    products = db.query(models.Product).filter(models.Product.owner_id == current_user.id).all()
    return products

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_merchant)):
    product = db.query(models.Product).filter(models.Product.id == product_id, models.Product.owner_id == current_user.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or unauthorized")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

@app.get("/wishlist", response_model=schemas.Wishlist)
def get_wishlist(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    wishlist = db.query(models.Wishlist).filter(models.Wishlist.user_id == current_user.id).first()
    if not wishlist:
        wishlist = models.Wishlist(user_id=current_user.id)
        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)
    return wishlist

@app.post("/wishlist", response_model=schemas.WishlistItem)
def add_to_wishlist(item: schemas.WishlistItemCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    wishlist = db.query(models.Wishlist).filter(models.Wishlist.user_id == current_user.id).first()
    if not wishlist:
        wishlist = models.Wishlist(user_id=current_user.id)
        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)
        
    existing_item = db.query(models.WishlistItem).filter(
        models.WishlistItem.wishlist_id == wishlist.id,
        models.WishlistItem.product_id == item.product_id
    ).first()
    
    if existing_item:
        return existing_item
        
    new_item = models.WishlistItem(wishlist_id=wishlist.id, product_id=item.product_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@app.delete("/wishlist/{product_id}")
def remove_from_wishlist(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    wishlist = db.query(models.Wishlist).filter(models.Wishlist.user_id == current_user.id).first()
    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")
        
    item = db.query(models.WishlistItem).filter(
        models.WishlistItem.wishlist_id == wishlist.id,
        models.WishlistItem.product_id == product_id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not in wishlist")
        
    db.delete(item)
    db.commit()
    return {"message": "Removed from wishlist"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...), current_user: models.User = Depends(auth.get_current_merchant)):
    file_extension = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"static/uploads/{filename}"
    
    content = await file.read()
    with open(file_path, "wb") as buffer:
        buffer.write(content)
        
    return {"url": f"http://127.0.0.1:8000/{file_path}"}

@app.post("/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    total_amount = 0
    db_order_items = []
    
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.title}")
            
        product.stock -= item.quantity
        price_at_purchase = product.price
        total_amount += price_at_purchase * item.quantity
        
        db_order_item = models.OrderItem(
            product_id=product.id,
            quantity=item.quantity,
            price_at_purchase=price_at_purchase
        )
        db_order_items.append(db_order_item)
        
    db_order = models.Order(
        user_id=current_user.id,
        shipping_address=order.shipping_address,
        payment_method=order.payment_method,
        total_amount=total_amount,
        status="Pending" if order.payment_method == "cod" else "Paid"
    )
    
    db.add(db_order)
    db.flush()
    
    for db_item in db_order_items:
        db_item.order_id = db_order.id
        db.add(db_item)
        
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/orders/me", response_model=List[schemas.Order])
def get_my_orders(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).order_by(models.Order.created_at.desc()).all()
    return orders

from fastapi import Request
import hashlib

@app.post("/payu/hash")
async def payu_hash(request: Request):
    data = await request.json()
    key = "XuE4SI"
    salt = "7II2beJnunL27mIZsXjPZA1vkaYuhHno"
    txnid = str(data.get("txnid", ""))
    amount = str(data.get("amount", ""))
    productinfo = str(data.get("productinfo", ""))
    firstname = str(data.get("firstname", ""))
    email = str(data.get("email", ""))
    
    hash_list = [
        key, txnid, amount, productinfo, firstname, email,
        "", "", "", "", "", "", "", "", "", "", salt
    ]
    hashSequence = "|".join(hash_list)
    hashValue = hashlib.sha512(hashSequence.encode('utf-8')).hexdigest()
    return {"hash": hashValue}

from fastapi.responses import RedirectResponse

@app.post("/payu/success")
async def payu_success(request: Request):
    return RedirectResponse(url="http://localhost:5173/?payment=success", status_code=303)

@app.post("/payu/fail")
async def payu_fail(request: Request):
    return RedirectResponse(url="http://localhost:5173/checkout?payment=failed", status_code=303)
