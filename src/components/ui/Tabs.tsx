'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export const TabsRoot = Tabs.Root;

export const TabsList = ({
  className,
  ...props
}: Tabs.TabsListProps) => (
  <Tabs.List
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1',
      className
    )}
    {...props}
  />
);

export const TabsTrigger = ({
  className,
  ...props
}: Tabs.TabsTriggerProps) => (
  <Tabs.Trigger
    className={cn(
      'px-4 py-2 text-sm font-medium rounded-sm data-[state=active]:bg-background data-[state=active]:shadow',
      className
    )}
    {...props}
  />
);

export const TabsContent = ({
  className,
  ...props
}: Tabs.TabsContentProps) => (
  <Tabs.Content className={cn('mt-6', className)} {...props} />
);
