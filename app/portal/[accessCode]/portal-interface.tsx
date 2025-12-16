'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    MessageCircle,
    Syringe,
    PawPrint,
    User,
    Send,
    Calendar,
    Weight,
    Info,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendGuestMessage } from '@/lib/portal-actions';

interface PortalInterfaceProps {
    data: any; // Typed in real app
    accessCode: string;
}

type Tab = 'PETS' | 'VACCINES' | 'CHAT';

export function PortalInterface({ data, accessCode }: PortalInterfaceProps) {
    const [activeTab, setActiveTab] = useState<Tab>('PETS');
    const [inputValue, setInputValue] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const tutor = data.tutor;
    const pet = tutor.pets[0]; // MVP: Focus on first pet
    const messages = data.messages;

    useEffect(() => {
        if (activeTab === 'CHAT') {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [activeTab, messages]);

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* App Header */}
            <header className="bg-white px-6 py-4 shadow-sm z-10 sticky top-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Olá, {tutor.user.name?.split(' ')[0]}</h1>
                        <p className="text-xs text-slate-500">Área do Tutor • Vet.OS</p>
                    </div>
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${tutor.user.name}`} />
                        <AvatarFallback>TU</AvatarFallback>
                    </Avatar>
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pb-20">

                {activeTab === 'PETS' && (
                    <div className="p-6 space-y-6">
                        {/* Pet Hero Card */}
                        {pet ? (
                            <>
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent z-0" />
                                    <div className="relative z-10 mb-4">
                                        <div className="h-24 w-24 rounded-full bg-slate-200 border-4 border-white shadow-md overflow-hidden">
                                            {pet.photoUrl ? (
                                                <img src={pet.photoUrl} alt={pet.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <PawPrint className="h-12 w-12 text-slate-400 m-auto mt-5" />
                                            )}
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 relative z-10">{pet.name}</h2>
                                    <p className="text-sm text-slate-500 font-medium relative z-10">{pet.breed} • {pet.species}</p>

                                    <div className="grid grid-cols-3 gap-4 w-full mt-6 relative z-10">
                                        <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl">
                                            <Weight className="h-5 w-5 text-primary mb-1" />
                                            <span className="text-sm font-bold text-slate-700">{pet.weight}kg</span>
                                            <span className="text-[10px] text-slate-400 uppercase">Peso</span>
                                        </div>
                                        <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl">
                                            <Calendar className="h-5 w-5 text-primary mb-1" />
                                            <span className="text-sm font-bold text-slate-700">4a</span>
                                            <span className="text-[10px] text-slate-400 uppercase">Idade</span>
                                        </div>
                                        <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl">
                                            <Info className="h-5 w-5 text-primary mb-1" />
                                            <span className="text-sm font-bold text-slate-700">Macho</span>
                                            <span className="text-[10px] text-slate-400 uppercase">Sexo</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Last Consultation */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-slate-700 ml-1">Última Consulta</h3>
                                    {pet.consultations?.[0] ? (
                                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
                                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                                {format(new Date(pet.consultations[0].date), 'dd')}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{pet.consultations[0].title}</p>
                                                <p className="text-xs text-slate-500">
                                                    {format(new Date(pet.consultations[0].date), "MMMM yyyy", { locale: ptBR })}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center p-6 bg-white rounded-2xl border border-dashed text-slate-400 text-sm">
                                            Sem histórico recente.
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-10">Nenhum pet encontrado.</div>
                        )}
                    </div>
                )}

                {activeTab === 'VACCINES' && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-slate-800">Carteira Digital</h2>
                            <Syringe className="h-5 w-5 text-primary" />
                        </div>

                        {pet?.vaccines && pet.vaccines.length > 0 ? (
                            <div className="space-y-4">
                                {pet.vaccines.map((v: any) => (
                                    <div key={v.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500" />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg">{v.name}</h3>
                                                <p className="text-xs text-slate-500 mt-1">Lote: {v.batch || 'N/A'}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                                                    <CheckCircle2 className="h-3 w-3" /> Aplicada
                                                </span>
                                                <span className="text-xs font-medium text-slate-600 mt-2">
                                                    {format(new Date(v.date), "dd/MM/yy")}
                                                </span>
                                            </div>
                                        </div>
                                        {v.nextDue && (
                                            <div className="mt-4 pt-3 border-t border-dashed flex items-center gap-2 text-amber-600 text-xs font-medium">
                                                <Clock className="h-3 w-3" />
                                                Próxima dose: {format(new Date(v.nextDue), "dd/MM/yyyy")}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-3xl text-center border border-dashed">
                                <Syringe className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-slate-900 font-medium">Nenhuma vacina registrada</h3>
                                <p className="text-slate-500 text-sm mt-1">As vacinas aplicadas aparecerão aqui.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'CHAT' && (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 p-4 space-y-4">
                            {messages.map((msg: any) => {
                                // Important: We need to know who is who.
                                // In this view, 'Me' is the Tutor.
                                // The Tutor's UserId is tutor.userId.
                                const isMe = msg.senderId === tutor.userId;

                                return (
                                    <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
                                            isMe
                                                ? "bg-primary text-white rounded-br-none"
                                                : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                                        )}>
                                            <p>{msg.content}</p>
                                            <span className={cn(
                                                "text-[10px] block text-right mt-1 opacity-70",
                                                isMe ? "text-primary-foreground" : "text-slate-400"
                                            )}>
                                                {format(new Date(msg.createdAt), 'HH:mm')}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={bottomRef} />
                        </div>

                        <div className="p-4 bg-white border-t sticky bottom-0">
                            <form action={async (formData) => {
                                if (!inputValue.trim()) return;
                                await sendGuestMessage(formData);
                                setInputValue('');
                            }} className="flex gap-2">
                                <input type="hidden" name="accessCode" value={accessCode} />
                                <Input
                                    name="content"
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="rounded-full bg-slate-50 border-slate-200"
                                    autoComplete="off"
                                />
                                <Button size="icon" className="rounded-full shrink-0">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                )}

            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 h-16 md:absolute md:max-w-md md:mx-auto">
                <div className="flex justify-around items-center h-full">
                    <button
                        onClick={() => setActiveTab('PETS')}
                        className={cn("flex flex-col items-center gap-1 transition-colors", activeTab === 'PETS' ? "text-primary" : "text-slate-400")}
                    >
                        <PawPrint className={cn("h-6 w-6 transition-transform", activeTab === 'PETS' ? "scale-110" : "")} />
                        <span className="text-[10px] font-medium">Meu Pet</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('VACCINES')}
                        className={cn("flex flex-col items-center gap-1 transition-colors", activeTab === 'VACCINES' ? "text-primary" : "text-slate-400")}
                    >
                        <Syringe className={cn("h-6 w-6 transition-transform", activeTab === 'VACCINES' ? "scale-110" : "")} />
                        <span className="text-[10px] font-medium">Vacinas</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('CHAT')}
                        className={cn("flex flex-col items-center gap-1 transition-colors", activeTab === 'CHAT' ? "text-primary" : "text-slate-400")}
                    >
                        <div className="relative">
                            <MessageCircle className={cn("h-6 w-6 transition-transform", activeTab === 'CHAT' ? "scale-110" : "")} />
                            {/* Unread badge could go here */}
                        </div>
                        <span className="text-[10px] font-medium">Chat</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
