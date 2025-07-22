import * as React from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

type Status = {
  id: string;
  name?: string | null;
  nameAr?: string | null;
  nameEn?: string | null;
  [key: string]: unknown;
};

type ComboBoxResponsiveProps = {
  statuses: Status[];
  onChange: (value: string) => void;
  propValue: string;
  labelField: 'name' | 'nameAr' | 'nameEn';
};

export function ComboBoxResponsive({
  onChange,
  statuses,
  propValue,
  labelField,
}: ComboBoxResponsiveProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null,
  );

  React.useEffect(() => {
    setSelectedStatus(
      statuses.find((priority) => priority.id === propValue) || null,
    );
  }, [propValue]);

  const handleChange = (status: Status | null) => {
    setSelectedStatus(status);
    // value[arrayIndex].id = status?.id ?? '';
    // value[arrayIndex].parameterId = status?.id ?? '';
    propValue = status?.id ?? '';

    onChange(propValue);
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[150px] justify-start">
            {selectedStatus ? (
              <>{selectedStatus[labelField]}</>
            ) : (
              <div className="flex w-full items-center">
                <span className="flex-grow text-muted-foreground">
                  اضغط للإختيار
                </span>
                <ChevronsUpDown className="ms-1 inline-block" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[arrayIndex00px] p-0" align="start">
          <StatusList
            statuses={statuses}
            setOpen={setOpen}
            setSelectedStatus={handleChange}
            labelField={labelField}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTitle className="sr-only">Status</DrawerTitle>
      <DrawerDescription className="sr-only">
        Set the status of the task.
      </DrawerDescription>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-start px-3">
          {selectedStatus ? (
            <>{selectedStatus[labelField]}</>
          ) : (
            <div className="flex w-full items-center">
              <span className="flex-grow text-muted-foreground">
                اضغط للإختيار
              </span>
              <ChevronsUpDown className="ms-1 inline-block" />
            </div>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList
            statuses={statuses}
            setOpen={setOpen}
            setSelectedStatus={handleChange}
            labelField={labelField}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  setSelectedStatus,
  statuses,
  labelField,
}: {
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: Status | null) => void;
  statuses: Status[];
  labelField: ComboBoxResponsiveProps['labelField'];
}) {
  return (
    <Command dir="rtl">
      <CommandInput placeholder="ابحث..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.id}
              value={status.id + ' -- ' + status[labelField]}
              onSelect={(value) => {
                setSelectedStatus(
                  statuses.find(
                    (priority) =>
                      priority.id === value.slice(0, value.indexOf(' -- ')),
                  ) || null,
                );
                setOpen(false);
              }}
            >
              {status[labelField] ?? status.id}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
