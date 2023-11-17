/* eslint-disable prettier/prettier */
import React, {createContext, useState} from 'react';

export const PollContext = createContext();

const PollProvider = ({children}) => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([
    {option: '', vote: 0},
    {option: '', vote: 0},
    {option: '', vote: 0},
    {option: '', vote: 0},
  ]);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    <PollContext.Provider value={{question, setQuestion, answers, setAnswers, showModal, setShowModal, isModalOpen, setIsModalOpen}}>
      {children}
    </PollContext.Provider>
  );
};

export default PollProvider;
