import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

export const Input = styled.input`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
`;

export const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 8px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  color: white;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#007bff')};
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    background-color: ${(props) => (props.disabled ? '#ccc' : '#0056b3')};
  }
`;

export const Label = styled.label`
  align-self: start;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CheckboxInput = styled.input`
  appearance: none;
  width: 24px;
  height: 24px;
  border: 2px solid #ccc;
  border-radius: 4px;
  cursor: pointer;

  &:checked {
    background-color: #007bff;
    border-color: #007bff;
  }

  &:focus {
    outline: none;
  }
`;

export const CheckboxLabel = styled.label`
  color: #333;
`;
