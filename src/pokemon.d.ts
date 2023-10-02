import * as React from 'react';
export type Pokemon = {
    name: string;
    number: string;
    image: string;
    attacks: {
        special: Array<{
            name: string;
            type: string;
            damage: number | string;
        }>;
    };
    fetchedAt: string;
};
declare function fetchPokemon(name: string, delay?: number): Promise<any>;
declare function PokemonInfoFallback({ name }: {
    name: string;
}): import("react/jsx-runtime").JSX.Element;
declare function PokemonDataView({ pokemon }: {
    pokemon: Pokemon;
}): import("react/jsx-runtime").JSX.Element;
declare function PokemonForm({ pokemonName: externalPokemonName, initialPokemonName, onSubmit, }: {
    pokemonName?: string;
    initialPokemonName?: string;
    onSubmit: (newPokemonName: string) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function ErrorFallback({ error, resetErrorBoundary, }: {
    error: Error;
    resetErrorBoundary: () => void;
}): import("react/jsx-runtime").JSX.Element;
declare function PokemonErrorBoundary(props: {
    onReset: () => void;
    resetKeys: Array<string>;
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { PokemonInfoFallback, PokemonForm, PokemonDataView, fetchPokemon, PokemonErrorBoundary, };
