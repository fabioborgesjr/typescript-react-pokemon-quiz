import React, { useState, useEffect } from 'react';
import { Section, Input, Select, Button, Label } from '../styled/FormStyles';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addQuestion } from '../../features/quiz/quizSlice';
import { fetchPokemons, Pokemon } from '../../features/quiz/quizSlice';
import { Modal } from '../modal';
import { CheckboxContainer, CheckboxInput, CheckboxLabel } from '../styled/FormStyles';

interface AddQuestionFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddQuestionForm: React.FC<AddQuestionFormProps> = ({ isOpen, onClose }) => {
    const [questionText, setQuestionText] = useState<string>('');
    const [correctOption, setCorrectOption] = useState<Pokemon | null>(null);
    const [options, setOptions] = useState<Pokemon[]>([]);
    const [numOptionsAdded, setNumOptionsAdded] = useState<number>(0);
    const dispatch = useAppDispatch();
    const pokemons = useAppSelector((state) => state.quiz.pokemons);

    useEffect(() => {
        dispatch(fetchPokemons());
    }, [dispatch]);

    const handleAddOption = () => {
        if (numOptionsAdded < 3) {
            setOptions([...options, pokemons[numOptionsAdded]])
            setNumOptionsAdded(numOptionsAdded + 1);
        }
    };

    const handleCorrectOption = (pokemon: Pokemon) => {
        setCorrectOption(pokemon);
    };

    const updateOption = (pokemonName: string, indexToUpdate: number) => {
        if (options.length > 0) {
            const updatedOptions = options.map(((option, index) => {
                const pokemonOption = pokemons.find((pokemon) => pokemon.name === pokemonName)

                if (pokemonOption && indexToUpdate === index) return pokemonOption

                return option
            }))

            setOptions(updatedOptions)
        }
    }

    const handleAddQuestion = () => {
        if (options.length === 3) {
            const question = {
                questionText,
                answerOptions: options.map((option) => ({ answerText: option.name, isCorrect: option.name === correctOption?.name })),
            };
            dispatch(addQuestion(question));
            handleModalClose()
        }
    };

    const handleFormReset = () => {
        setQuestionText('');
        setOptions([]);
        setNumOptionsAdded(0);
        setCorrectOption(null);
    }

    const handleModalClose = () => {
        handleFormReset()
        onClose()
    }

    console.log(numOptionsAdded !== 3 || questionText.length >= 6)

    return (
        <Modal isOpen={isOpen} onClose={handleModalClose}>
            <Section>
                <Label htmlFor="question">New question to add:</Label>
                <Input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder='Your question sentence should have at least 10 characters' />

                <Label htmlFor="question">Answer options:</Label>

                {numOptionsAdded < 3 && (
                    <Button onClick={handleAddOption}>Add Option</Button>
                )}

                {options.map((option, index) => (
                    <div style={{ display: 'flex', alignItems: "center", gap: '0.7rem' }}>
                        <Select value={option.name} onChange={(e) => updateOption(e.target.value as string, index)}>
                            <option value="" disabled>Select a Pokémon</option>
                            {pokemons.map((pokemon) => (
                                <option key={pokemon.name} value={pokemon.name}>
                                    {pokemon.name}
                                </option>
                            ))}
                        </Select>

                        <CheckboxContainer>
                            <CheckboxInput
                                type="checkbox"
                                checked={correctOption?.name === option.name}
                                onChange={() => handleCorrectOption(option)}
                            />
                            <CheckboxLabel>Is Correct?</CheckboxLabel>
                        </CheckboxContainer>
                    </div>
                ))}

                <Button onClick={handleAddQuestion} disabled={numOptionsAdded !== 3 || questionText.length < 10} style={{ marginTop: "1rem" }}>Save Question</Button>
            </Section>
        </Modal>
    );
};
