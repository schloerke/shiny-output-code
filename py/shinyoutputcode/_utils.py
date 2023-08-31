from __future__ import annotations

from typing import Callable, TypeVar

from shiny.render.transformer import is_async_callable

T = TypeVar("T")


def drop_none(x: dict[str, T | None]) -> dict[str, T]:
    return {k: v for k, v in x.items() if v is not None}


R = TypeVar("R")


def resolve_param(x: Callable[[], R] | R) -> R:
    if callable(x):
        if is_async_callable(x):
            raise TypeError("Only allowed to resolve synchronous functions.")
        return x()
    return x
