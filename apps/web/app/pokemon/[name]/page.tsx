import { PokeAPI } from "@workspace/pokeapi";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PokemonDetail({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  let pokemon: any;
  try {
    pokemon = await PokeAPI.pokemon(name);
  } catch (e) {
    notFound();
  }

  // Type colors map (simplified)
  const typeColors: Record<string, string> = {
    fire: "bg-red-500 hover:bg-red-600",
    water: "bg-blue-500 hover:bg-blue-600",
    grass: "bg-green-500 hover:bg-green-600",
    electric: "bg-yellow-500 hover:bg-yellow-600",
    psychic: "bg-pink-500 hover:bg-pink-600",
    ice: "bg-cyan-500 hover:bg-cyan-600",
    dragon: "bg-indigo-500 hover:bg-indigo-600",
    dark: "bg-slate-800 hover:bg-slate-900",
    fairy: "bg-rose-400 hover:bg-rose-500",
    normal: "bg-gray-400 hover:bg-gray-500",
    fighting: "bg-orange-700 hover:bg-orange-800",
    flying: "bg-sky-400 hover:bg-sky-500",
    poison: "bg-purple-500 hover:bg-purple-600",
    ground: "bg-amber-600 hover:bg-amber-700",
    rock: "bg-stone-500 hover:bg-stone-600",
    bug: "bg-lime-500 hover:bg-lime-600",
    ghost: "bg-violet-700 hover:bg-violet-800",
    steel: "bg-slate-400 hover:bg-slate-500",
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/pokemon">
            <Button variant="outline">← Retour au Pokédex</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Image & Basic Info */}
        <div className="space-y-6">
            <Card className="overflow-hidden border-2">
                <div className="bg-muted/30 p-8 flex justify-center items-center aspect-square relative">
                     <Image 
                        src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
                        alt={pokemon.name}
                        fill
                        className="object-contain p-4 drop-shadow-xl"
                        priority
                     />
                </div>
            </Card>
            
            <div className="flex gap-2 justify-center">
                {pokemon.types.map((t: any) => (
                    <Badge 
                        key={t.type.name} 
                        className={`text-white px-4 py-1 text-base capitalize ${typeColors[t.type.name] || 'bg-gray-500'}`}
                    >
                        {t.type.name}
                    </Badge>
                ))}
            </div>
        </div>

        {/* Right Column: Stats & Details */}
        <div className="space-y-8">
            <div>
                <div className="flex items-baseline gap-4">
                    <Title level="h1" className="capitalize mb-2">{pokemon.name}</Title>
                    <span className="text-2xl text-muted-foreground font-mono">#{String(pokemon.id).padStart(3, '0')}</span>
                </div>
                <div className="flex gap-8 mt-4 text-sm">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Taille</span>
                        <span className="font-medium text-lg">{pokemon.height / 10} m</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Poids</span>
                        <span className="font-medium text-lg">{pokemon.weight / 10} kg</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Title level="h3">Statistiques</Title>
                <div className="space-y-3">
                    {pokemon.stats.map((s: any) => (
                        <div key={s.stat.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="capitalize font-medium text-muted-foreground">{s.stat.name.replace('-', ' ')}</span>
                                <span className="font-bold">{s.base_stat}</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary transition-all duration-500" 
                                    style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <Title level="h3">Talents (Abilities)</Title>
                <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map((a: any) => (
                        <Badge key={a.ability.name} variant="secondary" className="capitalize">
                            {a.ability.name.replace('-', ' ')}
                            {a.is_hidden && <span className="ml-1 text-xs opacity-50">(Caché)</span>}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
