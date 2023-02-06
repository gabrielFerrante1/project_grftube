import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import type { AppProps } from 'next/app'
import LayoutMain from '../components/Layouts/LayoutMain'

import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <LayoutMain>
          <Component {...pageProps} />
        </LayoutMain>

      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
