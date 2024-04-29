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
        <div className="container mx-auto px-4 flex items-center justify-center h-screen">
            <div className="bg-emerald-100 shadow-md rounded-lg p-8 max-w-md w-1/2">
                <h1 className='mb-8'>Make Your Own Pokemon Quiz</h1>

                {Boolean(questions.length > 0) && (
                    <div className='mb-8'>
                        <h2 className='mb-1'>Current Questions:</h2>
                        {questions.map((question, index) => (
                            <p key={question.questionText + index}><strong>{index + 1}. {question.questionText}</strong></p>
                        ))}
                    </div>
                )}

                <Button onClick={handleAddModal}>{questions.length ? "Add question" : "Add first question now!"}</Button>

                <AddQuestionForm isOpen={openAddModal} onClose={handleAddModal} />
            </div>
        </div>
    );
};

export default Quiz;
