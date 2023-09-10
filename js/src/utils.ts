

export function dirname(path: string) {
  if (path === "/" || path === "") {
    return "";
  }
  return path.replace(/[/]?[^/]+[/]?$/, "");
}

export function basename(path: string) {
  return path.replace(/.*\//, "");
}

// Get the path to the current script, when used in a JS module. Note: for
// non-modules, something similar could be done by combining window.location.pathname
// and document.currentScript.
export function currentScriptPath(): string {
  return new URL(import.meta.url).pathname;
}

// Get the directory containing the current script, when used in a JS module.
export function currentScriptDir(): string {
  return dirname(currentScriptPath());
}
