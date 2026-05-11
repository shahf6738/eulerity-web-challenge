import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { usePets } from "../hooks/usePets";
import PetCard from "../components/PetCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSelection } from "../context/SelectionContext";

const PageContainer = styled.div`
  padding: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  flex: 1;
  height: 56px;
  padding: 0 20px;
  border: 1px solid #dbe4ff;
  border-radius: 16px;
  font-size: 16px;
  background: white;
  transition: 0.2s ease;
  outline: none;

  &:focus {
    border-color: #94a3b8;
    box-shadow: 0 0 0 4px rgba(148, 163, 184, 0.15);
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: stretch;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SortDropdownWrapper = styled.div`
  position: relative;
  min-width: 200px;
`;

const SortButton = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 18px;
  border: 1px solid #c7d2fe;
  background: white;
  padding: 0 22px;
  font-size: 18px;
  font-weight: 500;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #94a3b8;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 72px;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 16px;
  border: 1px solid #dbe4ff;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  z-index: 20;
`;

const DropdownItem = styled.button<{ active?: boolean }>`
  width: 100%;
  border: none;
  background: ${({ active }) => (active ? "#eef2ff" : "white")};
  padding: 16px 20px;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  color: #0f172a;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
  padding: 18px 22px;
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  flex-wrap: wrap;
`;

const SelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;

const InfoBadge = styled.div`
  background: #f8fafc;
  color: #0f172a;
  border: 1px solid #dbe4ff;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  background: #0f172a;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: #1e293b;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 340px));
  gap: 28px;
  justify-content: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #64748b;
  text-align: center;
`;

const EmptyTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 12px;
  color: #0f172a;
`;

const EmptyText = styled.p`
  font-size: 16px;
`;

const HomePage = () => {
  const { pets, loading, error } = usePets();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [visibleCount, setVisibleCount] = useState(8);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // filteredPets function
  const filteredPets = pets
    .filter((pet) =>
      `${pet.title} ${pet.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title);
      }

      return b.title.localeCompare(a.title);
    });

  // visiblePets function
  const visiblePets = filteredPets.slice(0, visibleCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && visibleCount < filteredPets.length) {
          setVisibleCount((prev) => prev + 8);
        }
      },
      {
        threshold: 1,
      },
    );

    const currentLoader = loaderRef.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [visibleCount, filteredPets.length]);

  const { selectedPets, togglePetSelection, clearSelection, selectAllPets } =
    useSelection();

  // downloadSelectedImages function
  const downloadSelectedImages = async () => {
    for (const selectedTitle of selectedPets) {
      const pet = pets.find((item) => item.title === selectedTitle);

      if (!pet) continue;

      try {
        const response = await fetch(pet.url);

        const blob = await response.blob();

        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = `${pet.title}.jpg`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Download failed", error);
      }
    }
  };

  // Loading logic
  if (loading) return <LoadingSpinner />;

  // Error logic
  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <PageContainer>
      <Title>Eulerity Pets</Title>

      <Toolbar>
        <SearchInput
          type="text"
          placeholder="Search pets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <SortDropdownWrapper>
          <SortButton onClick={() => setIsSortOpen((prev) => !prev)}>
            {sortOrder === "asc" ? "Ascending" : "Descending"}

            <span>{isSortOpen ? "▲" : "▼"}</span>
          </SortButton>

          {isSortOpen && (
            <DropdownMenu>
              <DropdownItem
                active={sortOrder === "asc"}
                onClick={() => {
                  setSortOrder("asc");
                  setIsSortOpen(false);
                }}
              >
                Ascending
              </DropdownItem>

              <DropdownItem
                active={sortOrder === "desc"}
                onClick={() => {
                  setSortOrder("desc");
                  setIsSortOpen(false);
                }}
              >
                Descending
              </DropdownItem>
            </DropdownMenu>
          )}
        </SortDropdownWrapper>
      </Toolbar>

      <ToolbarActions>
        <SelectionInfo>
          <InfoBadge>{selectedPets.length} selected</InfoBadge>

          <InfoBadge>
            {(selectedPets.length * 2.5).toFixed(1)} MB estimated
          </InfoBadge>
        </SelectionInfo>

        <ButtonGroup>
          <ActionButton
            onClick={() => selectAllPets(filteredPets.map((pet) => pet.title))}
          >
            Select All
          </ActionButton>

          <ActionButton onClick={clearSelection}>Clear Selection</ActionButton>

          <ActionButton onClick={downloadSelectedImages}>
            Download Selected
          </ActionButton>
        </ButtonGroup>
      </ToolbarActions>

      {filteredPets.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No pets found</EmptyTitle>

          <EmptyText>Try searching with a different keyword.</EmptyText>
        </EmptyState>
      ) : (
        <Grid>
          {visiblePets.map((pet) => (
            <PetCard
              key={pet.title}
              pet={pet}
              isSelected={selectedPets.includes(pet.title)}
              onToggleSelect={togglePetSelection}
            />
          ))}
        </Grid>
      )}

      {filteredPets.length > 0 && (
        <div ref={loaderRef} style={{ height: "20px" }} />
      )}
    </PageContainer>
  );
};

export default HomePage;
