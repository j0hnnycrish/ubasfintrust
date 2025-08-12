import React from 'react';
import styled from 'styled-components';
import { Card, Button } from 'antd';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 0;
`;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 20px;
  margin-bottom: 3rem;
  box-shadow: 0 20px 40px rgba(220, 38, 38, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.95;
  line-height: 1.6;
  position: relative;
  z-index: 2;
  max-width: 800px;
`;

const SectionTitle = styled.h2`
  color: #dc2626;
  font-size: 2rem;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #dc2626, #991b1b);
    border-radius: 2px;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const ServiceCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: none;
  transition: all 0.3s ease;
  background: white;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 48px rgba(220, 38, 38, 0.15);
  }

  .ant-card-body {
    padding: 2rem;
  }
`;

const ServiceIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const ServiceTitle = styled.h3`
  color: #1f2937;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ServiceDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
`;

const StyledList = styled.ul`
  margin-left: 0;
  padding: 0;
  list-style: none;

  li {
    color: #374151;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    padding-left: 2rem;
    position: relative;
    line-height: 1.6;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #dc2626;
      font-weight: bold;
      font-size: 1.2rem;
    }

    strong {
      color: #1f2937;
      font-weight: 600;
    }
  }
`;

const CTASection = styled.div`
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  margin-top: 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23dc2626" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23dc2626" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="%23dc2626" opacity="0.1"/><circle cx="10" cy="90" r="1" fill="%23dc2626" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  }
`;

const CTATitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
`;

const CTAText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  position: relative;
  z-index: 2;
`;

const CTAButton = styled(Button)`
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border: none;
  height: 50px;
  padding: 0 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  position: relative;
  z-index: 2;

  &:hover {
    background: linear-gradient(135deg, #991b1b, #7f1d1d);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
  }
`;

const treasuryServices = [
  {
    icon: '💰',
    title: 'Cash Management',
    description: 'Real-time visibility and control over your cash positions with advanced analytics and reporting.'
  },
  {
    icon: '💧',
    title: 'Liquidity Solutions',
    description: 'Sweeps, pooling, and automated investment options to optimize your working capital.'
  },
  {
    icon: '🔄',
    title: 'Payments & Collections',
    description: 'Domestic and international payment solutions with multi-currency support.'
  },
  {
    icon: '🛡️',
    title: 'Risk Management',
    description: 'FX, interest rate, and commodity hedging to protect your business from market volatility.'
  },
  {
    icon: '📋',
    title: 'Trade Finance',
    description: 'Letters of credit, guarantees, and supply chain finance solutions for global trade.'
  },
  {
    icon: '📊',
    title: 'Treasury Analytics',
    description: 'Advanced reporting and analytics to make informed financial decisions.'
  }
];

const CorporateTreasury: React.FC = () => (
  <PageWrapper>
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <Title>Corporate Treasury Services</Title>
        <Subtitle>
          Optimize your company’s liquidity, manage risk, and maximize returns with our advanced treasury solutions.
          UBAS FinTrust partners with you to deliver secure, efficient, and innovative treasury management for your business.
        </Subtitle>
      </HeroSection>

      {/* Treasury Solutions */}
      <SectionTitle>Our Treasury Solutions</SectionTitle>
      <ServicesGrid>
        {treasuryServices.map((service, index) => (
          <ServiceCard key={index} bordered={false}>
            <ServiceIcon>{service.icon}</ServiceIcon>
            <ServiceTitle>{service.title}</ServiceTitle>
            <ServiceDescription>{service.description}</ServiceDescription>
          </ServiceCard>
        ))}
      </ServicesGrid>

      {/* Why Choose UBAS */}
      <SectionTitle>Why Choose UBAS FinTrust?</SectionTitle>
      <StyledList>
        <li><strong>Cutting-edge digital treasury platform</strong> - State-of-the-art technology for seamless operations</li>
        <li><strong>Expert advisory and support</strong> - Dedicated treasury specialists at your service</li>
        <li><strong>Global reach, local expertise</strong> - Worldwide presence with local market knowledge</li>
        <li><strong>Secure, compliant, and scalable solutions</strong> - Bank-grade security with regulatory compliance</li>
        <li><strong>24/7 monitoring and support</strong> - Round-the-clock assistance for your treasury operations</li>
        <li><strong>Customizable solutions</strong> - Tailored to meet your specific business requirements</li>
      </StyledList>

      {/* Call to Action */}
      <CTASection>
        <CTATitle>Ready to Transform Your Treasury Operations?</CTATitle>
        <CTAText>
          Contact our treasury specialists today for a personalized consultation and discover how UBAS FinTrust
          can optimize your company's financial operations.
        </CTAText>
        <CTAButton type="primary" size="large">
          Schedule a Consultation
        </CTAButton>
      </CTASection>
    </PageContainer>
  </PageWrapper>
);

export default CorporateTreasury;
