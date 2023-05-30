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
    name = "shinyoutputcode",
    version = as.character(packageVersion("shinyoutputcode")),
    src = system.file(package = "shinyoutputcode", "www"),
    stylesheet = "open-props.min.css",
    script = list(src = "example-number-input.js", type = "module")
  )
}
