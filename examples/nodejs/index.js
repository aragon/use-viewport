const React = require('react')
const ReactDOMServer = require('react-dom/server')
const { useViewport } = require('use-viewport')

console.log(
  ReactDOMServer.renderToStaticMarkup(
    React.createElement(function() {
      const viewport = useViewport()
      return React.createElement(
        'p',
        null,
        `Viewport width on server: ${viewport.width}`
      )
    })
  )
)
