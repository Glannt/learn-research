"use client";

import { create } from "zustand";

type ProgressState = {
  completedLessons: string[];
  triedSimulations: string[];
  savedFormulas: string[];
  quizResults: Record<string, boolean>;
  toggleLesson: (id: string) => void;
  markSimulation: (id: string) => void;
  toggleFormula: (id: string) => void;
  answerQuiz: (id: string, correct: boolean) => void;
};

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

export const useProgressStore = create<ProgressState>((set) => ({
  completedLessons: ["phy-lesson-0", "chem-lesson-0", "phy-lesson-1"],
  triedSimulations: ["pendulum", "atom-model"],
  savedFormulas: ["f-ma", "mole"],
  quizResults: {},
  toggleLesson: (id) => set((state) => ({ completedLessons: toggle(state.completedLessons, id) })),
  markSimulation: (id) =>
    set((state) => ({
      triedSimulations: state.triedSimulations.includes(id) ? state.triedSimulations : [...state.triedSimulations, id]
    })),
  toggleFormula: (id) => set((state) => ({ savedFormulas: toggle(state.savedFormulas, id) })),
  answerQuiz: (id, correct) => set((state) => ({ quizResults: { ...state.quizResults, [id]: correct } }))
}));
