import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import App from "./App";
import "./index.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/code-highlight/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/spotlight/styles.css';

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    // STAAR Kids brand colors
    brand: [
      '#E6F3FF',
      '#CCE7FF',
      '#99CEFF',
      '#66B5FF',
      '#339CFF',
      '#0083FF',
      '#006ACC',
      '#005199',
      '#003866',
      '#001F33'
    ],
    starYellow: [
      '#FFF8E1',
      '#FFF1C4',
      '#FFE082',
      '#FFCC02',
      '#FFB300',
      '#FF9F00',
      '#FB8C00',
      '#F57C00',
      '#EF6C00',
      '#E65100'
    ]
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  },
  radius: {
    md: '8px'
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  }
});

createRoot(document.getElementById("root")!).render(
  <MantineProvider theme={theme}>
    <Notifications position="top-right" />
    <ModalsProvider>
      <App />
    </ModalsProvider>
  </MantineProvider>
);
