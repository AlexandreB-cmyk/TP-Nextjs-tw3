/**
 * Middleware Next.js - Protection des routes
 * 
 * Ce middleware intercepte les requêtes et vérifie l'authentification
 * pour les routes protégées (pages utilisateur).
 * 
 * Concepts clés pour les étudiants :
 * - Middleware Next.js pour la protection des routes
 * - Vérification des tokens JWT
 * - Redirection vers la page de connexion
 */

import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Clé secrète pour vérifier les JWT
 */
const JWT_SECRET = new TextEncoder().encode(
  process.env["JWT_SECRET"] ?? "secret-key-for-development-only-change-in-production"
);

/**
 * Routes protégées nécessitant une authentification
 */
const protectedRoutes = ["/utilisateur"];

/**
 * Routes publiques (accessibles sans authentification)
 */
const publicRoutes = ["/connexion", "/inscription"];

/**
 * Middleware exécuté à chaque requête
 * 
 * @param request - Requête Next.js
 * @returns Réponse ou redirection
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get("session")?.value;
  
  // Vérifie si la route est protégée
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => path === route);
  
  // Si route protégée, vérifier la session
  if (isProtectedRoute) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/connexion", request.url));
    }
    
    try {
      await jwtVerify(sessionCookie, JWT_SECRET);
    } catch {
      // Token invalide ou expiré
      const response = NextResponse.redirect(new URL("/connexion", request.url));
      response.cookies.delete("session");
      return response;
    }
  }
  
  // Si utilisateur connecté sur une route publique (connexion/inscription), rediriger
  if (isPublicRoute && sessionCookie) {
    try {
      await jwtVerify(sessionCookie, JWT_SECRET);
      return NextResponse.redirect(new URL("/utilisateur", request.url));
    } catch {
      // Token invalide, on le supprime
      const response = NextResponse.next();
      response.cookies.delete("session");
      return response;
    }
  }
  
  return NextResponse.next();
}

/**
 * Configuration du matcher pour le middleware
 * Exclut les fichiers statiques et les routes API internes de Next.js
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
