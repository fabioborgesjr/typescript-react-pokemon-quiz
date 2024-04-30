import React, { useState, useEffect } from 'react';
import { Section, Input, Select, Button, Label } from '../styled/FormStyles';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addQuestion, updateQuestion } from '../../features/quiz/quizSlice';
import { fetchPokemons } from '../../features/quiz/quizSlice';
import { Modal } from '../modal';
import { CheckboxContainer, CheckboxInput, CheckboxLabel } from '../styled/FormStyles';
import { Pokemon, Question, QuestionFormProps } from '../../types';



const getPokemonOptionsFromQuestion = (options: any[]): Pokemon[] => {
    return options.map(({ option: pokemon }) => pokemon)
}

const getCorrectPokemonFromQuestion = (options: any[]): Pokemon => {
    return options.filter((option) => option.isCorrect)[0].option
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ isOpen, onClose, question, questionIdx }) => {
    const [questionText, setQuestionText] = useState<string>(question?.questionText ?? '');
    const [correctOption, setCorrectOption] = useState<Pokemon | null>(question?.answerOptions ? getCorrectPokemonFromQuestion(question.answerOptions) : null);
    const [options, setOptions] = useState<Pokemon[]>(question?.answerOptions ? getPokemonOptionsFromQuestion(question?.answerOptions) : []);
    const [numOptionsAdded, setNumOptionsAdded] = useState<number>(question?.answerOptions?.length ?? 0);
    const dispatch = useAppDispatch();
    const pokemons = useAppSelector((state) => state.quiz.pokemons);

    console.log({ correctOption, numOptionsAdded, options, question })

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
            const question: Question = {
                questionText,
                answerOptions: options.map((option) => ({ option, isCorrect: option.name === correctOption?.name })),
            };
            dispatch(addQuestion(question));
            handleModalClose()
        }
    };

    const handleUpdateQuestion = () => {
        if (options.length === 3 && questionIdx !== undefined) {
            const updatedQuestion: Question = {
                questionText,
                answerOptions: options.map((option) => ({ option, isCorrect: option.name === correctOption?.name })),
            };
            dispatch(updateQuestion({ questionIdx, updatedQuestion }));
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
                <h1>Add question</h1>
                <Label htmlFor="question">Question sentence:</Label>
                <Input id='question' type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder='What is the strongest Pokemon?' />

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

                <Button onClick={question ? handleUpdateQuestion : handleAddQuestion} disabled={numOptionsAdded !== 3 || questionText.length < 10 || !correctOption} style={{ marginTop: "1rem" }}>Save Question</Button>
            </Section>
        </Modal>
    );
};
