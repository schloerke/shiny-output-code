from __future__ import annotations

from typing import Any, Callable, TypeVar, overload

from htmltools import TagChild
from shiny.render.transformer import (
    TransformerMetadata,
    ValueFn,
    output_transformer,
    resolve_value_fn,
)

from ._types import DataOutputCode, serialize_data_code

__all__ = ("render_code",)


T = TypeVar("T")
CallableFnOrOptionalValue = T | Callable[[], T | None] | None

CallableStr = CallableFnOrOptionalValue[str]
CallableTagChild = CallableFnOrOptionalValue[TagChild]


@output_transformer
async def CodeTransformer(
    _meta: TransformerMetadata,
    _fn: ValueFn[str | DataOutputCode | None],
    # *,
    # title: CallableStr = None,
    # language: CallableStr = "auto",
    # copy_icon: CallableTagChild = COPY_ICON,
    # copy_label: CallableStr = "Copy code to clipboard",
) -> dict[str, Any] | None:
    res = await resolve_value_fn(_fn)
    if res is None:
        return None
    if isinstance(res, str):
        res = DataOutputCode(code=res)

    return serialize_data_code(res)


@overload
def render_code() -> CodeTransformer.OutputRendererDecorator:
    ...


@overload
def render_code(fn: CodeTransformer.ValueFn) -> CodeTransformer.OutputRenderer:
    ...


def render_code(
    fn: CodeTransformer.ValueFn | None = None,
) -> CodeTransformer.OutputRenderer | CodeTransformer.OutputRendererDecorator:
    """
    Reactively render code.

    Parameters
    ----------
    TODO-barret; Adjust params to describe DataOutputCode
    fn
        App render function to return the code. This function should return a `DataOutputCode` object.
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
