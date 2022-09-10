import styled from "styled-components";
import { purpleBackground } from "../../utils/Colors";
import { ReactComponent as DotIcon } from "./assets/DotIcon.svg";
import { ReactComponent as LinkedinIcon } from "./assets/LinkedinIcon.svg";
import { ReactComponent as TwitterIcon } from "./assets/TwitterIcon.svg";
import { ReactComponent as GreyDotIcon } from "./assets/GreyDotIcon.svg";
import { LINKEDIN_URL, TWITTER_URL } from "./MainViewHeader";
import { BrOnlyOnPc } from "./index";

const GITHUB_REPO_IAC_ANALYZER_DECISION_GUIDE = "https://github.com/nileger/iac-analyzers";

const Container = styled.div`
  color: white;
  text-align: center;
  word-break: break-word;
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 1% 8%;
`;

const HeaderContainer = styled(Container)`
  background-color: ${purpleBackground};
  @media (max-width: 74rem) {
    display: grid;
  }
`;

const BottomContainer = styled(Container)`
  @media (max-width: 74rem) {
    justify-content: space-between;
  }
`;

const MainDiv = styled.div`
  @media (min-width: 74rem) {
    width: 70%;
  }
`;

const StyledH4 = styled.h4`
  margin-block-end: 0rem;
`;

const StyledHeadline = styled(StyledH4)`
  font-family: Poppins;
  font-weight: 500;
  font-size: 20px;
`;

const CustomLink = styled.a`
  color: white;
  font-family: Roboto;
  align-self: center;
`;

export const SmallBr = styled.span`
  display: block;
  margin: 10px 0;
`;

const PolicyContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-block-end: 0rem;
  align-items: center;
`;

const CursorPointerWrapper = styled.div`
  cursor: pointer;
`;

const MobileWrapper = styled(PolicyContainer)`
  display: flex-inline;
  @media (max-width: 37rem) {
    display: none;
  }
`;

const PcWrapper = styled(PolicyContainer)`
  display: flex-inline;
  @media (min-width: 37rem) {
    display: none;
  }
`;

const SocialMediaContainer = styled(PolicyContainer)`
  margin: 5px 0;
  cursor: pointer;
  > svg {
    width: 36px;
  }
`;

export const AboutThisProjectBottom: React.FC = () => (
  <BottomContainer>
    <PolicyContainer>
      <div>© Nils Leger 2022</div>
      <MobileWrapper>
        <DotIcon />
        <CursorPointerWrapper
          onClick={() => window.open(GITHUB_REPO_IAC_ANALYZER_DECISION_GUIDE)}
        >
          <div>IaC Analyzer Decision Guide on Github</div>
        </CursorPointerWrapper>
      </MobileWrapper>
    </PolicyContainer>
    <SocialMediaContainer>
      <PcWrapper>
        <LinkedinIcon onClick={() => window.open(LINKEDIN_URL)} />
        <TwitterIcon onClick={() => window.open(TWITTER_URL)} />
        <GreyDotIcon />
      </PcWrapper>
    </SocialMediaContainer>
  </BottomContainer>
);

export const AboutThisProjectHeader: React.FC = () => {
  return (
    <HeaderContainer>
      <MainDiv>
        <StyledHeadline>About this project</StyledHeadline>
        <br />
        <div>
        The IaC Analyzer decision guide helps you to find the best tools for your project!
        </div>
        <br />
        <div style={{ wordBreak: "break-word" }}>
          The IaC Analyzer Decision Guide is an{" "}
          <CustomLink
            href={GITHUB_REPO_IAC_ANALYZER_DECISION_GUIDE}
            target={GITHUB_REPO_IAC_ANALYZER_DECISION_GUIDE}
          >
            open-source
          </CustomLink>{" "}
          site, so please feel free to add more tools or update the capabilities of already included tools.
        </div>
        <br />
        <BrOnlyOnPc />
      </MainDiv>
    </HeaderContainer>
  );
};
