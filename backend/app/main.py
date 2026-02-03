import json, os
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Response, Depends, HTTPException
import asyncpg
from typing import AsyncGenerator, List, Union
from app.models import NewsBuilding, Rent, SecondaryMarket, ImageModel, DataUser
from fastapi.staticfiles import StaticFiles
import logging
import app.Config as Config
from async_lru import alru_cache

logging.basicConfig(level=logging.INFO)

# Инициализация пула соединений
async def create_db_pool():
    return await asyncpg.create_pool(
        user=Config.user,
        password=Config.password,
        database=Config.database,
        host=Config.host,
        port=Config.port,
        min_size=1,  # Минимальное количество соединений
        max_size=10,  # Максимальное количество соединений
        max_queries=50000,  # Максимальное количество запросов на соединение
        max_inactive_connection_lifetime=300,  # Время жизни неактивного соединения
        timeout=30,  # Таймаут подключения
        command_timeout=60  # Таймаут выполнения команд
    )

async def get_db_connection(db_pool: asyncpg.Pool = Depends(create_db_pool)) -> AsyncGenerator[asyncpg.Connection, None]:
    async with db_pool.acquire() as connection:
        yield connection

# Функция для преобразования Record в словарь
def record_to_dict(record: asyncpg.Record) -> dict:
    return dict(record)

@alru_cache
async def get_news_building(connection: asyncpg.Connection) -> List[NewsBuilding]:
    data = await connection.fetch("SELECT * FROM news_buildings")
    result_nb = []
    for record in data:
        record_dict = dict(record)  # Преобразуем record в словарь
        record_dict['specifications'] = record_dict['specifications'].replace('\n', '\\n')
        result_nb.append(NewsBuilding(**record_dict))
    return result_nb

@alru_cache
async def get_rent(connection: asyncpg.Connection) -> List[Rent]:
    data = await connection.fetch("SELECT * FROM rent")
    result_rent = []
    for record in data:
        record_dict = dict(record)  # Преобразуем record в словарь
        record_dict['specifications'] = record_dict['specifications'].replace('\n', '\\n')
        result_rent.append(Rent(**record_dict))
    return result_rent

@alru_cache
async def get_secondary_market(connection: asyncpg.Connection) -> List[SecondaryMarket]:
    data = await connection.fetch("SELECT * FROM secondary_market")
    result_sec = []
    for record in data:
        record_dict = dict(record)  # Преобразуем record в словарь
        record_dict['specifications'] = record_dict['specifications'].replace('\n', '\\n')
        result_sec.append(SecondaryMarket(**record_dict))
    return result_sec



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Создание пула соединений
    pool = await create_db_pool()
    # Получение соединения из пула
    yield
    # Закрытие пула соединений при завершении работы приложения
    await pool.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Поднимаемся на два уровня вверх
static_files_path = os.path.join(project_root, "app", "public", "images")

app.mount("/images", StaticFiles(directory=static_files_path), name="images")

@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get('/api/find_flats')
async def get_find_flats(connection: asyncpg.Connection = Depends(get_db_connection)):
    # Получаем данные из базы данных и преобразуем в pydantic модели
    news_buildings = await get_news_building(connection)
    rent = await get_rent(connection)
    secondary_market = await get_secondary_market(connection)
    # Объединяем данные в один список
    all_data: List[Union[NewsBuilding, Rent, SecondaryMarket]] = news_buildings + rent + secondary_market

    # Преобразуем список объектов pydantic в JSON
    json_data = json.dumps([item.model_dump() for item in all_data], default=str, ensure_ascii=False, indent=4)
    headers = {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Expires": "0",
        "Pragma": "no-cache",
        "Access-Control-Allow-Origin": "http://155.212.147.208"
    }
    return Response(content=json_data, media_type="application/json", headers=headers)



@app.get("/api/addresses", response_model=List[str])
async def get_addresses():
    return Config.lst_address

@app.get("/api/contacts", response_model=List[str])
async def get_contacts():
    return Config.lst_contacts


@app.get("/api/find_flats/news_buildings")
async def get_all_news_buildings(connection: asyncpg.Connection = Depends(get_db_connection)):
    news_buildings = await get_news_building(connection)
    json_data = json.dumps([item.model_dump() for item in news_buildings], default=str, ensure_ascii=False, indent=4)
    headers = {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Expires": "0",
        "Pragma": "no-cache",
        "Access-Control-Allow-Origin": "http://155.212.147.208"
    }
    return Response(content=json_data, media_type="application/json", headers=headers)

