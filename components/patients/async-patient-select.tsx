'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
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
import { searchPets } from '@/app/lib/search-actions';

interface Pet {
    id: string;
    label: string;
}

export function AsyncPatientSelect({ onSelect, error }: { onSelect: (id: string, name: string) => void, error?: string[] }) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');
    const [pets, setPets] = React.useState<Pet[]>([]);
    const [loading, setLoading] = React.useState(false);

    const handleSearch = useDebouncedCallback(async (term: string) => {
        if (term.length < 2) {
            setPets([]);
            return;
        }
        setLoading(true);
        const results = await searchPets(term);
        setPets(results);
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
                            ? pets.find((p) => p.id === value)?.label || "Paciente Selecionado"
                            : "Pesquisar Paciente..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput placeholder="Nome do paciente..." onValueChange={handleSearch} />
                        <CommandList>
                            {loading && <div className="p-2 text-sm text-muted-foreground">Buscando...</div>}
                            {!loading && pets.length === 0 && <CommandEmpty>Nenhum paciente encontrado.</CommandEmpty>}
                            <CommandGroup>
                                {pets.map((pet) => (
                                    <CommandItem
                                        key={pet.id}
                                        value={pet.id}
                                        onSelect={(currentValue) => {
                                            const newValue = currentValue === value ? '' : currentValue;
                                            setValue(newValue);
                                            onSelect(newValue, pet.label);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === pet.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {pet.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <input type="hidden" name="petId" value={value} />
            {error && <p className="text-sm text-red-500">{error[0]}</p>}
        </div>
    );
}
