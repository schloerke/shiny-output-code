import hljs from "highlight.js/lib/common";
// import "highlight.js/styles";
import { LitElement, RenderOptions, css, html } from "lit";
import {
  customElement,
  property,
  queryAssignedElements,
} from "lit/decorators.js";
import {ifDefined} from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

// import { OutputBinding } from "rstudio-shiny/srcts/types/src/bindings";
import type { ErrorsMessageValue } from "rstudio-shiny/srcts/types/src/shiny/shinyapp";

// =============================================================================
// Clipboard setup
// =============================================================================
// navigator.permissions.query({ name: "write-on-clipboard" }).then((result) => {
//   if (result.state == "granted" || result.state == "prompt") {
//     alert("Write access granted!");
//   }
// });

// =============================================================================
// WebComponent definition
// =============================================================================

@customElement("shiny-output-code")
export class OutputCodeElement extends LitElement {
  // @property({ type: String })
  // title: string;

  @property({ type: String })
  code: string | null = null;
  @property({ type: String })
  copyIcon: string | null = null;

  @property({ type: String })
  copyLabel: string | null = null;
  @property({ type: String })
  language: string | false = false;

  // onChangeCallback = (x: boolean) => {};

  // @queryAssignedElements({slot: 'list', selector: '.item'})
  // _listItems!: Array<HTMLElement>;
  get _title(): Element | null {
    // const slot = this.shadowRoot?.querySelector('slot[name="title"]');
    return this.querySelector(":scope > [slot='title']");
    // if (!slot) return null;
    // return (slot as HTMLSlotElement).assignedNodes({ flatten: true });
  }

  get _copyIcon(): Element | null {
    return this.querySelector(":scope > [slot='copy-icon']");
    // const slot = this.querySelector('slot[name="copy-icon"]');
    // if (!slot) return null;
    // return (slot as HTMLSlotElement).assignedNodes({ flatten: true });
  }
  // get _language(): string {
  //   const lang =
  //     this.querySelector(":scope > [slot='code']")?.getAttribute("language") ||
  //     "auto";
  //   return lang == "false" ? "nohighlight" : lang;
  // }
  // get _copyLabel(): string | null {
  //   this._copyIcon?.getAttribute("aria-label");
  //   return this.getAttribute("copy-label");
  // }

  // get _code(): string | null {
  //   return this.querySelector(":scope > [slot='code']")?.textContent || null;
  // }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
  get _formattedCode(): string | null {
    const lang = this.language;
    const code = this.code;
    if (
      lang === false ||
      lang === "false" ||
      lang === "nohighlight" ||
      code === null
    )
      return code;
    if (lang === "auto") {
      return hljs.highlightAuto(code).value;
    }
    return hljs.highlight(code, { language: lang }).value;
  }

  // @queryAssignedNodes({slot: 'header', flatten: true})
  // _headerNodes!: Array<Node>;
  // The examples above are equivalent to the following code:

  // get _listItems() {
  //   const slot = this.shadowRoot.querySelector('slot[name=list]');
  //   return slot.assignedElements().filter((node) => node.matches('.item'));
  // }

  // get _headerNodes() {
  //   const slot = this.shadowRoot.querySelector('slot[name=header]');
  //   return slot.assignedNodes({flatten: true});
  // }

  static styles = css`
    /* input {
      padding: var(--size-2);
      border-radius: var(--radius-2);
      font-size: var(--font-size-1);
    }
    input:invalid {
      outline: var(--border-size-2) solid var(--red-10);
    }
    span {
      display: inline-block;
      font-size: var(--font-size-1);
      font-weight: var(--font-weight-2);
      color: var(--red-6);
      transform: scaleX(0);
      transition: transform 0.3s var(--ease-squish-2);
      transform-origin: left;
    }
    input:invalid + span {
      transform: scaleX(1);
    } */
  `;

  // handleChange(e: InputEvent) {
  //   window.console.log("handleChange", e);
  //   // this.value = clamp(
  //   //   (e.target as HTMLInputElement).valueAsNumber,
  //   //   this.min,
  //   //   this.max
  //   // );

  //   // // Tell the output binding we've changed
  //   // this.onChangeCallback(true);
  // }
  _copytoClipboard() {
    window.console.log("copyToClipboard");
  }

