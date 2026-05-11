import { useEffect, useState } from "react";
import { fetchPets } from "../api/petsApi";
import type { Pet } from "../types/pet";

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);

        const data = await fetchPets();

        setPets(data);
      } catch (err) {
        setError("Something went wrong while fetching pets.");
        console.log("error", err);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  return {
    pets,
    loading,
    error,
  };
};
