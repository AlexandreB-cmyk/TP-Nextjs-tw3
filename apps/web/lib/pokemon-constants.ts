// Shared constants for Pokemon-related components

// Type colors map for badges and styling
export const typeColors: Record<string, string> = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-500",
  psychic: "bg-pink-500",
  ice: "bg-cyan-500",
  dragon: "bg-indigo-500",
  dark: "bg-slate-800",
  fairy: "bg-rose-400",
  normal: "bg-gray-400",
  fighting: "bg-orange-700",
  flying: "bg-sky-400",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  rock: "bg-stone-500",
  bug: "bg-lime-500",
  ghost: "bg-violet-700",
  steel: "bg-slate-400",
};

// All Pokemon types
export const pokemonTypes = [
  'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark',
  'fairy', 'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel'
] as const;

// Damage class colors for moves
export const damageClassColors: Record<string, string> = {
  physical: "bg-orange-500",
  special: "bg-blue-500",
  status: "bg-gray-500",
};

// Available damage classes
export const damageClasses = ['physical', 'special', 'status'] as const;

// Available generations
export const generations = [
  'generation-i',
  'generation-ii',
  'generation-iii',
  'generation-iv',
  'generation-v',
  'generation-vi',
  'generation-vii',
  'generation-viii',
  'generation-ix',
] as const;

// Berry firmness levels
export const firmnessLevels = [
  'very-soft', 'soft', 'hard', 'very-hard', 'super-hard'
] as const;

// Utility function to format names (capitalize and replace hyphens with spaces)
export function formatName(name: string): string {
  return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Utility function to format generation names
export function formatGeneration(name: string): string {
  return name.replace(/-/g, ' ').replace('generation', 'Génération');
}
