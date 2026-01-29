'use client';

import Link from "next/link";

const Footer = () => {
    return <footer className="bg-black/90 shadow-lg mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Company Info */}
            <div>
                <h3 className="text-xl font-semibold text-blue-300 hover:text-yellow-500">✺ Tank Corporation</h3>
                <p className="text-gray-500 mt-3">
                    Delivering quality products with a seamless shopping experience.
                </p>
                <p className="text-gray-500 mt-2">© 2026 All rights reserved.</p>
            </div>
            {/* Column 2: Quick Links */}
            <div>
                <h3 className="text-xl font-semibold text-gray-500 cursor-default">Quick Links</h3>
                <ul className="mt-3 space-y-2">
                    <li>
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-blue-300 transition"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/projects"
                            className="text-gray-500 hover:text-blue-300 transition"
                        >
                            Projects
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/about"
                            className="text-gray-500 hover:text-blue-300 transition"
                        >
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/blog"
                            className="text-gray-500 hover:text-blue-300 transition"
                        >
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>
            {/* Column 3: Customer Service */}
            <div>
                <h3 className="text-xl font-semibold text-gray-500 cursor-default">Customer Service</h3>
                <ul className="mt-3 space-y-2">
                    <li>
                        <Link
                            href="/faqs"
                            className="text-gray-500 hover:text-blue-300 transition"
                        >
                            FAQs
                        </Link>
                    </li>
                    
                    <li>
                        <Link
                            href="/privacy-policy"
                            className="text-gray-500 hover:text-blue-300 transition"
                        >
                            Privacy Policy
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/terms-conditions"
                            className="text-gray-500 hover:text-blue-300 transition"
                        >
                            Terms &amp; Conditions
                        </Link>
                    </li>
                </ul>
            </div>
            {/* Column 4: Newsletter Subscription */}
            <div>
                <h3 className="text-xl font-semibold text-gray-500 cursor-default">Stay Updated</h3>
                <p className="text-gray-500 mt-3">
                    Subscribe to our newsletter for exclusive deals and updates.
                </p>
                <div className="mt-4 flex">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 text-[#F4F1EC] rounded-l-lg focus:outline-none focus:ring-1 focus:border-yellow-500"
                    />
                    <button className="bg-[#F4F1EC] hover:bg-blue-300 text-gray-700 px-4 py-3 rounded-r-lg transition">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 py-4 text-center text-gray-500 text-sm">
            Made with ❤️ by Dodi Tank
        </div>
    </footer>

}
export default Footer;