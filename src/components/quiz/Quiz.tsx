import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchPokemons, deleteQuestion, addAnswer } from '../../features/quiz/quizSlice';
import { QuestionForm } from '../features/QuestionForm';
import { Button, Label, Section } from '../styled/FormStyles';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import PikachuImg from "../../assets/img/pikachu-2.png"
import PikachuFinalImg from "../../assets/img/pikachu-final.png"
import { Question } from '../../types';

export const Quiz: React.FC = () => {
    const dispatch = useAppDispatch();
    const questions = useAppSelector((state) => state.quiz.questions);
    const answers = useAppSelector((state) => state.quiz.answers);
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | undefined>();
    const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number | undefined>();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [playingQuestionIdx, setPlayingQuestionIdx] = useState<number>(0);
    const [showResult, setShowResult] = useState<boolean>(false)

    useEffect(() => {
        dispatch(fetchPokemons());
    }, [dispatch]);

    const handleOpenModal = useCallback((e: any, question?: Question, idx?: number) => {
        if (question && idx !== undefined) {
            setSelectedQuestion(question)
            setSelectedQuestionIdx(idx)
        }

        setOpenAddModal(!openAddModal);
    }, [openAddModal]);

    const handleCloseModal = useCallback(() => {
        setOpenAddModal(false);
        setSelectedQuestion(undefined)
        setSelectedQuestionIdx(undefined)
    }, []);

    const handleDeleteQuestion = useCallback((questionIdx: number) => {
        dispatch(deleteQuestion(questionIdx))
    }, [])

    const handlePlay = useCallback(() => {
        setPlayingQuestionIdx(0)
        setIsPlaying(true)
    }, [])

    const handleAddAnswer = useCallback((questionText: string, answer: string) => {
        if (playingQuestionIdx < 2) {
            dispatch(addAnswer({ questionText, answer }))
            setPlayingQuestionIdx(playingQuestionIdx + 1)
        } else {
            setIsPlaying(false)
            setPlayingQuestionIdx(0)
            setShowResult(true)
        }
    }, [playingQuestionIdx])

    const getUserRightAnswers = useCallback(() => {
        let rightAnswers: number = 0

        questions.forEach((question) => {
            const answerForQuestion = answers.find((answer) => {
                return answer.questionText === question.questionText
            })

            const gotAnswer = answerForQuestion && question.answerOptions.find((answer) => {
                return answer.isCorrect && answer.option?.name === answerForQuestion.answer
            })

            if (gotAnswer) {
                rightAnswers = rightAnswers + 1
            }
        })

        return rightAnswers
    }, [questions, answers])

    if (showResult) {
        return (
            <div className='flex items-center flex-col justify-center'>
                <img className='size-36' src={PikachuFinalImg} alt="Pikachu image" />
                <h1 className='my-4 text-xl'>You got {getUserRightAnswers()} answers</h1>
                <Button onClick={() => window.location.reload()}>Restart</Button>
            </div>
        )
    }

    if (isPlaying && playingQuestionIdx !== undefined && questions[playingQuestionIdx]) {
        return (
            <Section>
                <Label htmlFor="question">{questions[playingQuestionIdx].questionText}</Label>

                <div style={{ display: 'flex', alignItems: "center", gap: '0.7rem' }}>
                    {questions[playingQuestionIdx].answerOptions.map((ansOption, index) => (
                        <Button onClick={() => handleAddAnswer(questions[playingQuestionIdx].questionText, ansOption.option?.name || "")} style={{ marginTop: "1rem" }}>{ansOption.option?.name}</Button>
                    ))}
                </div>
            </Section>
        )
    }

    return (
        <>
            <div className='flex items-center flex-col justify-center my-6'>
                <h1 className='mb-6 text-2xl'>Make Your Own Pokemon Quiz</h1>
                <img className='size-24' src={PikachuImg} alt="Pikachu image" />
                <span className='mt-3'>Add three questions to play!</span>
            </div>

            {Boolean(questions.length > 0) && (
                <div className='mb-8'>
                    <h2 className='text-lg mb-4'>Current Questions:</h2>
                    {questions.map((question, index) => (
                        <div key={question.questionText + index} className='bg-white container m-2 py-2 px-4 flex justify-between'>
                            <strong className='flex-initial flex-64'>{index + 1}. {question.questionText}</strong>
                            <div className='flex gap-2'>
                                <PencilIcon onClick={(e) => handleOpenModal(e, question, index)} className="size-6 text-purple-300 cursor-pointer" />
                                <TrashIcon onClick={() => handleDeleteQuestion(index)} className="size-6 text-purple-300 cursor-pointer" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {
                questions.length === 3 ? (
                    <Button className="bg-green-300" onClick={handlePlay}>Play now!</Button>
                ) : (
                    <Button className="bg-blue-300" onClick={handleOpenModal}>{questions.length ? "Add question" : "Add first question now!"}</Button>
                )
            }

            {
                openAddModal && <QuestionForm isOpen={openAddModal} onClose={handleCloseModal} question={selectedQuestion} questionIdx={selectedQuestionIdx} />
            }
        </>
    );
};

export default Quiz;
