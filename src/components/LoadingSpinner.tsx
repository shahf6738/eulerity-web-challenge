import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Spinner = styled.div`
  width: 56px;
  height: 56px;
  border: 5px solid #dbe4ff;
  border-top-color: #0f172a;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Text = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #334155;
`;

const LoadingSpinner = () => {
  return (
    <Container>
      <Spinner />
      <Text>Loading pets...</Text>
    </Container>
  );
};

export default LoadingSpinner;
