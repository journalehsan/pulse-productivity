import React from 'react';
import { Building, Users, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { workspaces } from '@/data/mockData';

const roles = ['Admin', 'Manager', 'Member', 'Viewer'];
const permissions = [
  'Create projects',
  'Delete projects',
  'Manage members',
  'View reports',
  'Edit timesheets',
  'Manage billing',
  'Configure settings',
];

const permissionMatrix: Record<string, Record<string, boolean>> = {
  Admin: {
    'Create projects': true,
    'Delete projects': true,
    'Manage members': true,
    'View reports': true,
    'Edit timesheets': true,
    'Manage billing': true,
    'Configure settings': true,
  },
  Manager: {
    'Create projects': true,
    'Delete projects': false,
    'Manage members': true,
    'View reports': true,
    'Edit timesheets': true,
    'Manage billing': false,
    'Configure settings': false,
  },
  Member: {
    'Create projects': false,
    'Delete projects': false,
    'Manage members': false,
    'View reports': true,
    'Edit timesheets': true,
    'Manage billing': false,
    'Configure settings': false,
  },
  Viewer: {
    'Create projects': false,
    'Delete projects': false,
    'Manage members': false,
    'View reports': true,
    'Edit timesheets': false,
    'Manage billing': false,
    'Configure settings': false,
  },
};

const Settings: React.FC = () => {
  const workspace = workspaces[0];

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Settings"
        description="Manage your workspace settings and preferences."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Settings' }]} />}
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Workspace Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Workspace Settings
            </CardTitle>
            <CardDescription>
              Manage your workspace name and branding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input id="workspace-name" defaultValue={workspace.name} />
            </div>
            <div className="space-y-2">
              <Label>Workspace Logo</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {workspace.name.charAt(0)}
                </div>
                <Button variant="outline">Upload Logo</Button>
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Roles & Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Roles & Permissions
            </CardTitle>
            <CardDescription>
              Configure access levels for different roles in your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Roles List */}
              <div className="flex gap-2">
                {roles.map((role) => (
                  <Badge key={role} variant="outline" className="text-sm py-1 px-3">
                    {role}
                  </Badge>
                ))}
              </div>

              <Separator />

              {/* Permission Matrix */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      {roles.map((role) => (
                        <TableHead key={role} className="text-center">
                          {role}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission) => (
                      <TableRow key={permission}>
                        <TableCell className="font-medium">{permission}</TableCell>
                        {roles.map((role) => (
                          <TableCell key={role} className="text-center">
                            <Checkbox
                              checked={permissionMatrix[role][permission]}
                              disabled
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground">
                Permission changes require admin approval.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
            <CardDescription>
              Manage who has access to this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Invite by email..." className="flex-1" />
                <Button>Send Invite</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {workspace.members.length} members in this workspace
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect your entire workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">Archive Workspace</p>
                <p className="text-sm text-muted-foreground">
                  Make this workspace read-only and hide it from navigation.
                </p>
              </div>
              <Button variant="outline" disabled>
                Archive
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
              <div>
                <p className="font-medium">Delete Workspace</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this workspace and all its data.
                </p>
              </div>
              <Button variant="destructive" disabled>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
