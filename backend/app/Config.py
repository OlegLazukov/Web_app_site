import os
from urllib.parse import urlparse # Поможет разобрать DATABASE_URL

# --- Настройки базы данных ---
# DATABASE_URL будет приходить из docker-compose.yml
# Запасной вариант для локальной разработки (если переменная не установлена)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres")

# Парсинг DATABASE_URL для извлечения отдельных компонентов
try:
    # Заменяем 'postgresql+asyncpg' на 'postgresql' для корректного парсинга urlparse
    parsed_url = urlparse(DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://"))
    user = parsed_url.username if parsed_url.username else "postgres"
    password = parsed_url.password if parsed_url.password else "" # Если нет пароля, будет пустая строка
    host = parsed_url.hostname if parsed_url.hostname else "localhost"
    port = parsed_url.port if parsed_url.port else 5432
    database = parsed_url.path.lstrip('/') if parsed_url.path else "postgres"
except Exception as e:
    # Если парсинг по какой-то причине не удался, выводим ошибку и используем запасные значения
    print(f"⚠️ Ошибка при парсинге DATABASE_URL: {e}. Используем запасные значения.")
    user = os.getenv("POSTGRES_USER", "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "") # Если пароля нет
    database = os.getenv("POSTGRES_DB", "postgres")
    host = os.getenv("DATABASE_HOST", "localhost")
    port = int(os.getenv("DATABASE_PORT", 5432))


cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost")
# Разбиваем строку на список и удаляем пробелы
origins = [origin.strip() for origin in cors_origins_str.split(',') if origin.strip()]


lst_address = ['ул. Пушкина, д.68, 4 этаж, офис 419',
               'ул. Чкалова, д.218, 1 этаж, офис 15',
               'ул. Комсомольский проспект, д.88, 2 этаж, офис 202']

lst_contacts = ['Серпухов Владимир Анатольевич, контактный телефон: +79742883943.',
                'Масров Андрей Геннадьевич, контактный телефон: +79953190622.']