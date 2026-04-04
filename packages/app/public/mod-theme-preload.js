;(function () {
  var key = "modtools-theme-id"
  var themeId = localStorage.getItem(key) || "mod-2"

  if (themeId === "oc-1") {
    themeId = "mod-2"
    localStorage.setItem(key, themeId)
    localStorage.removeItem("modtools-theme-css-light")
    localStorage.removeItem("modtools-theme-css-dark")
  }

  var scheme = localStorage.getItem("modtools-color-scheme") || "system"
  var isDark = scheme === "dark" || (scheme === "system" && matchMedia("(prefers-color-scheme: dark)").matches)
  var mode = isDark ? "dark" : "light"

  document.documentElement.dataset.theme = themeId
  document.documentElement.dataset.colorScheme = mode

  if (themeId === "mod-2") return

  var css = localStorage.getItem("modtools-theme-css-" + mode)
  if (css) {
    var style = document.createElement("style")
    style.id = "mod-theme-preload"
    style.textContent =
      ":root{color-scheme:" +
      mode +
      ";--text-mix-blend-mode:" +
      (isDark ? "plus-lighter" : "multiply") +
      ";" +
      css +
      "}"
    document.head.appendChild(style)
  }
})()
