import { getInviteDetails, activateAccount } from "@/lib/portal-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InviteForm from "./invite-form";

export default async function InvitePage({ params }: { params: { accessCode: string } }) {
    const details = await getInviteDetails(params.accessCode);

    if (!details) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle className="text-destructive">Convite Inválido</CardTitle>
                        <CardDescription>Este link não existe ou expirou.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-muted/50">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Ativar Conta</CardTitle>
                    <CardDescription>
                        Olá, <strong>{details.name}</strong>!
                        <br />
                        Defina uma senha para acessar o painel do tutor.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <InviteForm accessCode={params.accessCode} email={details.email} />
                </CardContent>
            </Card>
        </div>
    );
}
