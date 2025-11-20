import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, Shield } from 'lucide-react';

const HomePage = () => {
    console.log('homePage');
    return (
        <div className="min-h-screen">

            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
    <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center">
    <h1 className="text-5xl font-bold mb-6">
        Your Health, Our Priority
    </h1>
    <p className="text-xl mb-8">
        Book appointments with top healthcare professionals in minutes
    </p>
    <div className="flex gap-4 justify-center">
    <Link
        to="/register"
    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
        Get Started
    </Link>
    <Link
    to="/doctors"
    className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
        >
        Find Doctors
    </Link>
    </div>
    </div>
    </div>
    </section>

    {/* Features Section */}
    <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">
        Why Choose Us?
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
        <div className="text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar className="text-blue-600" size={32} />
    </div>
    <h3 className="font-semibold mb-2">Easy Booking</h3>
    <p className="text-gray-600">
        Book appointments in just a few clicks
    </p>
    </div>

    <div className="text-center">
    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
    <Users className="text-blue-600" size={32} />
    </div>
    <h3 className="font-semibold mb-2">Expert Doctors</h3>
    <p className="text-gray-600">
        Access to qualified healthcare professionals
    </p>
    </div>

    <div className="text-center">
    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
    <Clock className="text-blue-600" size={32} />
    </div>
    <h3 className="font-semibold mb-2">24/7 Support</h3>
    <p className="text-gray-600">
        Round-the-clock customer service
    </p>
    </div>

    <div className="text-center">
    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
    <Shield className="text-blue-600" size={32} />
    </div>
    <h3 className="font-semibold mb-2">Secure & Private</h3>
        <p className="text-gray-600">
        Your health data is safe with us
    </p>
    </div>
    </div>
    </div>
    </section>

    {/* CTA Section */}
    <section className="py-16">
    <div className="container mx-auto px-4">
    <div className="bg-blue-600 text-white rounded-2xl p-12 text-center">
    <h2 className="text-3xl font-bold mb-4">
        Ready to Get Started?
        </h2>
        <p className="text-xl mb-8">
            Join thousands of patients who trust us with their health
    </p>
    <Link
    to="/register"
    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
        >
        Create Account
    </Link>
    </div>
    </div>
    </section>
    </div>
);
};

export default HomePage;