import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const TypedTextContainer = styled.span`
  display: inline-block;
  position: relative;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  
  &::after {
    content: '|';
    position: absolute;
    right: -8px;
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const TypedText = ({ strings = [], typingSpeed = 100, deletingSpeed = 50, delayBetween = 2000 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  
  useEffect(() => {
    if (strings.length === 0) return;
    
    let timeout;
    
    if (isWaiting) {
      timeout = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, delayBetween);
      return () => clearTimeout(timeout);
    }
    
    const currentString = strings[currentStringIndex];
    
    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false);
        setCurrentStringIndex((currentStringIndex + 1) % strings.length);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (displayText === currentString) {
        setIsWaiting(true);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(currentString.slice(0, displayText.length + 1));
        }, typingSpeed);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentStringIndex, isWaiting, strings, typingSpeed, deletingSpeed, delayBetween]);
  
  return <TypedTextContainer>{displayText}</TypedTextContainer>;
};

export default TypedText;