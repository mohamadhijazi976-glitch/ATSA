import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
    loadRelatedProducts();
  }, [slug]);

  const loadProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error loading product:', error);
    } else {
      setProduct(data);
    }
    setLoading(false);
  };

  const loadRelatedProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .neq('slug', slug)
      .order('order_index')
      .limit(4);

    if (error) {
      console.error('Error loading related products:', error);
    } else {
      setRelatedProducts(data || []);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#3d4f5c] mb-4">Product Not Found</h1>
          <Link to="/" className="text-[#3d4f5c] hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-white/80 backdrop-blur-sm shadow-sm">
        <nav className="container mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#3d4f5c] hover:text-[#2d3f4c] transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <div className="sticky top-32">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#3d4f5c] mb-6">
              {product.title}
            </h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl">
              <h2 className="text-2xl font-bold text-[#3d4f5c] mb-6">
                Interested in this product?
              </h2>
              <p className="text-gray-600 mb-6">
                Contact us today to discuss your requirements and receive a detailed quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+96171981996"
                  className="bg-[#3d4f5c] text-white px-8 py-3 rounded-lg hover:bg-[#2d3f4c] transition font-semibold text-center shadow-lg"
                >
                  +961 71 981 996
                </a>
                <a
                  href="tel:+2250150191162"
                  className="bg-[#3d4f5c] text-white px-8 py-3 rounded-lg hover:bg-[#2d3f4c] transition font-semibold text-center shadow-lg"
                >
                  +225 01 50 19 11 62
                </a>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-[#3d4f5c] mb-4">Our Expertise</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#3d4f5c] rounded-full"></span>
                  Over 30 years of manufacturing experience
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#3d4f5c] rounded-full"></span>
                  Premium quality materials and craftsmanship
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#3d4f5c] rounded-full"></span>
                  Custom fabrication to your specifications
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#3d4f5c] rounded-full"></span>
                  Professional installation available
                </li>
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-20">
          <h2 className="text-3xl font-bold text-[#3d4f5c] mb-8 text-center">
            Other Products
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition">
                  <img
                    src={relatedProduct.image_url}
                    alt={relatedProduct.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-[#3d4f5c] group-hover:text-[#2d3f4c] transition">
                      {relatedProduct.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
