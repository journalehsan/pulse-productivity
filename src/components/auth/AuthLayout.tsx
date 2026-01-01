import React from 'react';
import { PulseTasksLogo } from '@/components/layout/PulseTasksLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
  sideContent?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, sideContent }) => {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl">
          {/* Centered Brand */}
          <div className="flex justify-center mb-10">
            <PulseTasksLogo className="h-16 md:h-20 w-auto text-primary" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            {/* Left: Login Form */}
            <div className="flex flex-col justify-center">
              <div className="mx-auto w-full max-w-md">
                {children}
              </div>
            </div>

            {/* Right: Side Content */}
            {sideContent && (
              <div className="hidden lg:flex lg:flex-col lg:justify-center">
                {sideContent}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile side content */}
      {sideContent && (
        <div className="lg:hidden px-4 pb-8">
          <div className="max-w-md mx-auto">
            {sideContent}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border bg-background">
        © PulseTasks · v1.0.0
      </footer>
    </div>
  );
};
