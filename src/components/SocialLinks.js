import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaRss, FaFilePdf } from 'react-icons/fa';

const SocialLinksContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
  align-items: center;
  height: 100%;
  justify-content: flex-start;
`;

const SocialLink = styled(motion.a)`
  color: ${props => props.theme.colors.light};
  font-size: 1.75rem;
  transition: ${props => props.theme.transitions.standard};
  align-self: center;
  margin-top: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateY(-3px);
  }
`;

const CvButton = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  background: transparent;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.3s ease;
  max-width: 200px;
  
  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  &:hover {
    background: rgba(66, 133, 244, 0.1);
    color: ${props => props.theme.colors.primary};
    transform: translateY(-3px);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0.6rem 1rem;
    font-size: 1rem;
    max-width: 180px;
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

const SocialLinks = ({ github, linkedin, email, blog, cv }) => {
  const allLinks = [];

  if (github) allLinks.push({ type: 'social', url: github, icon: <FaGithub />, label: "GitHub" });
  if (linkedin) allLinks.push({ type: 'social', url: linkedin, icon: <FaLinkedin />, label: "LinkedIn" });
  if (email) allLinks.push({ type: 'social', url: `mailto:${email}`, icon: <FaEnvelope />, label: "Email" });
  if (blog) allLinks.push({ type: 'social', url: blog, icon: <FaRss />, label: "Blog" });
  if (cv) allLinks.push({ type: 'cv', url: cv, label: "CV" });

  return (
    <SocialLinksContainer>
      {allLinks.map((link, i) => {
        if (link.type === 'cv') {
          // Check if CV link is internal (starts with /) or external
          const isInternalLink = link.url.startsWith('/');
          
          return (
            <CvButton
              key={link.label}
              aria-label={link.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: (allLinks.length + 0.5 + i * 0.1), type: "spring", stiffness: 100 } }}
              whileHover={{ y: -3, transition: { type: "spring", stiffness: 300 } }}
              whileTap={{ y: 0 }}
            >
              {isInternalLink ? (
                <Link to={link.url}>
                  View CV <FaFilePdf style={{ marginLeft: '0.5rem' }} />
                </Link>
              ) : (
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  View CV <FaFilePdf style={{ marginLeft: '0.5rem' }} />
                </a>
              )}
            </CvButton>
          );
        } else { // 'social'
          // Calculate delay for social links based on their original position
          const socialLinkIndex = allLinks.filter(l => l.type === 'social').findIndex(sl => sl.label === link.label);
          return (
            <SocialLink
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              custom={socialLinkIndex}
              variants={iconVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              {link.icon}
            </SocialLink>
          );
        }
      })}
    </SocialLinksContainer>
  );
};

export default SocialLinks;