  render() {
    return html`
      <div class="code-extra">
        <header
          class="d-flex flex-items-center flex-justify-between p-2 text-small rounded-top-1 border"
        >
          <slot name="title"></slot
          ><button
            class="js-btn-copy btn btn-sm tooltipped tooltipped-nw"

            data-clipboard-text="${ifDefined(this.code === null ? undefined : this.code)}"
            aria-label="${ifDefined(this.copyLabel)}"
            @click="${this._copytoClipboard}"
          >
            <slot name="copy-icon"></slot>
          </button>
        </header>
        <pre><code>${unsafeHTML(this._formattedCode)}</code></pre>
        <pre><code><slot name="code"></slot></code></pre>
      </div>
    `;

    return html`
      <div class="code-extra">
        <header
          class="d-flex flex-items-center flex-justify-between p-2 text-small rounded-top-1 border"
        >
          <span>${this.title}</span
          ><button
            class="js-btn-copy btn btn-sm tooltipped tooltipped-nw"
            data-clipboard-text="${this._code}"
            aria-label="${this._copyLabel}"
          >
            ${this._copyIcon}
          </button>
        </header>
        <pre><code>${this._code}</code></pre>
      </div>
    `;

    // @click="${this._copyToClipboard}"
    const iconHtml = !this._copyIcon
      ? ""
      : html`
          <button
            class="js-btn-copy btn btn-sm tooltipped tooltipped-nw"
            ${this._code ? 'data-clipboard-text="' + this._code + '"' : ""}
            ${this._copyLabel ? 'aria-label="' + this._copyLabel + '"' : ""}
          >
            ${this._copyIcon}
          </button>
        `;

    const titleHtml = !this._title ? "" : html` <span>${this._title}</span> `;
    const headerHtml = !(titleHtml || iconHtml)
      ? ""
      : html`<header
          class="d-flex flex-items-center flex-justify-between p-2 text-small rounded-top-1 border"
        >
          <span>${this._title}</span>
          ${iconHtml}
          <copy-to-clipboard-button a="b"></copy-to-clipboard-button>
        </header> `;

    const languageClass =
      this._language == "false" ? "nohighlight" : "language-" + this._language;

    const code = this._code ?? "";
    const codeHtml =
      this._language == false
        ? code
        : hljs.highlight(code, { language: this._language }).value;

    return html`
      <div class="code-extra">
        ${headerHtml}
        <pre><code>${codeHtml}</code></pre>
      </div>
    `;
  }

  updated(changedProperties: Map<string, any>) {
    window.console.log("updated", changedProperties);
    if (changedProperties.has("_copyIcon")) {
      window.console.warn("Should update icon info?")
      // popperInstance.update();
    }
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

if (Shiny) {
  // class ExampleNumberInputBinding extends Shiny.InputBinding {

  class OutputCodeBinding extends Shiny["OutputBinding"] {
    constructor() {
      super();
    }

    find(scope: HTMLElement): JQuery<HTMLElement> {
      window.console.log(
        "Finding shiny-output-code elements",
        $(scope).find("shiny-output-code"),
        this.getId($(scope).find("shiny-output-code").get(0)!)
      );
      return $(scope).find("shiny-output-code");
    }

    //   {
    //     "code": get_val(code),
    //     "title": get_val(title),
    //     "copyIcon": get_val(copy_icon),
    //     "language": str(language) if language else None,
    // }

    renderValue(
      el: OutputCodeElement,
      data: {
        code?: string;
        title?: string;
        copy_icon?: string;
        copy_label?: string;
        language?: string;
      } = {}
      // data: string
    ): void {
      window.console.log("OutputCodeBinding.renderValue", el, "data: ", data);
      // el.code = data;
      // el.querySelector(":scope > code")!.textContent = data;
      // el.onChangeCallback(true);

      window.console.log(data.code)

      if (data.code) {
        const codeSlot = el.querySelector(":scope > [slot='code']") as HTMLElement | null
        window.console.log(codeSlot)
        if (!codeSlot) {
          const codeDiv = document.createElement("pre")
          codeDiv.setAttribute("slot", "code")
          el.appendChild(codeDiv)
          codeDiv.innerText = data.code
        } else {
          codeSlot.innerText = data.code
        }
      }
      if (data.title) {
        const titleSlot = el.querySelector(":scope > [slot='title']")
        if (!titleSlot) {
          const titleDiv = document.createElement("div")
          titleDiv.setAttribute("slot", "title")
          el.appendChild(titleDiv)
          titleDiv.innerHTML = data.title
        } else {
          titleSlot.innerHTML = data.title
        }
      }
      if (data.copy_icon) {
        const copyIconSlot = el.querySelector(":scope > [slot='copy-icon']")
        if (!copyIconSlot) {
          const copyIconDiv = document.createElement("div")
          copyIconDiv.setAttribute("slot", "copy-icon")
          el.appendChild(copyIconDiv)
          copyIconDiv.innerHTML = data.copy_icon
        } else {
          copyIconSlot.innerHTML = data.copy_icon
        }
      }
      if (data.copy_label) {
        el.setAttribute("copy-label", data.copy_label)
      }
      if (data.language) {
        el.setAttribute("language", data.language)
      }
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
