import type { Pet } from "../types/pet";

const PETS_API_URL = "https://eulerity-hackathon.appspot.com/pets";

export const fetchPets = async (): Promise<Pet[]> => {
  const response = await fetch(PETS_API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch pets");
  }

  return response.json();
};
