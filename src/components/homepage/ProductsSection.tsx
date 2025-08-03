import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BANKING_PRODUCTS } from '@/types/accountTypes';
import { CreditCard, Landmark, Smartphone, TrendingUp } from 'lucide-react';

const sectionIcons = {
  'Global Accounts': Landmark,
  'Global Cards': CreditCard,
  'International Financing': TrendingUp,
  'Digital Banking Excellence': Smartphone
};

export function ProductsSection() {
  const navigate = useNavigate();

  const handleLearnMore = (productName: string) => {
    // Navigate based on product type
    const productLower = productName.toLowerCase();
    if (productLower.includes('savings') || productLower.includes('current') || productLower.includes('personal')) {
      navigate('/personal');
    } else if (productLower.includes('business') || productLower.includes('corporate')) {
      navigate('/business');
    } else if (productLower.includes('card') || productLower.includes('credit')) {
      navigate('/personal/credit-cards');
    } else if (productLower.includes('loan')) {
      navigate('/personal/loans');
    } else if (productLower.includes('deposit')) {
      navigate('/personal/fixed-deposits');
    } else {
      navigate('/about');
    }
  };

  const handleExploreCategory = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('global accounts')) {
      navigate('/personal');
    } else if (categoryLower.includes('cards')) {
      navigate('/personal/credit-cards');
    } else if (categoryLower.includes('financing')) {
      navigate('/business');
    } else if (categoryLower.includes('digital')) {
      navigate('/digital/mobile');
    } else {
      navigate('/about');
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-banking-dark mb-4">
            Our Products & Services
          </h2>
          <p className="text-xl text-banking-gray max-w-3xl mx-auto">
            Discover our comprehensive range of banking products designed to meet your financial goals 
            and support your journey to prosperity.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {BANKING_PRODUCTS.map((category, categoryIndex) => {
            const IconComponent = sectionIcons[category.category as keyof typeof sectionIcons] || Landmark;

            return (
              <Card key={categoryIndex} className="shadow-card-banking bg-gradient-card border-banking-gold/20">
                <CardHeader className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-banking-gold/10 rounded-lg">
                      <IconComponent className="h-8 w-8 text-banking-gold" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-banking-dark">
                      {category.category}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    {category.items.map((product, productIndex) => (
                      <div 
                        key={productIndex}
                        className="flex items-start justify-between p-4 bg-white/50 rounded-lg border border-banking-gold/10 hover:shadow-md transition-all hover:bg-white/70"
                      >
                        <div className="space-y-1">
                          <h4 className="font-semibold text-banking-dark">{product.name}</h4>
                          <p className="text-sm text-banking-gray">{product.description}</p>
                        </div>
                        <Button
                          variant="banking-outline"
                          size="sm"
                          onClick={() => handleLearnMore(product.name)}
                        >
                          Learn More
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-banking-gold/20">
                    <Button
                      variant="banking"
                      className="w-full"
                      onClick={() => handleExploreCategory(category.category)}
                    >
                      Explore All {category.category}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Product */}
        <div className="mt-20">
          <Card className="bg-gradient-banking text-banking-dark shadow-banking border-0">
            <CardContent className="p-12 text-center">
              <div className="max-w-4xl mx-auto space-y-6">
                <h3 className="text-3xl font-bold">
                  High-Yielding Fixed Deposits
                </h3>
                <p className="text-xl opacity-90">
                  Earn up to 16% per annum with UBAS Financial Trust's Global Fixed Deposit.
                  Invest $10M–$100M for 90 days and enjoy high returns.
                  Secure and grow your wealth today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-banking-dark hover:bg-white/90"
                    onClick={() => navigate('/personal/fixed-deposits')}
                  >
                    Calculate Returns
                  </Button>
                  <Button
                    variant="banking-outline"
                    size="lg"
                    className="border-banking-dark text-banking-dark hover:bg-banking-dark hover:text-banking-gold"
                    onClick={() => navigate('/open-account?type=personal')}
                  >
                    Invest Now
                  </Button>
                </div>
                <div className="flex justify-center space-x-8 pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">16%</div>
                    <div className="text-sm opacity-75">Interest Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">90</div>
                    <div className="text-sm opacity-75">Days Minimum</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">$10M</div>
                    <div className="text-sm opacity-75">Minimum Investment</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}