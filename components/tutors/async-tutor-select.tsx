'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { searchTutors } from '@/app/lib/search-actions';

interface Tutor {
    id: string;
    label: string;
}

export function AsyncTutorSelect({ onSelect, error }: { onSelect: (id: string) => void, error?: string[] }) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');
    const [tutors, setTutors] = React.useState<Tutor[]>([]);
    const [loading, setLoading] = React.useState(false);

    const handleSearch = useDebouncedCallback(async (term: string) => {
        if (term.length < 2) {
            setTutors([]);
            return;
        }
        setLoading(true);
        const results = await searchTutors(term);
        setTutors(results);
        setLoading(false);
    }, 300);

    return (
        <div className="flex flex-col gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value
                            ? tutors.find((tutor) => tutor.id === value)?.label ||
                            // If value is set but tutor not in (current) list, display "Selecionado" or keep previous label if stored. 
                            // Simplification: We need to store the label separately or ensure it's in list.
                            // Ideally, we persist the selected label in state.
                            tutors.find(t => t.id === value)?.label || "Tutor Selecionado"
                            : "Pesquisar Tutor..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput placeholder="Digite nome ou CPF..." onValueChange={handleSearch} />
                        <CommandList>
                            {loading && <div className="p-2 text-sm text-muted-foreground">Buscando...</div>}
                            {!loading && tutors.length === 0 && <CommandEmpty>Nenhum tutor encontrado.</CommandEmpty>}
                            <CommandGroup>
                                {tutors.map((tutor) => (
                                    <CommandItem
                                        key={tutor.id}
                                        value={tutor.id}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? '' : currentValue);
                                            onSelect(currentValue === value ? '' : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === tutor.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {tutor.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <input type="hidden" name="tutorId" value={value} />
            {error && <p className="text-sm text-red-500">{error[0]}</p>}
        </div>
    );
}
