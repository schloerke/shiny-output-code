from __future__ import annotations

from typing import Callable, TypeVar, overload

import faicons
from htmltools import TagChild
from shiny.render.transformer import (
    TransformerMetadata,
    ValueFn,
    output_transformer,
    resolve_value_fn,
)

from ._types import CodeData, assert_code_data
from ._utils import resolve_param

__all__ = ("render_code",)

COPY_ICON = faicons.icon_svg("clone")


T = TypeVar("T")
CallableFnOrOptionalValue = T | Callable[[], T | None] | None

CallableStr = CallableFnOrOptionalValue[str]
CallableTagChild = CallableFnOrOptionalValue[TagChild]


@output_transformer
async def CodeTransformer(
    _meta: TransformerMetadata,
    _fn: ValueFn[str | None],
    *,
    title: CallableStr = None,
    language: CallableStr = "auto",
    copy_icon: CallableTagChild = COPY_ICON,
    copy_label: CallableStr = "Copy code to clipboard",
) -> CodeData | None:
    res = await resolve_value_fn(_fn)
    if res is None:
        return None
    if not isinstance(res, str):  # pyright: ignore[reportUnnecessaryIsInstance]
        raise TypeError(f"Expected str, got {type(res)}")

    # TODO-barret; Q: why does changing title or language not trigger a re-render? I
    # would like to have title, language, copy_icon, and copy_label be reactive.

    res = CodeData(
        code=res,
        title=resolve_param(title),
        language=resolve_param(language),
        copy_icon=str(resolve_param(copy_icon)),
        copy_label=resolve_param(copy_label),
    )

    assert_code_data(res)

    return res


@overload
def render_code(
    *,
    title: CallableStr = None,
    language: CallableStr = "auto",
    copy_icon: CallableTagChild = COPY_ICON,
    copy_label: CallableStr = "Copy code to clipboard",
) -> CodeTransformer.OutputRendererDecorator:
    ...


@overload
def render_code(fn: CodeTransformer.ValueFn) -> CodeTransformer.OutputRenderer:
    ...


def render_code(
    fn: CodeTransformer.ValueFn | None = None,
    *,
    title: CallableStr = None,
    language: CallableStr = "auto",
    copy_icon: CallableTagChild = COPY_ICON,
    copy_label: CallableStr = "Copy code to clipboard",
) -> CodeTransformer.OutputRenderer | CodeTransformer.OutputRendererDecorator:
    """
    Reactively render code.

    Parameters
    ----------
    fn
        App render function to return the code. This function should return a `CodeData` object.
    title
        The title of for code.
    language
        The language of the code. Will default to `"auto"`. To disable highlighting, set to `"false"`.
    copy_icon
        The icon to use for copying the code.
    copy_label
        The label to use to tell the user the code can be copied.

    Notes
    -----
    `title`, `language`, `copy_icon`, and `copy_label` can be reactive.


    Returns
    -------
    :
        A decorator for a function that returns information for a code block.

    Tip
    ----
    This decorator should be applied **before** the ``@output`` decorator. Also, the
    name of the decorated function (or ``@output(id=...)``) should match the ``id`` of a
    `output_code` UI element.

    See Also
    --------
    ~shiny.ui.output_text
    """
    return CodeTransformer(fn)
