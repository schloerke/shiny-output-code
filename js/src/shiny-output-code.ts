// TODO-future; This feels like title should be dropped.
// Maybe only the code and copy button should be supported? Ex: https://getbootstrap.com/docs/4.5/components/tooltips/#example-enable-tooltips-everywhere
// Or it should have a title. Ex: https://docs.github.com/en/actions/using-workflows/reusing-workflows#example-reusable-workflow

// TODO-future: Display tooltip on hover of the copy button. Ex: https://getbootstrap.com/docs/4.5/components/tooltips/#example-enable-tooltips-everywhere
// Related: https://stackoverflow.com/questions/61922807/how-to-make-js-tooltips-work-in-shadow-dom

// TODO-future: Including the style tag in each code output is not ideal. If there are N code outputs, then there will be N copies of the style css file (assuming they used the same style name)

import hljs from "highlight.js/lib/common";
import { LitElement, RenderOptions, css, html } from "lit";
import {
  customElement,
  property,
  queryAssignedElements,
} from "lit/decorators.js";
import {ifDefined} from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { currentScriptDir, dirname } from "./utils";

// =============================================================================
// Clipboard setup
// =============================================================================
let can_copy = false;
// `clipboard-write` is not stable yet. https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
navigator.permissions.query({name: "clipboard-write"}).then(result => {
  // Clipboard permissions available
  // alert("Clipboard permissions available")
  can_copy = result.state === "granted" || result.state === "prompt";
});

async function copytoClipboard(txt: string) {
  if (!can_copy) {
    alert("Cannot copy to clipboard");
    return;
  }

  await navigator.clipboard.writeText(txt);
}

// =============================================================================
// WebComponent definition
// =============================================================================

const CODE_TO_HIGHLIGHT_CLASS = "code-to-highlight";
const HTML_DEP_DIR = dirname(currentScriptDir())

@customElement("shiny-output-code")
export class OutputCodeElement extends LitElement {
  // @property({ type: String })
  // title: string;

  @property({ type: String, reflect: true })
  code: string | null = null;

  @property({ type: String, reflect: true })
  copyLabel: string | null = null;

  @property({ type: String, reflect: true })
  language: string | null = null;

  @property({ type: String, reflect: true })
  styleName: string | null = null;

