# pyright: reportUnusedFunction=false

from shiny import App, Inputs, Outputs, Session, reactive, render, ui
from shinyoutputcode import output_code, render_code

app_ui = ui.page_fluid(
    ui.h5("Text Input"),
    "Language: ",
    ui.input_switch("sw", "R", value=False),
    # ui.input_action_button("btn", "Set Code"),
    ui.input_text_area("txt", "my label", value="1 + 1"),
    ui.output_text_verbatim("txt_out"),
    output_code("code"),
)


def server(input: Inputs, output: Outputs, session: Session):
    @output
    @render.text
    def txt_out():
        return f"{input.txt()}"

    @reactive.Effect
    def _():
        ui.update_switch("sw", label=language())

    @reactive.Calc
    def language() -> str:
        if input.sw():
            return "python"
        else:
            return "R"

    @reactive.Calc
    def copy_icon():
        if input.sw():
            return "🎉"
        else:
            return "🎊"

    @reactive.Calc
    def title():
        f"{language()} Title"

    @output
    @render_code(title=title, language=language)
    def code():
        return f"[1, 2, 3]\n{input.txt()}"


app = App(app_ui, server, debug=True)
