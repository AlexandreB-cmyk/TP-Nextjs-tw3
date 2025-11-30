import { PokeAPI } from "@workspace/pokeapi";
import { PokemonSearch } from "@/components/PokemonSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@workspace/ui/components/badge";

// Helper to get ID from URL
function getIdFromUrl(url: string): string {
  return url.split('/').filter(Boolean).pop() || '';
}

export default async function PokemonPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const query = q || '';
  const page = Number(pageParam) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  let pokemonList = [];
  
  if (query) {
    // Search mode (client filters locally for now as per my implementation)
    pokemonList = await PokeAPI.searchPokemonByName(query);
  } else {
    // Pagination mode
    const data = await PokeAPI.listPokemon(limit, offset);
    pokemonList = data.results;
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <Title level="h1">Pokédex</Title>
        <Text size="lg" className="max-w-2xl">
          Explorez le monde des Pokémon via notre API intégrée. 
          Utilisez la recherche pour filtrer par nom.
        </Text>
        <PokemonSearch />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemonList.map((p) => {
          const id = getIdFromUrl(p.url);
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          
          return (
            <Link href={`/pokemon/${p.name}`} key={p.name} className="group">
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden border-muted">
                <CardHeader className="p-4 bg-muted/20 group-hover:bg-muted/40 transition-colors">
                    <div className="relative w-full aspect-square">
                        <Image 
                            src={imageUrl} 
                            alt={p.name}
                            fill
                            className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-4 text-center">
                  <span className="text-xs font-mono text-muted-foreground">#{id.padStart(3, '0')}</span>
                  <CardTitle className="capitalize mt-1">{p.name}</CardTitle>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      
      {pokemonList.length === 0 && (
        <div className="text-center py-20">
            <Text>Aucun Pokémon trouvé pour "{query}"</Text>
        </div>
      )}
    </div>
  );
}
