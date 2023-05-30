#' @importFrom htmltools tag htmlDependency tagList
#' @export
example_number_input <- function(id, ...) {
  contents <- list(id = id, ...)
  tagList(
    component_dep(),
    tag("example-number-input", contents)
  )
}


component_dep <- function() {
  htmlDependency(
    name = "shinycomponenttemplate",
    version = as.character(packageVersion("shinycomponenttemplate")),
    src = system.file(package = "shinycomponenttemplate", "www"),
    stylesheet = "open-props.min.css",
    script = list(src = "example-number-input.js", type = "module")
  )
}
