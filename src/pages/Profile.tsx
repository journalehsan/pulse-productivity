import React from 'react';
import { User, Bell, Keyboard, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { currentUser } from '@/data/mockData';

const shortcuts = [
  { action: 'Open search', keys: '⌘ K' },
  { action: 'Create new task', keys: 'N' },
  { action: 'Go to Dashboard', keys: 'G D' },
  { action: 'Go to Projects', keys: 'G P' },
  { action: 'Toggle sidebar', keys: '[' },
  { action: 'Open task details', keys: 'Enter' },
  { action: 'Mark task complete', keys: 'C' },
  { action: 'Open notifications', keys: '⌘ ⇧ N' },
];

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Profile"
        description="Manage your personal settings and preferences."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Profile' }]} />}
      />

      <div className="p-6 space-y-6 max-w-2xl">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your profile details and photo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="text-2xl">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser.role}</p>
              </div>
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={currentUser.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={currentUser.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="America/New_York" />
              </div>
            </div>

            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how you want to be notified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: 'Task assignments',
                description: 'When someone assigns you to a task',
                defaultChecked: true,
              },
              {
                title: 'Task comments',
                description: 'When someone comments on your tasks',
                defaultChecked: true,
              },
              {
                title: 'Due date reminders',
                description: 'Get reminded before tasks are due',
                defaultChecked: true,
              },
              {
                title: 'Project updates',
                description: 'Changes to projects you are a member of',
                defaultChecked: false,
              },
              {
                title: 'Weekly digest',
                description: 'Summary of your week every Monday',
                defaultChecked: true,
              },
              {
                title: 'Marketing emails',
                description: 'Tips and product updates from PulseTasks',
                defaultChecked: false,
              },
            ].map((pref) => (
              <div
                key={pref.title}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="font-medium text-sm">{pref.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {pref.description}
                  </p>
                </div>
                <Switch defaultChecked={pref.defaultChecked} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </CardTitle>
            <CardDescription>
              Quick actions to navigate the app faster.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.action}
                  className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50"
                >
                  <span className="text-sm">{shortcut.action}</span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-background border border-border rounded">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
