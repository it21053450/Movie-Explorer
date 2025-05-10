import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from "./context/theme-context";
import { FavoritesProvider } from "./context/favorites-context";

import HomePage from "@/pages/home-page";
import TrendingPage from "@/pages/trending-page";
import FavoritesPage from "@/pages/favorites-page";
import SearchResultsPage from "@/pages/search-results-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import Header from "./components/layout/header";
import BottomNav from "./components/layout/bottom-nav";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/search" component={SearchResultsPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/trending" component={TrendingPage} />
      <ProtectedRoute path="/favorites" component={FavoritesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <TooltipProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-6">
                  <Router />
                </main>
                <BottomNav />
              </div>
              <Toaster />
            </TooltipProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
