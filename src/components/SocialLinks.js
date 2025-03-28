import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaRss } from 'react-icons/fa';

const SocialLinksContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const SocialLink = styled(motion.a)`
  color: ${props => props.theme.colors.light};
  font-size: 1.5rem;
  transition: ${props => props.theme.transitions.standard};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateY(-3px);
  }
`;

const iconVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: i => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }),
  hover: {
    scale: 1.2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const SocialLinks = ({ github, linkedin, email, blog }) => {
  const links = [
    { url: github, icon: <FaGithub />, label: "GitHub" },
    { url: linkedin, icon: <FaLinkedin />, label: "LinkedIn" },
    { url: `mailto:${email}`, icon: <FaEnvelope />, label: "Email" },
    { url: blog, icon: <FaRss />, label: "Blog" }
  ].filter(link => link.url); // Filter out any undefined links
  
  return (
    <SocialLinksContainer>
      {links.map((link, i) => (
        <SocialLink 
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          custom={i}
          variants={iconVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          {link.icon}
        </SocialLink>
      ))}
    </SocialLinksContainer>
  );
};

export default SocialLinks;