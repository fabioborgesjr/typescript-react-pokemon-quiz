import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Question, QuizState, UserAnswer } from "../../types";

export const fetchPokemons = createAsyncThunk(
  "quiz/fetchPokemons",
  async () => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
    const data = await response.json();
    return data.results;
  },
);

const initialState: QuizState = {
  questions: [],
  answers: [],
  pokemons: [],
  status: "idle",
  error: null,
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
      state.answers = [];
    },
    addAnswer: (state, action: PayloadAction<UserAnswer>) => {
      state.answers.push(action.payload);
    },
    updateQuestion: (
      state,
      action: PayloadAction<{
        questionIdx: number;
        updatedQuestion: Question;
      }>,
    ) => {
      state.questions[action.payload.questionIdx] =
        action.payload.updatedQuestion;
    },
    deleteQuestion: (state, action: PayloadAction<number>) => {
      state.questions.splice(action.payload, 1);
    },
    getAllQuestions: (state, action: PayloadAction<void>) => state,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPokemons.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchPokemons.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.pokemons = action.payload;
    });
    builder.addCase(fetchPokemons.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message ?? "An error occurred";
    });
  },
});

export const {
  addQuestion,
  addAnswer,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
} = quizSlice.actions;
export default quizSlice.reducer;
