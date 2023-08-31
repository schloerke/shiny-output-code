from __future__ import annotations

from typing import TypeVar

T = TypeVar("T")


def drop_none(x: dict[str, T | None]) -> dict[str, T]:
    return {k: v for k, v in x.items() if v is not None}
