/**
 * Bibliothèque d'Authentification
 * 
 * Ce fichier gère l'authentification des utilisateurs avec des sessions JWT.
 * Il fournit des fonctions pour créer des sessions, vérifier les utilisateurs,
 * et gérer les cookies de session.
 * 
 * Concepts clés pour les étudiants :
 * - JWT (JSON Web Tokens) pour les sessions stateless
 * - Hachage de mot de passe avec bcrypt
 * - Cookies HTTP-only pour la sécurité
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

/**
 * Clé secrète pour signer les JWT
 * Note : En production, utiliser une variable d'environnement
 */
const JWT_SECRET = new TextEncoder().encode(
  process.env["JWT_SECRET"] ?? "secret-key-for-development-only-change-in-production"
);

/**
 * Nom du cookie de session
 */
const SESSION_COOKIE = "session";

/**
 * Durée de validité de la session (7 jours)
 */
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

/**
 * Interface pour les données de session
 */
export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  expiresAt: Date;
}

/**
 * Crée un token JWT pour la session
 * 
 * @param payload - Données de la session utilisateur
 * @returns Token JWT signé
 */
export async function createSessionToken(payload: Omit<SessionPayload, "expiresAt">): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  
  return new SignJWT({ ...payload, expiresAt: expiresAt.toISOString() })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET);
}

/**
 * Crée une session utilisateur et définit le cookie
 * 
 * @param userId - ID de l'utilisateur
 * @param email - Email de l'utilisateur
 * @param name - Nom de l'utilisateur
 */
export async function createSession(userId: string, email: string, name: string): Promise<void> {
  const token = await createSessionToken({ userId, email, name });
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  });
}

/**
 * Récupère la session courante depuis les cookies
 * 
 * @returns Les données de session ou null si non connecté
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return {
      userId: payload["userId"] as string,
      email: payload["email"] as string,
      name: payload["name"] as string,
      expiresAt: new Date(payload["expiresAt"] as string),
    };
  } catch {
    return null;
  }
}

/**
 * Supprime la session (déconnexion)
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Hache un mot de passe
 * 
 * @param password - Mot de passe en clair
 * @returns Mot de passe haché
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Vérifie un mot de passe contre son hash
 * 
 * @param password - Mot de passe en clair
 * @param hash - Hash du mot de passe stocké
 * @returns true si le mot de passe correspond
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
