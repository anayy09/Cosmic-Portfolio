import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const TypedTextContainer = styled.span`
  display: inline-block;
  position: relative;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  font-size: 1em;
  margin-left: 0.5rem;

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

  /* Media query for smaller devices */
  @media (max-width: 768px) {
    font-size: 0.8em; /* Smaller font size for mobile */
    &::after {
      right: -7px; /* Adjust cursor position for smaller font */
    }
  }
`;

const TypedText = ({ strings = [], typingSpeed = 100, deletingSpeed = 50, delayBetween = 2000 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  
  const timeoutRef = useRef(null); // Used to store timeout ID

  // Effect to reset component state when 'strings' prop changes
  useEffect(() => {
    clearTimeout(timeoutRef.current); // Clear any existing animation timeout
    setDisplayText('');
    setCurrentStringIndex(0);
    setIsDeleting(false);
    setIsWaiting(false);
    // The main effect will then start the animation with the new strings
  }, [strings]); // Rerun this effect if the 'strings' array instance changes

  useEffect(() => {
    // If strings array is empty (e.g., after reset or initially), do nothing further.
    if (strings.length === 0) {
      return;
    }
    
    // currentStringIndex is reset to 0 by the above effect when 'strings' changes.
    const currentString = strings[currentStringIndex];
    
    // Main animation logic
    if (isWaiting) {
      timeoutRef.current = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true); // Always move to deleting after waiting
      }, delayBetween);
    } else if (isDeleting) {
      if (displayText.length <= 1) {
        // Finished deleting, move to the next string
        setIsDeleting(false);
        setCurrentStringIndex((prevIndex) => (prevIndex + 1) % strings.length);
      } else {
        // Continue deleting
        timeoutRef.current = setTimeout(() => {
          setDisplayText((prevText) => prevText.slice(0, -1));
        }, deletingSpeed);
      }
    } else { // Typing
      if (displayText === currentString) {
        // Finished typing the current string, start waiting
        setIsWaiting(true);
      } else {
        // Continue typing
        timeoutRef.current = setTimeout(() => {
          setDisplayText(currentString.slice(0, displayText.length + 1));
        }, typingSpeed);
      }
    }
    
    // Cleanup function to clear timeout if dependencies change or component unmounts
    return () => clearTimeout(timeoutRef.current);
    
  }, [displayText, isDeleting, currentStringIndex, isWaiting, strings, typingSpeed, deletingSpeed, delayBetween]);
  
  return <TypedTextContainer>{displayText}</TypedTextContainer>;
};

export default TypedText;