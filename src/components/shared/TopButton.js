import { faArrowAltCircleUp } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styled from "styled-components";

function TopButton() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    scrolled > 200 ? setVisible(true) : setVisible(false);
  };

  window.addEventListener('scroll', toggleVisible);

  return (
    <Button onClick={scrollToTop} style={{ display: visible ? 'inline' : 'none' }}>
      <FontAwesomeIcon icon={faArrowAltCircleUp} />
    </Button>
  )
}

export default TopButton;

const Button = styled.div`
    position: fixed; 
    width: 100%;
    left: 92%;
    bottom: 10px;
    height: 85px;
    cursor: pointer;
    z-index: 1;
    svg{
      font-size: 35px;
      }
`