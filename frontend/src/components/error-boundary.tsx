import { Component, type ReactNode } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error details for debugging
        console.error('ErrorBoundary caught an error:', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const errorMessage = this.state.error?.message || 'An unexpected error occurred';
            const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                                  errorMessage.toLowerCase().includes('fetch') ||
                                  errorMessage.toLowerCase().includes('timeout');
            const isApiError = errorMessage.toLowerCase().includes('api') ||
                              errorMessage.toLowerCase().includes('server');
            
            let displayMessage = errorMessage;
            if (isNetworkError) {
                displayMessage = 'Network error: Unable to connect to the server. Please check your internet connection and try again.';
            } else if (isApiError) {
                displayMessage = `Server error: ${errorMessage}. Please try again later or contact support if the issue persists.`;
            }

            return (
                <div className="flex items-center justify-center min-h-screen p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-destructive">Something went wrong</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {displayMessage}
                            </p>
                            <Button onClick={this.handleReset} className="w-full">
                                Go to Home
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

