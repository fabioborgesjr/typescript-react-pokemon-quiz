import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchPokemons } from '../../features/quiz/quizSlice';
import { AddQuestionForm } from '../features/AddQuestionForm';
import { Button } from '../styled/FormStyles';

export const Quiz: React.FC = () => {
    const dispatch = useAppDispatch();
    const questions = useAppSelector((state) => state.quiz.questions);
    const pokemons = useAppSelector((state) => state.quiz.pokemons);
    const [openAddModal, setOpenAddModal] = useState(false);

    useEffect(() => {
        dispatch(fetchPokemons());
    }, [dispatch]);

    const handleAddModal = useCallback(() => {
        setOpenAddModal(!openAddModal);
    }, [openAddModal]);

    console.log({ questions, pokemons, openAddModal });

    return (
        <div>
            <h1>Make Your Own Pokemon Quiz</h1>

            {Boolean(questions.length > 0) && (
                <div style={{ paddingBottom: "1rem" }}>
                    <h2>Current Questions:</h2>
                    {questions.map((question, index) => (
                        <p><strong key={question.questionText + index}>{index + 1}. {question.questionText}</strong></p>
                    ))}
                </div>
            )}

            <Button onClick={handleAddModal}>{questions.length ? "Add question" : "Start now!"}</Button>

            <AddQuestionForm isOpen={openAddModal} onClose={handleAddModal} />
        </div>
    );
};
