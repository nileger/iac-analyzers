import React from "react";
import styled from "styled-components";
import MainViewHeader from "./MainViewHeader";
import {
  AboutThisProjectBottom,
  AboutThisProjectHeader,
} from "./AboutThisProject";
import DecisiongGuide from "./DecisionGuide";


const MainViewBodyContainer = styled.div`
  overflow-y: auto;
`;

export const BrOnlyOnPc = styled.br`
  @media (max-width: 74rem) {
    display: none;
  }
`;

const MainView: React.FC = () => {

  return (
    <>
      <MainViewHeader />
      <MainViewBodyContainer>
        <DecisiongGuide></DecisiongGuide>
      </MainViewBodyContainer>
      <AboutThisProjectHeader />
      <AboutThisProjectBottom />
    </>
  );
};

export default MainView;