  _hasCopyIcon(): boolean {
    return this.querySelector(":scope > [slot='copy-icon']")?.hasChildNodes() || false;
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
  _formattedCode(): string | null {
    const lang = this.language;
    // const code = this.code;
    const code = this.code
    if (
      lang === null ||
      lang === "nohighlight" ||
      code === null
    )
      return code;
    if (lang === "auto") {
      return hljs.highlightAuto(code).value;
    }
    return hljs.highlight(code, { language: lang }).value;
  }

  _copytoClipboard() {
    if (this.code !== null) {
      copytoClipboard(this.code);
    }
  }

  static styles = css`  `;


  render() {

    // Color theme
    let styleLink = html``
    let styleName = this.styleName || "default"
    styleLink = html`<link rel="stylesheet" href="${HTML_DEP_DIR}/styles/${styleName}.css">`

    // Copy button
    let copy_button = html``
    if (can_copy && this._hasCopyIcon())
      copy_button = html`<button
            class="js-btn-copy btn btn-sm"
            data-clipboard-text="${ifDefined(this.code === null ? undefined : this.code)}"
            aria-label="${ifDefined(this.copyLabel === null ? undefined : this.copyLabel)}"
            data-toggle='tooltip'
            @click="${this._copytoClipboard}"
          >
            <slot name="copy-icon"></slot>
          </button>`

    return html`
      ${styleLink}
      <div class="code-extra">
        <header
          class="d-flex flex-items-center flex-justify-between p-2 text-small rounded-top-1 border"
        >
          <slot name="title"></slot
          >${copy_button}
        </header>
        <pre part="code"><code class="hljs language-${this.language}">${unsafeHTML(this._formattedCode())}</code></pre>
      </div>
      `;
  }

  updated(changedProperties: Map<string, any>) {
    // window.console.log("updated", changedProperties);

    const copy_button = this.shadowRoot!.querySelector("[data-toggle='tooltip']")
    if (copy_button) $(copy_button).tooltip()
    // window.console.log(copy_button)
  }
}

// =============================================================================
// Register Shiny input binding
// =============================================================================

/**
 * A safe Shiny object that reflects we may be in an environment without Shiny
 * e.g. a static quarto document.
 *
 */
const Shiny: typeof window.Shiny | undefined = window.Shiny;

type RenderValueData = {
  code: string | null;
  title: string | null;
  language: string | null;
  style: string | null;
  copy_icon: string | null;
  copy_label: string | null;
}


if (Shiny) {
  class OutputCodeBinding extends Shiny["OutputBinding"] {
    constructor() {
      super();
    }

    find(scope: HTMLElement): JQuery<HTMLElement> {
      return $(scope).find("shiny-output-code");
    }

    renderValue(
      el: OutputCodeElement,
      data: RenderValueData = {code: null, title: null, language: null, style: null, copy_icon: null, copy_label: null, }
    ): void {

      // console.log("renderValue", el, data)

      // Make slots if they don't already exist
      update_slot(el, data, "title", "title")
      update_slot(el, data, "copy_icon", "copy-icon")

      // Update el properties
      update_prop(el, data, "language", "language")
      update_prop(el, data, "copy_label", "copyLabel")
      update_prop(el, data, "style", "styleName")
      update_prop(el, data, "code", "code")
    }
  }
  Shiny.outputBindings.register(new OutputCodeBinding(), "OutputCodeBinding");
}


// =============================================================================
// Utility functions
// =============================================================================
// function clamp(x: number, min: number, max: number): number {
//   return Math.max(Math.min(x, max), min);
// }

// function stringToHtml(x: string | null): HTMLElement | null {
//   if (x === null) return null;
//   const template = document.createElement("template");
//   template.innerHTML = x.trim();
//   return template.content.firstChild as HTMLElement;
// }

// Updates the contents of the child element within el
function set_slot(el: OutputCodeElement, attr_value: string, value: string | null) {
  const attr_key = "slot"
  const child_el_type = "div"
  let childEl = el.querySelector(`:scope > [${attr_key}='${attr_value}']`) as HTMLElement | null;
  if (!childEl) {
    // Child is missing. Create it and set the innerHTML
    childEl = document.createElement(child_el_type)
    childEl.setAttribute(attr_key, attr_value)
    el.appendChild(childEl)
  }
  // Child exists. Set the innerHTML
  childEl.innerHTML = value || ""
}

// Removes the child slot element from el
function remove_slot(el: OutputCodeElement, attr_value: string) {
  const attr_key = "slot"
  const childEl = el.querySelector(`:scope > [${attr_key}='${attr_value}']`) as HTMLElement | null;
  if (childEl) {
    el.removeChild(childEl)
  }
}


// Either updates the child element within el, or removes it if value is null
function update_slot(el: OutputCodeElement, data: RenderValueData, data_key: keyof RenderValueData, attr_value: string) {
  // If the key doesn't exist. Don't touch the child el
  if (!Object.hasOwn(data, data_key)) {
    return
  }
  const value = data[data_key]
  if (value === null) {
    // If the key exists, but is null... Remove the child el
    remove_slot(el, attr_value)
  } else {
    // If the key exists, update the child el
    set_slot(el, attr_value, value)
  }
}

// Updates the property of el
function update_prop(el: OutputCodeElement, data: RenderValueData, data_key: keyof RenderValueData, el_prop: "language" | "copyLabel" | "styleName" | "code") {
  // If the key doesn't exist. Don't touch the attr
  if (!Object.hasOwn(data, data_key)) {
    return
  }
  el[el_prop] = data[data_key]
}
