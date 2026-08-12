"""Python sample — decorators, async, docstrings, constants, types."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import AsyncIterator, Final

MAX_RETRIES: Final = 3
DEFAULT_TIMEOUT: Final = 30.0


def retry(times: int = MAX_RETRIES):
    """Decorator that retries a coroutine."""

    def wrapper(fn):
        async def inner(*args, **kwargs):
            last_error = None
            for attempt in range(times):
                try:
                    return await fn(*args, **kwargs)
                except TimeoutError as exc:
                    last_error = exc
            raise last_error

        return inner

    return wrapper


@dataclass
class Config:
    host: str
    port: int
    debug: bool = False


class StreamClient:
    """Async stream reader with exponential backoff."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self._connected = False

    @retry(times=2)
    async def connect(self) -> None:
        await asyncio.sleep(0.1)
        self._connected = True

    async def events(self) -> AsyncIterator[dict[str, str]]:
        if not self._connected:
            await self.connect()
        for i in range(5):
            yield {"event": "tick", "index": str(i)}


async def main() -> None:
  client = StreamClient(Config(host="localhost", port=8080, debug=True))
  async for event in client.events():
      print(f"received {event['event']}: {event['index']}")


if __name__ == "__main__":
    asyncio.run(main())
