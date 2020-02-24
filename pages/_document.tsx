import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class WebAppDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            <style>
            {`
              body, html {
                  width: 100vw;
                  height: 100vh;
                  margin: 0;
                  padding: 0;
                  font-family: Montserrat, arial;
                  -webkit-font-smoothing: antialiased;
                  text-rendering: optimizelegibility;
                  letter-spacing: 1px;
              }

              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  text-decoration: none;
                  outline: none;
              }

              input, textarea, button {
                  font-family: inherit;
              }
            `}
            </style>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }
}
