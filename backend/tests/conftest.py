import sys
from pathlib import Path
import pytest
import asyncio

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.db.session import engine, Base


@pytest.fixture(autouse=True, scope="session")
def initialize_database():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    async def _init_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    loop.run_until_complete(_init_tables())
    yield
    # Cleanup after session
    async def _drop_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    loop.run_until_complete(_drop_tables())
    loop.close()
