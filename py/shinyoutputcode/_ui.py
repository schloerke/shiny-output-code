from __future__ import annotations

from pathlib import PurePath

from htmltools import HTMLDependency, Tag, TagAttrs, TagAttrValue, TagChild

from . import __version__

__all__ = ("output_code",)


def output_code(
    id: str,
    *args: TagAttrs,
    **kwargs: TagAttrValue,
) -> Tag:
    """
    Create a <shiny-output-code> tag.

    A WebComponent for creating code that can be copied and have a title.

    Parameters
    ----------
    id
        The id of the tag.

    Returns
    -------
    :
        Tag

    See Also
    --------
    ~htmltools.Tag
    """

    return tag_shiny_output_code(
        {"id": id},
        *args,
        **kwargs,
    )


def _component_dep() -> HTMLDependency:
    www_path = str(PurePath(__file__).parent / "www")

    return HTMLDependency(
        name="shinyoutputcode",
        version=__version__,
        source={
            "package": "shinyoutputcode",
            "subdir": www_path,
        },
        stylesheet={"href": "open-props.min.css"},
        script=[
            {
                "src": "shiny-output-code.min.js",
                "type": "module",
            },
        ],
    )


def tag_shiny_output_code(*args: TagChild | TagAttrs, **kwargs: TagAttrValue) -> Tag:
    return Tag("shiny-output-code", _component_dep(), *args, _add_ws=False, **kwargs)
