/* @refresh reload */
import { render } from 'solid-js/web'
import { ErrorBoundary } from 'solid-js'
import RoutesComponent from './routers/index'
import { StoreContext } from './helper/_helper.context'
import { Alert, Button, ThemeProvider } from '@suid/material';
import theme from './helper/_helper.theme';
import 'sweetalert2/dist/sweetalert2.min.css'
import "solid-slider/slider.css";
import './index.css'
import "@fontsource/rajdhani";
import "@fontsource/rajdhani/400.css"
import "@fontsource/rajdhani/500.css"
import "@fontsource/rajdhani/600.css"
import "@fontsource/rajdhani/700.css"

const root = document.getElementById('pages-root')

render(() => <ErrorBoundary
    fallback={(error, reset) => (
        <div className="p-4">
            <Alert class="flex items-center" severity="error" color={"success"}>
                <div className="flex gap-4 items-center justify-between w-full">
                    <span>{error.message}</span>
                    <div onClick={reset}>
                        <Button color="error" variant="contained">
                            reset
                        </Button>
                    </div>

                </div>
            </Alert>
        </div>
    )}><StoreContext>
        <ThemeProvider theme={theme}>
            <RoutesComponent></RoutesComponent>
       </ThemeProvider>
    </StoreContext></ErrorBoundary>, root)
