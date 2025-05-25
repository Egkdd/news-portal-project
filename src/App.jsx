import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Layout,
  HomePage,
  SearchPage,
  NewsDetailsPage,
  AboutAgencyPage,
  AuthorProfilePage,
} from "./pages";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"CarroisGothic", serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="news/:postId" element={<NewsDetailsPage />} />
            <Route path="agency" element={<AboutAgencyPage />} />
            <Route path="profile/:userId" element={<AuthorProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
