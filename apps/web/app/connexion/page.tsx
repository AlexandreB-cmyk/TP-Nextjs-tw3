/**
 * Page de Connexion
 * 
 * Permet aux utilisateurs de se connecter avec leur email et mot de passe.
 * Utilise les Server Actions pour la soumission du formulaire.
 * 
 * Concepts clés pour les étudiants :
 * - Server Actions pour la soumission de formulaires
 * - Validation avec Zod
 * - Gestion des erreurs et des états de chargement
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
import { LogIn, AlertCircle } from "lucide-react";
import { findUserByEmail } from "@workspace/database";
import { createSession, verifyPassword } from "@/lib/auth";

/**
 * Métadonnées SEO pour la page de connexion
 */
export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte pour accéder aux fonctionnalités utilisateur.",
};

/**
 * Server Action pour la connexion
 */
async function loginAction(formData: FormData): Promise<void> {
  "use server";
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email || !password) {
    redirect("/connexion?error=Veuillez%20remplir%20tous%20les%20champs");
  }
  
  try {
    // Trouver l'utilisateur par email
    const user = await findUserByEmail(email);
    
    if (!user) {
      redirect("/connexion?error=Email%20ou%20mot%20de%20passe%20incorrect");
    }
    
    // Vérifier le mot de passe
    if (!user.password) {
      redirect("/connexion?error=Compte%20sans%20mot%20de%20passe");
    }
    
    const isValid = await verifyPassword(password, user.password);
    
    if (!isValid) {
      redirect("/connexion?error=Email%20ou%20mot%20de%20passe%20incorrect");
    }
    
    // Créer la session
    await createSession(user._id.toString(), user.email, user.name);
    
  } catch (error) {
    // Si c'est une erreur de redirection, la relancer
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Erreur de connexion:", error);
    redirect("/connexion?error=Erreur%20de%20connexion.%20V%C3%A9rifiez%20que%20MongoDB%20est%20d%C3%A9marr%C3%A9.");
  }
  
  // Rediriger vers la page utilisateur
  redirect("/utilisateur");
}

/**
 * Composant de page de connexion
 */
export default async function ConnexionPage({
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
            <LogIn className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>
            <Title level="h1">Connexion</Title>
          </CardTitle>
          <CardDescription>
            <Text>Connectez-vous pour accéder à votre espace utilisateur</Text>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          <form action={loginAction} className="space-y-4">
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
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center">
          <Text className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-primary hover:underline">
              Créer un compte
            </Link>
          </Text>
        </CardFooter>
      </Card>
    </div>
  );
}
