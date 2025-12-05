/**
 * Page Détail Utilisateur - Route Dynamique
 * 
 * Cette page affiche les détails d'un utilisateur spécifique.
 * Elle illustre les routes dynamiques dans Next.js App Router.
 * 
 * Concepts clés pour les étudiants :
 * - Le dossier [id] crée une route dynamique capturant le paramètre "id"
 * - generateMetadata permet de créer des métadonnées SEO basées sur les données
 * - La fonction notFound() déclenche l'affichage de not-found.tsx
 * - Les params sont une Promise dans Next.js 15+ (async patterns)
 * - Server Actions pour les opérations CRUD
 * 
 * URL exemple : /utilisateur/1 → params.id = "1"
 */

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowLeft, Mail, Calendar, User, Edit, Trash2, Save, X } from "lucide-react";
import { findUserById, updateUser, deleteUser, ObjectId } from "@workspace/database";

/**
 * Interface pour représenter un utilisateur
 * Note : Correspond au modèle User du package @workspace/database
 */
interface UserData {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Récupère un utilisateur par son ID depuis MongoDB
 */
async function getUserById(id: string): Promise<UserData | null> {
  try {
    // Vérifier que l'ID est un ObjectId valide
    if (!ObjectId.isValid(id)) {
      return null;
    }
    
    const user = await findUserById(id);
    
    if (!user) {
      return null;
    }
    
    return {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}

/**
 * Génération des Métadonnées Dynamiques pour le SEO
 * 
 * @param params - Contient le paramètre de route (id de l'utilisateur)
 * @returns Métadonnées pour le SEO et le partage social
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    return {
      title: "Utilisateur non trouvé",
      description: "Cet utilisateur n'a pas été trouvé dans la base de données.",
    };
  }

  return {
    title: `${user.name} | Profil Utilisateur`,
    description: `Profil de ${user.name} (${user.email})`,
    openGraph: {
      title: `${user.name} | Profil Utilisateur`,
      description: `Profil de ${user.name} (${user.email})`,
    },
  };
}

/**
 * Server Action pour mettre à jour un utilisateur
 */
async function updateUserAction(formData: FormData): Promise<void> {
  "use server";
  
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  
  if (!id || !name || !email) {
    redirect(`/utilisateur/${id}?edit=true&error=Tous%20les%20champs%20sont%20requis`);
  }
  
  try {
    await updateUser(id, { name, email });
    revalidatePath(`/utilisateur/${id}`);
    revalidatePath("/utilisateur");
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    redirect(`/utilisateur/${id}?edit=true&error=Erreur%20lors%20de%20la%20mise%20%C3%A0%20jour`);
  }
  
  redirect(`/utilisateur/${id}`);
}

/**
 * Server Action pour supprimer un utilisateur
 */
async function deleteUserAction(formData: FormData): Promise<void> {
  "use server";
  
  const id = formData.get("id") as string;
  
  if (!id) {
    redirect("/utilisateur?error=ID%20utilisateur%20requis");
  }
  
  try {
    const deleted = await deleteUser(id);
    
    if (!deleted) {
      redirect(`/utilisateur/${id}?error=Utilisateur%20non%20trouv%C3%A9`);
    }
    
    revalidatePath("/utilisateur");
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    redirect(`/utilisateur/${id}?error=Erreur%20lors%20de%20la%20suppression`);
  }
  
  redirect("/utilisateur");
}

/**
 * Composant Page - Affiche les détails d'un utilisateur
 * 
 * @param params - Paramètre de route contenant l'ID de l'utilisateur
 * @param searchParams - Paramètres de recherche pour le mode édition
 */
export default async function UtilisateurDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { id } = await params;
  const { edit } = await searchParams;
  const isEditing = edit === "true";
  const user = await getUserById(id);

  // Affiche la page 404 si l'utilisateur n'existe pas
  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 space-y-6 sm:space-y-8">
      {/* Bouton de retour */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/utilisateur">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Link>
        </Button>
      </div>

      {/* En-tête avec titre */}
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <Title level="h1">{user.name}</Title>
        </div>
        <Text size="lg" className="text-muted-foreground">
          {isEditing ? "Modifier le profil utilisateur" : "Détails du profil utilisateur"}
        </Text>
      </div>

      {/* Card avec les informations de l'utilisateur */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Informations du profil</CardTitle>
            <CardDescription>
              {isEditing 
                ? "Modifiez les informations de l'utilisateur ci-dessous."
                : "Données de l'utilisateur enregistrées dans le système."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              /* Mode édition */
              <form action={updateUserAction} className="space-y-4">
                <input type="hidden" name="id" value={user._id} />
                
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Nom
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={user.name}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    required
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" asChild>
                    <Link href={`/utilisateur/${user._id}`}>
                      <X className="mr-2 h-4 w-4" />
                      Annuler
                    </Link>
                  </Button>
                </div>
              </form>
            ) : (
              /* Mode affichage */
              <>
                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <Text className="font-medium">Email</Text>
                    <Text className="text-muted-foreground">{user.email}</Text>
                  </div>
                </div>

                {/* Date de création */}
                <div className="flex items-start gap-4">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <Text className="font-medium">Date de création</Text>
                    <Text className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </div>
                </div>

                {/* Date de mise à jour */}
                <div className="flex items-start gap-4">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <Text className="font-medium">Dernière mise à jour</Text>
                    <Text className="text-muted-foreground">
                      {new Date(user.updatedAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/utilisateur/${user._id}?edit=true`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </Link>
                  </Button>
                  <form action={deleteUserAction} className="flex-1">
                    <input type="hidden" name="id" value={user._id} />
                    <Button 
                      type="submit" 
                      variant="destructive" 
                      className="w-full"
                      onClick={(e) => {
                        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </Button>
                  </form>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
