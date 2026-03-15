import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/public-layout';

export default function Welcome() {
    const featuredProducts = [
        {
            id: 1,
            name: 'Wireless Headphone',
            price: '$129',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 2,
            name: 'Smart Watch',
            price: '$199',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 3,
            name: 'Modern Sneakers',
            price: '$149',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 4,
            name: 'Leather Backpack',
            price: '$89',
            image: 'https://hazzle.com.bd/cdn/shop/files/12_9ca28ae3-266c-45ee-8c77-88aa29c39362.png?v=1720087911',
        },
    ];
    const categories = [
        { name: 'Electronics', icon: '📱' },
        { name: 'Fashion', icon: '👕' },
        { name: 'Shoes', icon: '👟' },
        { name: 'Accessories', icon: '👜' },
    ];

    return (
        <AppLayout>
            <Head title="Welcome" />

            <div className='mt-2'>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
                    <div className="mx-auto max-w-7xl px-6 py-20 lg:flex lg:items-center lg:justify-between lg:px-8">
                        <div className="max-w-2xl">
                            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-sm backdrop-blur">
                                New Collection 2026
                            </span>
                            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                                Discover Premium Products for Your Lifestyle
                            </h1>
                            <p className="mt-6 text-lg text-gray-300">
                                Shop the latest fashion, electronics, and accessories
                                with exclusive deals and fast delivery.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <a
                                    href="#products"
                                    className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-gray-200"
                                >
                                    Shop Now
                                </a>
                                <a
                                    href="#categories"
                                    className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                                >
                                    Explore Categories
                                </a>
                            </div>
                        </div>

                        <div className="mt-12 lg:mt-0 lg:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80"
                                alt="Ecommerce Hero"
                                className="w-full rounded-3xl shadow-2xl"
                            />
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-3 lg:px-8">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold">Free Shipping</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Enjoy free shipping on all orders over $99.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold">Secure Payment</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            100% secure payment with trusted payment gateways.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold">24/7 Support</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Our team is always here to help you anytime.
                        </p>
                    </div>
                </section>

                {/* Categories */}
                <section id="categories" className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold">Shop by Category</h2>
                            <p className="mt-2 text-gray-600">
                                Browse our most popular categories.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {categories.map((category) => (
                            <div
                                key={category.name}
                                className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="text-4xl">{category.icon}</div>
                                <h3 className="mt-4 text-lg font-semibold">{category.name}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured Products */}
                <section id="products" className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold">Featured Products</h2>
                            <p className="mt-2 text-gray-600">
                                Hand-picked items just for you.
                            </p>
                        </div>
                        <a
                            href="#"
                            className="text-sm font-semibold text-slate-900 hover:underline"
                        >
                            View All Products
                        </a>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-64 w-full object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                    <p className="mt-2 text-xl font-bold text-slate-900">
                                        {product.price}
                                    </p>
                                    <button className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Promo Banner */}
                <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                    <div className="rounded-3xl bg-slate-900 px-8 py-14 text-center text-white">
                        <h2 className="text-3xl font-bold md:text-4xl">
                            Get 30% Off on Selected Items
                        </h2>
                        <p className="mt-4 text-gray-300">
                            Limited time offer. Grab your favorite products before they’re gone.
                        </p>
                        <button className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-gray-200">
                            Shop Deals
                        </button>
                    </div>
                </section>

                {/* Newsletter */}
                <section className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
                    <h2 className="text-3xl font-bold">Subscribe to Our Newsletter</h2>
                    <p className="mt-3 text-gray-600">
                        Get updates on new arrivals, exclusive offers, and promotions.
                    </p>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-900 sm:max-w-md"
                        />
                        <button className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700">
                            Subscribe
                        </button>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
