from __future__ import annotations

from typing import Optional, TypedDict

from htmltools import TagChild


class CodeData(TypedDict):
    """
    Return type for :func:`~shinyoutputcode.render_code`.

    See Also
    --------
    ~shinyoutputcode.render_code

    Example
    -------
    See :func:`~shinyoutputcode.render_code`.
    """

    code: str
    """The ``code`` to be displayed."""
    title: Optional[TagChild]
    """The title of the code output."""
    language: Optional[str]
    """The language of the ``code``."""
    copy_icon: Optional[TagChild]
    """The icon to be used within the copy button."""
    copy_label: Optional[str]
    """The label to be used when hovering over the copy button."""


def assert_code_data(x: CodeData) -> CodeData:
    assert isinstance(x, dict)

    assert isinstance(x["code"], str)
    # assert isinstance(x['title'], (TagChild, type(None)))
    assert isinstance(x["language"], (str, type(None)))
    # assert isinstance(x['copy_icon'], (TagChild, type(None)))
    assert isinstance(x["copy_label"], (str, type(None)))

    return x
