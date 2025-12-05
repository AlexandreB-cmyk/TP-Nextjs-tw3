/**
 * Page Liste des Utilisateurs
 * 
 * Cette page affiche la liste de tous les utilisateurs enregistrés.
 * Elle utilise les données de la base MongoDB via le package @workspace/database.
 * 
 * Concepts clés pour les étudiants :
 * - Composant Serveur Asynchrone (Server Component)
 * - Récupération de données côté serveur
 * - Affichage de listes avec Table UI
 * - Liens vers les pages de détail
 */

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Users, Eye, LogOut, UserPlus } from "lucide-react";
import { listUsers } from "@workspace/database";
import { getSession, deleteSession } from "@/lib/auth";

/**
 * Métadonnées SEO pour la page Liste des Utilisateurs
 */
export const metadata: Metadata = {
  title: "Liste des Utilisateurs",
  description: "Consultez la liste de tous les utilisateurs enregistrés dans l'application.",
  keywords: ["utilisateurs", "liste", "authentification", "gestion"],
  openGraph: {
    title: "Liste des Utilisateurs | Next.js Avancé",
    description: "Consultez la liste de tous les utilisateurs enregistrés dans l'application.",
  },
};

/**
 * Server Action pour la déconnexion
 */
async function logoutAction() {
  "use server";
  await deleteSession();
  redirect("/connexion");
}

/**
 * Composant de page pour la liste des utilisateurs
 */
export default async function UtilisateursPage() {
  // Récupérer la session de l'utilisateur connecté
  const session = await getSession();
  
  // Récupérer les utilisateurs depuis MongoDB
  let users: Array<{
    _id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }> = [];
  
  try {
    const dbUsers = await listUsers();
    users = dbUsers.map((user) => ({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 space-y-6 sm:space-y-8">
      {/* En-tête avec titre et description */}
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <Title level="h1">Liste des Utilisateurs</Title>
        </div>
        <Text size="lg" className="max-w-2xl">
          Consultez et gérez les utilisateurs enregistrés dans l&apos;application.
          Cliquez sur un utilisateur pour voir ses détails.
        </Text>
        
        {/* Affichage de l'utilisateur connecté et bouton de déconnexion */}
        {session && (
          <div className="flex items-center gap-4 mt-4">
            <Text className="text-muted-foreground">
              Connecté en tant que <span className="font-medium text-foreground">{session.name}</span>
            </Text>
            <form action={logoutAction}>
              <Button variant="outline" size="sm" type="submit">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Card contenant la table des utilisateurs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Utilisateurs ({users.length})</CardTitle>
              <CardDescription>
                Liste de tous les utilisateurs avec leurs informations de base.
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/inscription">
                <UserPlus className="mr-2 h-4 w-4" />
                Nouvel utilisateur
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/utilisateur/${user._id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Text className="text-muted-foreground">
                Aucun utilisateur trouvé. Créez votre premier utilisateur !
              </Text>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
