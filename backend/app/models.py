from typing import Optional

from pydantic import BaseModel, UUID4, constr, NonNegativeFloat



class ImageModel(BaseModel):
    id: int
    property_type: str
    room_count: int
    image_url: str



class FlatModels(BaseModel):
    id: UUID4




# Модели данных pydantic
class NewsBuilding(FlatModels):
    location: constr(min_length=1)  # Минимум 1 символ
    square: NonNegativeFloat
    price: NonNegativeFloat
    specifications: str
    link_photo: str
    room_count: str
    property_type: str

class Rent(FlatModels):
    location: constr(min_length=1)  # Минимум 1 символ
    square: NonNegativeFloat
    price: NonNegativeFloat
    specifications: str
    link_photo: str
    room_count: str
    property_type: str

class SecondaryMarket(FlatModels):
    location: constr(min_length=1)  # Минимум 1 символ
    square: NonNegativeFloat
    price: NonNegativeFloat
    specifications: str
    link_photo: str
    room_count: str
    property_type: str


class DataUser(BaseModel):
    id: Optional[int] = None
    lastname_user: str
    username: str
    middlename_user: str
    number_user: str
    email: Optional[str] = None
