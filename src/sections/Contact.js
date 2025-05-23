import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaPaperPlane, FaCheck, FaTimes } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const ContactSection = styled.section`
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 2rem 2rem;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  text-align: center;
  margin-bottom: 1rem;
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const ContactContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ContactHeading = styled.h3`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.light};
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.5rem;
  }
`;

const ContactText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ContactLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-top: 0;
  }
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.colors.light};
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.5rem;
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateX(5px);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1rem;
    svg {
      font-size: 1.25rem;
    }
  }
`;

const ContactFormContainer = styled.div`
  background: rgba(10, 25, 47, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(66, 133, 244, 0.3);
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.medium};
  
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 10px 30px rgba(66, 133, 244, 0.2);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 1rem;
  color: ${props => props.theme.colors.light};
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.9rem;
  }
`;

const FormInput = styled.input`
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: ${props => props.theme.colors.light};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem;
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: ${props => props.theme.colors.light};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem;
    min-height: 100px;
  }
`;

const SubmitButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.dark};
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary}CC;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
    max-width: 200px;
    margin: 0 auto;
  }
`;

const FormStatus = styled(motion.div)`
  padding: 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &.success {
    background: rgba(46, 213, 115, 0.2);
    color: #2ed573;
  }
  
  &.error {
    background: rgba(255, 71, 87, 0.2);
    color: #ff4757;
  }
`;

const Contact = ({ email, linkedin, github }) => {
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();
  
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.2 });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      
      setFormStatus({ type: 'success', message: 'Message sent successfully! I\'ll get back to you soon.' });
      formRef.current.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      setFormStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  return (
    <ContactSection id="contact" ref={ref}>
      <SectionTitle
        variants={titleVariants}
        initial="hidden"
        animate={controls}
      >
        Get In Touch
      </SectionTitle>
      
      <SectionSubtitle
        variants={titleVariants}
        initial="hidden"
        animate={controls}
      >
        Have a question or want to work together? Feel free to reach out!
      </SectionSubtitle>
      
      <ContactContainer
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <ContactInfo>
          <motion.div variants={itemVariants}>
            <ContactHeading>Let's Connect</ContactHeading>
            <ContactText>
              I'm always open to new opportunities, collaborations, or just a friendly chat about technology and innovation. Don't hesitate to reach out through the form or via any of the channels below.
            </ContactText>
          </motion.div>
          
          <ContactLinks>
            <motion.div variants={itemVariants}>
              <ContactLink href={`mailto:${email}`}>
                <FaEnvelope />
                {email}
              </ContactLink>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ContactLink href={linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
                LinkedIn Profile
              </ContactLink>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ContactLink href={github} target="_blank" rel="noopener noreferrer">
                <FaGithub />
                GitHub Profile
              </ContactLink>
            </motion.div>
          </ContactLinks>
        </ContactInfo>
        
        <motion.div variants={itemVariants}>
          <ContactFormContainer>
            <ContactForm ref={formRef} onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Your Name"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="your.email@example.com"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="subject">Subject</FormLabel>
                <FormInput
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  placeholder="What is this regarding?"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="message">Message</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  required
                  placeholder="Your message here..."
                />
              </FormGroup>
              
              <SubmitButton
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    Send Message <FaPaperPlane />
                  </>
                )}
              </SubmitButton>
              
              {formStatus && (
                <FormStatus
                  className={formStatus.type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {formStatus.type === 'success' ? <FaCheck /> : <FaTimes />}
                  {formStatus.message}
                </FormStatus>
              )}
            </ContactForm>
          </ContactFormContainer>
        </motion.div>
      </ContactContainer>
    </ContactSection>
  );
};

export default Contact;