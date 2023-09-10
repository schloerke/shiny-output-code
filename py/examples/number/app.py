# pyright: reportUnusedFunction=false

from shiny import App, Inputs, Outputs, Session, reactive, ui
from shinyoutputcode import DataOutputCode, output_code, render_code

app_ui = ui.page_fluid(
    ui.h5("Code Output Example"),
    ui.input_radio_buttons("language", "Language", ["python", "R"], selected="python"),
    ui.input_text_area("txt", "Code", value="1 + 1"),
    ui.h3("Default settings: (bad language detection)"),
    output_code("code_simple"),
    ui.h3(ui.code("None"), " values:"),
    output_code("code_none"),
    ui.h3(ui.code("tokyo-night-dark"), ":"),
    output_code("code_custom"),
    ui.h3(ui.code("base16/silk-light"), ":"),
    output_code("code_base16"),
)


def server(input: Inputs, output: Outputs, session: Session):
    @reactive.Calc
    def is_python():
        return input.language() == "python"

    @reactive.Calc
    def code_w_extra():
        comment = f"# { input.language() }"
        extra_code = "[1, 2, 3]" if is_python() else "c(1, 2, 3)"
        return "\n".join([comment, extra_code, "", input.txt()])

    @output
    @render_code
    def code_simple():
        return code_w_extra()

    @output
    @render_code
    def code_none():
        return DataOutputCode(
            code_w_extra(),
            language=None,
            copy_icon=None,
            title=None,
            style=None,
        )

    @output
    @render_code
    def code_custom():
        language_val = input.language()
        icon = "🎉" if is_python() else "🎊"
        title = f"{language_val} Title"

        return DataOutputCode(
            code_w_extra(),
            style="tokyo-night-dark",
            title=title,
            copy_icon=icon,
            language=language_val,
        )

    @output
    @render_code
    def code_base16():
        return DataOutputCode(
            code_w_extra(),
            style="base16/silk-light",
            title=f"{input.language()} Title",
            copy_icon="🎉" if is_python() else "🎊",
            language=input.language(),
        )


app = App(app_ui, server, debug=True)
