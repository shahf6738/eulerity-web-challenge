import { createContext, useContext, useState } from "react";

interface SelectionContextType {
  selectedPets: string[];
  togglePetSelection: (title: string) => void;
  clearSelection: () => void;
  selectAllPets: (titles: string[]) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined,
);

export const SelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedPets, setSelectedPets] = useState<string[]>([]);

  const togglePetSelection = (title: string) => {
    setSelectedPets((prev) => {
      if (prev.includes(title)) {
        return prev.filter((item) => item !== title);
      }

      return [...prev, title];
    });
  };

  const clearSelection = () => {
    setSelectedPets([]);
  };

  const selectAllPets = (titles: string[]) => {
    setSelectedPets(titles);
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedPets,
        togglePetSelection,
        clearSelection,
        selectAllPets,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error("useSelection must be used inside SelectionProvider");
  }

  return context;
};
