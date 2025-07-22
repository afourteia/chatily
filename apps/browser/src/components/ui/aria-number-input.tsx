// Dependencies: npm install lucide-react react-aria-components
import { Minus, Plus } from 'lucide-react';
import { forwardRef, useRef, useState } from 'react';
import {
  Button,
  Group,
  Input,
  Label,
  NumberField,
} from 'react-aria-components';

const AriaNumberInput = forwardRef<
  HTMLInputElement,
  {
    value?: number | undefined;
    onChange?: (value: number) => void;
  }
>(({ value = undefined, onChange = (value) => console.log(value) }, ref) => {
  // const localRef = useRef<HTMLDivElement>(null);
  const [localValue, setlocalValue] = useState(NaN);

  const handleChange = (value: number) => {
    setlocalValue(value);
    onChange(value);
  };

  return (
    <NumberField
      // ref={localRef}
      maxValue={100}
      defaultValue={NaN}
      value={localValue}
      minValue={0}
      onChange={handleChange}
      aria-label="cell value"
    >
      <div className="space-y-2">
        <Group className="relative inline-flex h-7 w-fit items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/[.04] ring-offset-background transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring/30 data-[focus-within]:ring-offset-2">
          <Button
            slot="decrement"
            className="z-10 -ml-px flex aspect-square h-[inherit] items-center justify-center rounded-l-lg border border-input bg-background text-sm text-muted-foreground/80 ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Minus
              size={12}
              strokeWidth={2}
              aria-hidden="true"
              role="presentation"
            />
          </Button>
          <Input
            ref={ref}
            // type="number"
            className="w-11 grow bg-background px-3 py-2 text-right tabular-nums text-foreground focus:outline-none"
          />
          <Button
            slot="increment"
            className="z-10 -mr-px flex aspect-square h-[inherit] items-center justify-center rounded-r-lg border border-input bg-background text-sm text-muted-foreground/80 ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              role="presentation"
            />
          </Button>
        </Group>
      </div>
    </NumberField>
  );
});

AriaNumberInput.displayName = 'AriaNumberInput';

export default AriaNumberInput;
