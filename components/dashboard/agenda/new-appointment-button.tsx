'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Check, ChevronsUpDown, UserPlus, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAppointment } from '@/app/lib/actions/appointment-actions';
import { searchPets, searchTutors } from '@/app/lib/search-actions';
import { quickRegisterTutorAndPet } from '@/app/lib/actions/quick-register-actions';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList, // Verify if this export exists
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDebounce } from 'use-debounce'; // Assuming use-debounce is available (in package.json)

export function NewAppointmentButton() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Appointment Form State
    const [title, setTitle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [selectedPet, setSelectedPet] = useState<{ id: string, name: string, tutorName: string } | null>(null);

    // Search State
    const [openCombobox, setOpenCombobox] = useState(false);
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 300);
    const [pets, setPets] = useState<{ id: string, name: string, tutorName: string, label: string }[]>([]);

    // Quick Register State
    const [isQuickRegister, setIsQuickRegister] = useState(false);
    const [newTutorName, setNewTutorName] = useState('');
    const [newPetName, setNewPetName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newSpecies, setNewSpecies] = useState('DOG');

    // Search Effect
    useEffect(() => {
        if (debouncedQuery.length < 2) {
            setPets([]);
            return;
        }

        const fetchPets = async () => {
            const results = await searchPets(debouncedQuery);
            setPets(results.map((p: any) => ({ ...p, tutorName: p.tutorName || '' })));
        };

        fetchPets();
    }, [debouncedQuery]);

    // Search State for Tutors
    const [openTutorCombobox, setOpenTutorCombobox] = useState(false);
    const [tutorQuery, setTutorQuery] = useState("");
    const [debouncedTutorQuery] = useDebounce(tutorQuery, 300);
    const [tutors, setTutors] = useState<{ id: string, name: string, label: string }[]>([]);
    const [selectedTutor, setSelectedTutor] = useState<{ id: string, name: string } | null>(null);

    // Search Effect for Tutors
    useEffect(() => {
        if (debouncedTutorQuery.length < 2) {
            setTutors([]);
            return;
        }
        const fetchTutors = async () => {
            const results = await searchTutors(debouncedTutorQuery);
            setTutors(results.map((t: any) => ({ ...t, name: t.name || 'Sem nome' })));
        };
        fetchTutors();
    }, [debouncedTutorQuery]);


    const handleQuickRegister = async () => {
        // Validation: If no existing tutor selected, Name and Phone are required.
        if (!selectedTutor) {
            if (!newTutorName) {
                alert("Nome do Tutor é obrigatório para novo cadastro.");
                return;
            }
            if (!newPhone) {
                alert("Telefone é obrigatório para novo cadastro.");
                return;
            }
        }

        if (!newPetName) {
            alert("Nome do Pet é obrigatório.");
            return;
        }

        setLoading(true);
        try {
            const result = await quickRegisterTutorAndPet({
                existingTutorId: selectedTutor?.id,
                tutorName: newTutorName,
                phone: newPhone,
                petName: newPetName,
                species: newSpecies as any
            });

            if (result.error || !result.data) {
                alert(result.error || "Erro ao cadastrar.");
            } else {
                // Success! Auto-select and switch back
                const { pet, user } = result.data;
                setSelectedPet({
                    id: pet.id,
                    name: pet.name,
                    tutorName: user?.name || selectedTutor?.name || 'Tutor'
                });

                // Auto fill title if not set
                if (!title) setTitle(`Consulta - ${pet.name}`);

                setIsQuickRegister(false);
                // Reset register form
                setNewTutorName('');
                setNewPetName('');
                setNewPhone('');
                setSelectedTutor(null);
            }
        } catch (e) {
            console.error(e);
            alert("Erro inesperado.");
        } finally {
            setLoading(false);
        }
    };


    // ... handleSubmit remains same ...
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dateTime) {
            alert("Selecione data e hora.");
            return;
        }
        setLoading(true);

        try {
            const start = new Date(dateTime);
            const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour later

            const result = await createAppointment({
                title,
                startTime: start,
                endTime: end,
                type: 'CONSULT',
                petId: selectedPet?.id
            });

            if (result.error) {
                console.error(result.error);
                alert(result.error);
            } else {
                setOpen(false);
                // Reset main form
                setTitle('');
                setDateTime('');
                setSelectedPet(null);
                setSelectedTutor(null);
            }
        } catch (err) {
            console.error(err);
            alert("Erro inesperado ao criar agendamento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 shadow-md">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Agendamento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-visible">
                <DialogHeader>
                    <DialogTitle>{isQuickRegister ? 'Cadastro Rápido' : 'Novo Agendamento'}</DialogTitle>
                    <DialogDescription>
                        {isQuickRegister ? 'Cadastre ou selecione um tutor.' : 'Selecione o paciente e horário.'}
                    </DialogDescription>
                </DialogHeader>

                {isQuickRegister ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Tutor</Label>
                            <div className="col-span-3">
                                {/* Tutor Selector / Creator */}
                                <Popover open={openTutorCombobox} onOpenChange={setOpenTutorCombobox}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openTutorCombobox}
                                            className="w-full justify-between"
                                        >
                                            {selectedTutor
                                                ? selectedTutor.name
                                                : (newTutorName || "Buscar ou Criar Tutor...")}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                        <Command shouldFilter={false}>
                                            <CommandInput
                                                placeholder="Buscar tutor..."
                                                value={tutorQuery}
                                                onValueChange={(val) => {
                                                    setTutorQuery(val);
                                                    // If user types, we treat it as potentially a New Tutor Name immediately if they proceed
                                                    setNewTutorName(val);
                                                    setSelectedTutor(null); // Clear selection if typing
                                                }}
                                            />
                                            <CommandList>
                                                <CommandEmpty className="py-2 px-2 text-sm text-muted-foreground">
                                                    Nenhum tutor encontrado. <br />
                                                    Use <strong>&quot;{tutorQuery}&quot;</strong> como novo nome.
                                                </CommandEmpty>
                                                <CommandGroup heading="Tutores Cadastrados">
                                                    {tutors.map((t) => (
                                                        <CommandItem
                                                            key={t.id}
                                                            value={t.id}
                                                            onSelect={() => {
                                                                // Fixed lint: make sure name is string
                                                                setSelectedTutor({ id: t.id, name: t.name || 'Sem nome' });
                                                                setNewTutorName(''); // Clear new name since we selected one
                                                                setOpenTutorCombobox(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedTutor?.id === t.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {t.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Phone - Only show/required if creating NEW tutor */}
                        {!selectedTutor && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Telefone <span className="text-red-500">*</span></Label>
                                <Input
                                    value={newPhone}
                                    onChange={e => setNewPhone(e.target.value)}
                                    placeholder="(11) 99999-9999"
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Pet</Label>
                            <Input value={newPetName} onChange={e => setNewPetName(e.target.value)} placeholder="Nome do Pet" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Espécie</Label>
                            <div className="col-span-3">
                                <Select value={newSpecies} onValueChange={setNewSpecies}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DOG">Cachorro</SelectItem>
                                        <SelectItem value="CAT">Gato</SelectItem>
                                        <SelectItem value="BIRD">Ave</SelectItem>
                                        <SelectItem value="OTHER">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsQuickRegister(false)} disabled={loading}>Voltar</Button>
                            <Button onClick={handleQuickRegister} disabled={loading}>{selectedTutor ? 'Adicionar Pet' : 'Cadastrar Tudo'}</Button>
                        </DialogFooter>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                        {/* Patient Search */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Paciente</Label>
                            <div className="col-span-3 flex gap-2">
                                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openCombobox}
                                            className="w-full justify-between"
                                        >
                                            {selectedPet
                                                ? `${selectedPet.name} (${selectedPet.tutorName})`
                                                : "Buscar pet..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                        <Command shouldFilter={false}>
                                            <CommandInput placeholder="Digite nome do pet..." value={query} onValueChange={setQuery} />
                                            <CommandList>
                                                <CommandEmpty>
                                                    <div className="p-2 text-sm text-center">
                                                        Nenhum pet encontrado.<br />
                                                        <Button variant="link" size="sm" onClick={() => { setOpenCombobox(false); setIsQuickRegister(true); }}>
                                                            + Cadastrar Novo
                                                        </Button>
                                                    </div>
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {pets.map((pet) => (
                                                        <CommandItem
                                                            key={pet.id}
                                                            value={pet.id} // Not used for filtering since we filter server side
                                                            onSelect={() => {
                                                                setSelectedPet({ id: pet.id, name: pet.name, tutorName: pet.tutorName });
                                                                setTitle(`Consulta - ${pet.name}`); // Auto-fill title
                                                                setOpenCombobox(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedPet?.id === pet.id ? "opacity-100" : "opacity-0"
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

                                <Button type="button" size="icon" variant="outline" onClick={() => setIsQuickRegister(true)} title="Cadastro Rápido">
                                    <UserPlus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Título
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Consulta"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="datetime" className="text-right">
                                Data/Hora
                            </Label>
                            <Input
                                id="datetime"
                                type="datetime-local"
                                value={dateTime}
                                onChange={(e) => setDateTime(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Salvando...' : 'Agendar'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
