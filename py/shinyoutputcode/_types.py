from __future__ import annotations

import os
from dataclasses import KW_ONLY, asdict, dataclass, field
from pathlib import PurePath

import faicons
from htmltools import TagChild

__all__ = ("DataOutputCode",)

COPY_ICON = faicons.icon_svg("clone")


www_path = PurePath(__file__).parent / "www"

HLJS_STYLES = [
    x.split(".")[0]
    for x in os.listdir(www_path / "styles")
    if x.endswith(".css") and os.path.isfile(www_path / "styles" / x)
]
HLJS_STYLES.sort()
HLJS_STYLES_BASE16 = [
    "base16/" + x.split(".")[0]
    for x in os.listdir(www_path / "styles" / "base16")
    if x.endswith(".css") and os.path.isfile(www_path / "styles" / "base16" / x)
]
HLJS_STYLES_BASE16.sort()


@dataclass
class DataOutputCode:
    """
    Return type for :func:`~shinyoutputcode.render_code`.

    Values tha tare not

    See Also
    --------
    ~shinyoutputcode.render_code

    Example
    -------
    See :func:`~shinyoutputcode.render_code`.
    """

    code: str
    """The ``code`` to be displayed."""
    # Require that the remaining fields are keyword-only.
    _: KW_ONLY
    title: TagChild | None = None
    """The title of the code output."""
    language: str | None = "auto"
    """The language of the ``code``."""
    style: str | None = "default"
    """The highlight.js style to be used for highlighting the ``code``."""
    copy_icon: TagChild | None = field(default_factory=lambda: COPY_ICON)
    """The icon to be used within the copy button."""
    copy_label: str | None = "Copy code to clipboard"
    """The label to be used when hovering over the copy button."""


def assert_code_data(x: DataOutputCode) -> DataOutputCode:
    assert isinstance(x, DataOutputCode)

    assert isinstance(x.code, str)
    # assert isinstance(x['title'], (TagChild, type(None)))
    assert isinstance(x.language, (str, type(None)))
    assert isinstance(x.style, (str, type(None)))
    if (
        isinstance(x.style, str)
        and x.style not in HLJS_STYLES
        and x.style not in HLJS_STYLES_BASE16
    ):
        styles: list[str] = []
        styles.extend(HLJS_STYLES)
        styles.extend(HLJS_STYLES_BASE16)
        styles_error = ", ".join(styles)
        raise ValueError(
            f'`DataOutputCode(style=)` (received: `"{x.style}"`) must be one of: {styles_error}'
        )

    # assert isinstance(x['copy_icon'], (TagChild, type(None)))
    assert isinstance(x.copy_label, (str, type(None)))

    return x


def serialize_data_code(x: DataOutputCode) -> dict[str, str | None]:
    assert_code_data(x)
    ret = asdict(x)
    for k, v in ret.items():
        if v is None:
            continue
        # if k == "code":
        #     v = tags.code(HTML(v))
        if not isinstance(v, str):
            ret[k] = str(v)
    return ret
