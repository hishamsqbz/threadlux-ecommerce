from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_merchant: bool
    is_admin: bool

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    brand: str
    discount_percent: int = 0
    gender_category: str
    sub_category: str
    is_weekly_offer: bool = False
    category: str
    size: str
    color: str
    stock: int
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    price_at_purchase: float

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    shipping_address: str
    payment_method: str

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItem] = []

    class Config:
        from_attributes = True

class WishlistItemBase(BaseModel):
    product_id: int

class WishlistItemCreate(WishlistItemBase):
    pass

class WishlistItem(WishlistItemBase):
    id: int
    wishlist_id: int
    product: Product

    class Config:
        from_attributes = True

class WishlistBase(BaseModel):
    pass

class WishlistCreate(WishlistBase):
    pass

class Wishlist(WishlistBase):
    id: int
    user_id: int
    items: List[WishlistItem] = []

    class Config:
        from_attributes = True
