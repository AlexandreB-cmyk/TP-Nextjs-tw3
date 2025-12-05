/**
 * Page d'Inscription
 * 
 * Permet aux utilisateurs de créer un nouveau compte.
 * Utilise les Server Actions pour la soumission du formulaire.
 * 
 * Concepts clés pour les étudiants :
 * - Server Actions pour la soumission de formulaires
 * - Validation des entrées utilisateur
 * - Création d'utilisateur avec mot de passe haché
 */

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { UserPlus, AlertCircle } from "lucide-react";
import { createUser, findUserByEmail } from "@workspace/database";
import { createSession, hashPassword } from "@/lib/auth";

/**
 * Métadonnées SEO pour la page d'inscription
 */
export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez un compte pour accéder aux fonctionnalités utilisateur.",
};

/**
 * Server Action pour l'inscription
 */
async function registerAction(formData: FormData): Promise<void> {
  "use server";
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  
  // Validation des champs
  if (!name || !email || !password || !confirmPassword) {
    redirect("/inscription?error=Tous%20les%20champs%20sont%20requis");
  }
  
  if (password.length < 6) {
    redirect("/inscription?error=Le%20mot%20de%20passe%20doit%20contenir%20au%20moins%206%20caract%C3%A8res");
  }
  
  if (password !== confirmPassword) {
    redirect("/inscription?error=Les%20mots%20de%20passe%20ne%20correspondent%20pas");
  }
  
  try {
    // Vérifier si l'email existe déjà
    const existingUser = await findUserByEmail(email);
    
    if (existingUser) {
      redirect("/inscription?error=Un%20compte%20existe%20d%C3%A9j%C3%A0%20avec%20cet%20email");
    }
    
    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);
    
    // Créer l'utilisateur
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
    });
    
    // Créer la session
    await createSession(user._id.toString(), user.email, user.name);
    
  } catch (error) {
    // Si c'est une erreur de redirection, la relancer
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Erreur d'inscription:", error);
    redirect("/inscription?error=Erreur%20lors%20de%20la%20cr%C3%A9ation%20du%20compte.%20V%C3%A9rifiez%20que%20MongoDB%20est%20d%C3%A9marr%C3%A9.");
  }
  
  // Rediriger vers la page utilisateur
  redirect("/utilisateur");
}

/**
 * Composant de page d'inscription
 */
export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="container mx-auto py-10 px-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserPlus className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>
            <Title level="h1">Inscription</Title>
          </CardTitle>
          <CardDescription>
            <Text>Créez un compte pour accéder à l&apos;espace utilisateur</Text>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          <form action={registerAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom complet
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Jean Dupont"
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <Text className="text-xs text-muted-foreground">
                Au moins 6 caractères
              </Text>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmer le mot de passe
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Créer mon compte
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center">
          <Text className="text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/connexion" className="text-primary hover:underline">
              Se connecter
            </Link>
          </Text>
        </CardFooter>
      </Card>
    </div>
  );
}
