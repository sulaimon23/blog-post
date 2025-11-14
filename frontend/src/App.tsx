import { ErrorBoundary } from '@/components/error-boundary';
import UserPostsPage from '@/pages/user-posts-page';
import UsersPage from '@/pages/users-page';
import { QueryProvider } from '@/providers/query-provider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

function App() {
    return (
        <ErrorBoundary>
            <QueryProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<UsersPage />} />
                        <Route path="/users/:userId/posts" element={<UserPostsPage />} />
                    </Routes>
                    <Toaster position="top-right" richColors />
                </BrowserRouter>
            </QueryProvider>
        </ErrorBoundary>
    );
}

export default App;