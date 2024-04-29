import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Pokemon {
    name: string;
    url: string;
}

export const fetchPokemons = createAsyncThunk('quiz/fetchPokemons', async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
    const data = await response.json();
    return data.results;
});

interface QuizState {
    questions: { questionText: string; answerOptions: { answerText: string; isCorrect: boolean }[] }[];
    answers: (number | null)[];
    pokemons: Pokemon[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: QuizState = {
    questions: [],
    answers: [],
    pokemons: [],
    status: 'idle',
    error: null
};

export const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        addQuestion: (state, action: PayloadAction<{ questionText: string; answerOptions: { answerText: string; isCorrect: boolean }[] }>) => {
            state.questions.push(action.payload);
            state.answers.push(null); // Initialize selected answers to null for each question
        },
        deleteQuestion: (state, action: PayloadAction<number>) => {
            state.questions.splice(action.payload, 1);
            state.answers.splice(action.payload, 1); // Remove corresponding selected answer
        },
        updateQuestion: (state, action: PayloadAction<{ index: number, updatedQuestion: { questionText: string; answerOptions: { answerText: string; isCorrect: boolean }[] } }>) => {
            state.questions[action.payload.index] = action.payload.updatedQuestion;
        },
        selectAnswer: (state, action: PayloadAction<{ questionIndex: number, answerIndex: number }>) => {
            state.answers[action.payload.questionIndex] = action.payload.answerIndex;
        },
        getAllQuestions: (state, action: PayloadAction<void>) => state,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPokemons.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchPokemons.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.pokemons = action.payload;
        });
        builder.addCase(fetchPokemons.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message ?? 'An error occurred';
        });
    },
});

export const { addQuestion, deleteQuestion, updateQuestion, selectAnswer, getAllQuestions } = quizSlice.actions;
export default quizSlice.reducer;