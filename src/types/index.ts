export interface Pokemon {
  name: string;
  url: string;
}

export interface QuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  question?: Question;
  questionIdx?: number;
}

export interface AnswerOption {
  option: Pokemon | null;
  isCorrect: boolean;
}

export interface Question {
  questionText: string;
  answerOptions: AnswerOption[];
}

export interface UserAnswer {
  answer: string;
  questionText: string;
}

export interface QuizState {
  questions: Question[];
  answers: UserAnswer[];
  pokemons: Pokemon[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
