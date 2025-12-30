import React, { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { DemoUserCard } from '@/components/auth/DemoUserCard';
import { DemoUser, demoUsers } from '@/types/auth';
import { Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [selectedDemoUser, setSelectedDemoUser] = useState<DemoUser | null>(null);

  const handleDemoUserSelect = (user: DemoUser) => {
    setSelectedDemoUser(user);
  };

  const sideContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Sparkles className="h-4 w-4" />
        <span className="text-sm font-medium">Quick Sign-In</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Use a demo account to explore the UI with different permission levels.
      </p>
      <div className="space-y-3">
        {demoUsers.map((user) => (
          <DemoUserCard
            key={user.id}
            user={user}
            isSelected={selectedDemoUser?.id === user.id}
            onSelect={handleDemoUserSelect}
          />
        ))}
      </div>
    </div>
  );

  return (
    <AuthLayout sideContent={sideContent}>
      <LoginForm selectedDemoUser={selectedDemoUser} />
    </AuthLayout>
  );
};

export default Login;
