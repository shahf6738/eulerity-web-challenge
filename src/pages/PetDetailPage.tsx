import { useParams } from "react-router-dom";
import styled from "styled-components";
import LoadingSpinner from "../components/LoadingSpinner";
import { usePets } from "../hooks/usePets";

const Container = styled.div`
  min-height: 100vh;
  padding: 40px 24px;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08);
`;

const BackButton = styled.button`
  border: none;
  background: #0f172a;
  color: white;
  height: 48px;
  padding: 0 20px;
  border-radius: 14px;
  cursor: pointer;
  margin-bottom: 28px;
  font-size: 15px;
  font-weight: 600;
  transition: 0.2s ease;

  &:hover {
    background: #1e293b;
    transform: translateY(-1px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 460px;
  object-fit: cover;
  border-radius: 24px;
  margin-bottom: 28px;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const Title = styled.h1`
  font-size: 42px;
  margin-bottom: 18px;
  color: #0f172a;
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.8;
  color: #475569;
`;

const DateText = styled.p`
  margin-top: 24px;
  color: #94a3b8;
  font-size: 14px;
`;

const PetDetailPage = () => {
  const { title } = useParams();

  const { pets, loading, error } = usePets();

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <h1>{error}</h1>;
  }

  const pet = pets.find(
    (item) => item.title.toLowerCase() === title?.toLowerCase(),
  );

  if (!pet) {
    return <h1>Pet not found</h1>;
  }

  return (
    <Container>
      <ContentWrapper>
        <BackButton onClick={() => window.history.back()}>Back</BackButton>

        <Image src={pet.url} alt={pet.title} />

        <Title>{pet.title}</Title>

        <Description>{pet.description}</Description>

        <DateText>{pet.created}</DateText>
      </ContentWrapper>
    </Container>
  );
};

export default PetDetailPage;