@app.get("/api/find_flats/rents")
async def get_all_rents(connection: asyncpg.Connection = Depends(get_db_connection)):
    rents = await get_rent(connection)
    json_data = json.dumps([item.model_dump() for item in rents], default=str, ensure_ascii=False, indent=4)
    headers = {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Expires": "0",
        "Pragma": "no-cache",
        "Access-Control-Allow-Origin": "http://155.212.147.208"
    }
    return Response(content=json_data, media_type="application/json", headers=headers)

@app.get("/api/find_flats/secondary_markets")
async def get_all_secondary_markets(connection: asyncpg.Connection = Depends(get_db_connection)):
    secondary_market = await get_secondary_market(connection)
    json_data = json.dumps([item.model_dump() for item in secondary_market], default=str, ensure_ascii=False, indent=4)
    headers = {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Expires": "0",
        "Pragma": "no-cache",
        "Access-Control-Allow-Origin": "http://155.212.147.208"
    }
    return Response(content=json_data, media_type="application/json", headers=headers)


@app.get("/api/find_flats/{uuid}")
async def get_find_flats_by_id(uuid: str, connection: asyncpg.Connection = Depends(get_db_connection)):
    search_functions = [
        get_news_buildings_by_id,
        get_rents_by_id,
        get_secondary_markets_by_id,
    ]
    for search_function in search_functions:
        try:
            flat = await search_function(uuid, connection)
            return flat
        except HTTPException:
            continue

    raise HTTPException(status_code=404, detail="Flats not found")


@app.get("/api/find_flats/news_buildings/{uuid}")
@alru_cache
async def get_news_buildings_by_id(uuid: str, connection: asyncpg.Connection = Depends(get_db_connection)):
    data = await connection.fetchrow("SELECT * FROM news_buildings WHERE id = $1", uuid)
    if data is None:
        raise HTTPException(status_code=404, detail="News building not found")

    record_dict = dict(data)  # Преобразуем record в словарь
    record_dict['specifications'] = record_dict['specifications'].replace('\n', '\\n')
    news_building = NewsBuilding(**record_dict)
    return news_building.model_dump()

@app.get("/api/find_flats/secondary_markets/{uuid}")
@alru_cache
async def get_secondary_markets_by_id(uuid: str, connection: asyncpg.Connection = Depends(get_db_connection)):
    data = await connection.fetchrow("SELECT * FROM secondary_market WHERE id = $1", uuid)
    if data is None:
        raise HTTPException(status_code=404, detail="Secondary_markets not found")

    record_dict = dict(data)  # Преобразуем record в словарь
    record_dict['specifications'] = record_dict['specifications'].replace('\n', '\\n')
    sec_market = SecondaryMarket(**record_dict)
    return sec_market.model_dump()


@app.get("/api/find_flats/rents/{uuid}")
@alru_cache
async def get_rents_by_id(uuid: str, connection: asyncpg.Connection = Depends(get_db_connection)):
    data = await connection.fetchrow("SELECT * FROM rent WHERE id = $1", uuid)
    if data is None:
        raise HTTPException(status_code=404, detail="Rent not found")

    record_dict = dict(data)  # Преобразуем record в словарь
    record_dict['specifications'] = record_dict['specifications'].replace('\n', '\\n')
    rent = Rent(**record_dict)
    return rent.model_dump()

@app.get("/api/data/images", response_model=List[ImageModel])
@alru_cache
async def get_images(
    property_type: str,
    room_count: int,
    connection: asyncpg.Connection = Depends(get_db_connection)
):
    data = await connection.fetch(
        "SELECT id, property_type, room_count, image_url FROM images WHERE property_type = $1 AND room_count = $2",
        property_type, room_count
    )
    if not data:
        raise HTTPException(status_code=404, detail="Data_images not found")

    return [ImageModel(**dict(row)) for row in data]


@app.post("/api/user_data")
async def post_user_data(user_data: DataUser, connection: asyncpg.Connection = Depends(get_db_connection)):
    try:
        email_to_insert = user_data.email if user_data.email else "Почта не указана"
        await connection.execute(
            "INSERT INTO user_data (lastname_user, username, middlename_user, number_user, email) VALUES ($1, $2, $3, $4, $5)",
            user_data.lastname_user.capitalize(),
            user_data.username.capitalize(),
            user_data.middlename_user.capitalize(),
            user_data.number_user,
            email_to_insert)

        return {"message": "Заявка успешно отправлена!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
