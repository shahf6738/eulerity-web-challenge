import styled from "styled-components";
import type { Pet } from "../types/pet";
import { useNavigate } from "react-router-dom";

interface PetCardProps {
  pet: Pet;
  isSelected: boolean;
  onToggleSelect: (title: string) => void;
}

const Card = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`;

const PetImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 16px;
  padding-bottom: 56px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 8px;
`;

const Description = styled.p`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
`;

const CheckboxContainer = styled.div`
  position: absolute;
  right: 16px;
  bottom: 16px;
`;

const PetCard = ({ pet, isSelected, onToggleSelect }: PetCardProps) => {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/pets/${encodeURIComponent(pet.title)}`)}>
      <PetImage src={pet.url} alt={pet.title} />

      <Content>
        <Title>{pet.title}</Title>

        <Description>{pet.description}</Description>

        <CheckboxContainer>
          <input
            type="checkbox"
            checked={isSelected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggleSelect(pet.title)}
          />
        </CheckboxContainer>
      </Content>
    </Card>
  );
};

export default PetCard;
