import { CheckIcon, ChevronUp, X } from 'lucide-react'
import * as React from 'react'
import { Control, FieldValues, Path, PathValue } from 'react-hook-form'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  options:
    | {
        name: string
        id: PathValue<TFieldValues, Path<TFieldValues>>
      }[]
    | null
  multiple?: boolean
  label: string
}

const SelectBox = <TFieldValues extends FieldValues>({
  options,
  multiple,
  control,
  name,
  label
}: Props<TFieldValues>) => {
  const [searchTerm, setSearchTerm] = React.useState<string>('')
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelect = (
    selectedValue: string,
    onChange: (...event: unknown[]) => void,
    value: PathValue<TFieldValues, Path<TFieldValues>>
  ) => {
    if (multiple) {
      const newValue =
        value?.includes(selectedValue) && Array.isArray(value)
          ? (value as PathValue<TFieldValues, Path<TFieldValues>>[]).filter(
              v => v !== selectedValue
            )
          : [...(value ?? []), selectedValue]
      onChange?.(newValue)
    } else {
      onChange?.(selectedValue)
      setIsOpen(false)
    }
  }

  const handleClear = (onChange: (...event: unknown[]) => void) => {
    onChange?.(multiple ? [] : '')
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div
                className={
                  'data-[state=open]:border-ring flex min-h-[36px] cursor-pointer items-center justify-between rounded-md border px-3 py-1'
                }
              >
                <div
                  className={cn(
                    'items-center gap-1 overflow-hidden text-sm',
                    multiple
                      ? 'flex flex-grow flex-wrap'
                      : 'inline-flex whitespace-nowrap'
                  )}
                >
                  {(value && value.length > 0) || typeof value === 'number' ? (
                    multiple ? (
                      (options || [])
                        .filter(
                          option =>
                            Array.isArray(value) && value.includes(option.id)
                        )
                        .map(option => (
                          <span
                            key={option.id}
                            className='text-foreground focus:ring-ring inline-flex items-center gap-1 rounded-md border py-0.5 pr-1 pl-2 text-xs font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none'
                          >
                            <span>{option.name}</span>
                            <span
                              onClick={e => {
                                e.preventDefault()
                                handleSelect(option.id, onChange, value)
                              }}
                              className='text-muted-foreground/60 hover:bg-accent hover:text-muted-foreground flex items-center rounded-sm px-[1px]'
                            >
                              <X />
                            </span>
                          </span>
                        ))
                    ) : (
                      (options || []).find(opt => opt.id === value)?.name
                    )
                  ) : (
                    <span className='text-muted-foreground mr-auto'>
                      Select...
                    </span>
                  )}
                </div>
                <div className='text-muted-foreground/60 hover:text-foreground flex items-center self-stretch pl-1 [&>div]:flex [&>div]:items-center [&>div]:self-stretch'>
                  {value && value.length > 0 ? (
                    <div
                      onClick={e => {
                        e.preventDefault()
                        handleClear(onChange)
                      }}
                    >
                      <X className='size-4' />
                    </div>
                  ) : (
                    <div>
                      <ChevronUp className='size-4' />
                    </div>
                  )}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className='w-[var(--radix-popover-trigger-width)] p-0'
              align='start'
            >
              <Command>
                <div className='relative'>
                  <CommandInput
                    value={searchTerm}
                    onValueChange={e => setSearchTerm(e)}
                    placeholder='Search...'
                    className='h-9'
                  />
                  {searchTerm && (
                    <div
                      className='text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3'
                      onClick={() => setSearchTerm('')}
                    >
                      <X className='size-4' />
                    </div>
                  )}
                </div>
                <CommandList>
                  <CommandEmpty>{'No results found.'}</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea>
                      <div className='max-h-64'>
                        {(options || []).map(option => {
                          const isSelected =
                            Array.isArray(value) && value.includes(option.id)
                          return (
                            <CommandItem
                              key={option.id}
                              // value={option.value}
                              onSelect={() =>
                                handleSelect(option.id, onChange, value)
                              }
                            >
                              {multiple && (
                                <div
                                  className={cn(
                                    'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                    isSelected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'opacity-50 [&_svg]:invisible'
                                  )}
                                >
                                  <CheckIcon />
                                </div>
                              )}
                              <span>{option.name}</span>
                              {!multiple && option.id === value && (
                                <CheckIcon
                                  className={cn(
                                    'ml-auto',
                                    option.id === value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              )}
                            </CommandItem>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

SelectBox.displayName = 'SelectBox'

export default SelectBox
