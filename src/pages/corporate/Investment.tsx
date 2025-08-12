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

const InvestmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const InvestmentCard = styled(Card)`
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

const InvestmentIcon = styled.div`
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

const InvestmentTitle = styled.h3`
  color: #1f2937;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const InvestmentDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
`;

const BenefitsList = styled.ul`
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

const investmentOfferings = [
  {
    icon: '💰',
    title: 'Fixed Income & Money Markets',
    description: 'Secure, short- and long-term investment options with guaranteed returns and capital preservation.'
  },
  {
    icon: '📈',
    title: 'Equities & Mutual Funds',
    description: 'Access to local and global markets for capital growth with diversified portfolio options.'
  },
  {
    icon: '🏢',
    title: 'Alternative Investments',
    description: 'Private equity, real estate, and infrastructure funds for sophisticated investors.'
  },
  {
    icon: '⚙️',
    title: 'Structured Products',
    description: 'Customized solutions for risk and return optimization tailored to your specific needs.'
  },
  {
    icon: '🌱',
    title: 'ESG Investments',
    description: 'Sustainable and responsible investment opportunities aligned with environmental and social goals.'
  },
  {
    icon: '🎯',
    title: 'Portfolio Management',
    description: 'Professional portfolio management services with active monitoring and rebalancing.'
  }
];

const CorporateInvestment: React.FC = () => (
  <PageWrapper>
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <Title>Corporate Investment Solutions</Title>
        <Subtitle>
          Unlock new growth opportunities with our comprehensive investment solutions for businesses.
          UBAS FinTrust provides access to a wide range of investment products, expert advice, and
          tailored strategies to help your organization achieve its financial objectives.
        </Subtitle>
      </HeroSection>

      {/* Investment Offerings */}
      <SectionTitle>Our Investment Offerings</SectionTitle>
      <InvestmentGrid>
        {investmentOfferings.map((offering, index) => (
          <InvestmentCard key={index} bordered={false}>
            <InvestmentIcon>{offering.icon}</InvestmentIcon>
            <InvestmentTitle>{offering.title}</InvestmentTitle>
            <InvestmentDescription>{offering.description}</InvestmentDescription>
          </InvestmentCard>
        ))}
      </InvestmentGrid>

      {/* Why Choose UBAS */}
      <SectionTitle>Why Choose UBAS FinTrust?</SectionTitle>
      <BenefitsList>
        <li><strong>Dedicated investment advisors</strong> - Expert guidance from seasoned investment professionals</li>
        <li><strong>Global market access</strong> - Comprehensive access to international investment opportunities</li>
        <li><strong>Tailored strategies for your business goals</strong> - Customized investment approaches</li>
        <li><strong>Transparent reporting and analytics</strong> - Clear, detailed performance reporting</li>
        <li><strong>Risk management expertise</strong> - Advanced risk assessment and mitigation strategies</li>
        <li><strong>Competitive pricing</strong> - Institutional-grade pricing for corporate clients</li>
      </BenefitsList>

      {/* Call to Action */}
      <CTASection>
        <CTATitle>Ready to Optimize Your Corporate Investments?</CTATitle>
        <CTAText>
          Contact our investment specialists today to discuss your corporate investment needs and
          discover how we can help maximize your returns while managing risk.
        </CTAText>
        <CTAButton type="primary" size="large">
          Schedule Investment Consultation
        </CTAButton>
      </CTASection>
    </PageContainer>
  </PageWrapper>
);

export default CorporateInvestment;

