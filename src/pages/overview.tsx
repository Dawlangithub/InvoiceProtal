import BABox from "../components/BABox";
import BAPera from "../components/BAPera";
import { Link } from "react-router";
import einvoiceLogo from "../assets/einvoiceLogo.png";

export default function Overview() {
    const currentYear = new Date().getFullYear();

    return (
        <BABox className="bg-white text-gray-800 font-sans">
            {/* Hero Section */}
            <BABox className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-[#F9FAFB]">
                <img src={einvoiceLogo} alt="eInvoice Logo" className="w-44 md:w-52 mb-6 drop-shadow-lg" />
                <h1 className="text-6xl md:text-8xl mb-4 leading-tight tracking-tight">
                    Welcome to <span className="text-[#00C5C8]">eInvoice</span>
                </h1>
                <p className="text-lg md:text-2xl max-w-2xl mb-6 text-black/90">
                    The easiest way to sync your invoices with FBR — built for business owners, accountants, and ERP users.
                </p>
                <button className="bg-white text-[#13999E] font-semibold py-3 px-8 rounded-full shadow-md hover:bg-[#e5f9f9] transition-all duration-300">
                    🚀 Book Demo
                </button>
            </BABox>

            <BABox className="py-20 px-6 bg-gray-50">
                <div className=" mx-auto text-center">
                    <h2 className="text-6xl text-[#13999E] mb-6">About Us</h2>
                    <BAPera className="text-3xl text-gray-700 max-w-3xl mx-auto mb-8">
                        At <span className="font-semibold text-[#13999E]">eInvoice</span>, we’re on a mission to simplify how businesses manage tax compliance and invoicing.
                        Built by <strong>Finosys PVT LTD</strong>, our platform bridges the gap between everyday accounting and complex FBR integrations—
                        with a user-first design and automation at its core.
                    </BAPera>
                    <div className="grid gap-8 mt-12 md:grid-cols-3">
                        {[
                            {
                                title: "🔍 Transparency",
                                desc: "We believe in clarity and openness in everything — from pricing to platform updates."
                            },
                            {
                                title: "⚙️ Innovation",
                                desc: "We’re constantly evolving to meet modern business needs with cutting-edge technology."
                            },
                            {
                                title: "🤝 Support",
                                desc: "Our team is always here to help you stay compliant, efficient, and confident."
                            }
                        ].map((item, i) => (
                            <BABox key={i} className="bg-white p-10 rounded-xl shadow hover:shadow-md transition text-left">
                                <h4 className="text-3xl font-semibold text-[#13999E] mb-2">{item.title}</h4>
                                <p className="text-xl text-gray-600">{item.desc}</p>
                            </BABox>
                        ))}
                    </div>
                </div>
            </BABox>

            <BABox className="bg-white py-20 px-6">
                <div className="mx-auto text-center py-20">
                    <h2 className="text-6xl text-[#13999E] mb-6">Company Registration Made Simple</h2>
                    <BAPera className="text-3xl text-gray-700 max-w-3xl mx-auto mb-8">
                        Whether you're launching a startup or formalizing your existing business, we streamline the entire registration process.
                        From choosing the right structure to submitting your application — we’ve got your back.
                    </BAPera>

                    <div className="grid gap-10 md:grid-cols-3 mt-12 text-left">
                        {[
                            {
                                icon: "🏢",
                                title: "Business Types",
                                desc: "Register as a Sole Proprietor, Partnership, or Private Limited Company based on your goals."
                            },
                            {
                                icon: "🗂️",
                                title: "Required Documents",
                                desc: "We guide you through collecting all necessary documents including CNICs, NTN, address proof, and more."
                            },
                            {
                                icon: "⏱️",
                                title: "Fast Processing",
                                desc: "Most companies are registered within 5–7 business days. We handle the paperwork, you focus on building."
                            }
                        ].map((item, i) => (
                            <BABox key={i} className="bg-[#f0fefe] p-6 rounded-2xl transition-all duration-300">
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h4 className="text-3xl font-semibold text-[#13999E] mb-2">{item.title}</h4>
                                <p className="text-xl text-gray-600">{item.desc}</p>
                            </BABox>
                        ))}
                    </div>

                    <div className="mt-16">
                        <h3 className="text-4xl mb-3 ">Let Us Handle the Formalities</h3>
                        <p className="text-gray-600 text-xl max-w-2xl mx-auto mb-6">
                            We partner with SECP-licensed agents and FBR-registered consultants to ensure full compliance and faster turnaround times.
                            Transparent fees. No hidden charges.
                        </p>
                        <Link className="bg-[#13999E] text-white font-bold py-3 px-8 rounded-full shadow hover:bg-[#0b6e72] transition" to={"/company-registration"}>
                            📝 Start Registration
                        </Link>
                    </div>
                </div>
            </BABox>



            {/* Features Section */}
            <BABox className="py-24 px-6 bg-gradient-to-b from-white to-[#f0fefe]">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl text-[#13999E] mb-6">✨ Core Features</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
                        Explore the powerful tools that make <strong>eInvoice</strong> the preferred solution for smart invoicing and seamless FBR integration.
                    </p>

                    <div className="grid gap-12 grid-cols-1 md:grid-cols-3">
                        {[
                            {
                                icon: "📊",
                                title: "Excel Upload",
                                desc: "Bulk upload your invoices via Excel with instant feedback and auto-validation to save time and reduce errors."
                            },
                            {
                                icon: "📝",
                                title: "Manual Invoice",
                                desc: "Create invoices in seconds using our intuitive UI, complete with real-time checks to ensure compliance."
                            },
                            {
                                icon: "🔗",
                                title: "ERP Integration",
                                desc: "Connect your ERP system directly to FBR — eliminate manual steps and automate invoice syncing effortlessly."
                            }
                        ].map((feature, i) => (
                            <BABox
                                key={i}
                                className="bg-white p-8 rounded-3xl border border-[#13999E] transition duration-300 transform hover:-translate-y-2 text-left"
                            >
                                <div className="text-[#13999E] text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-2xl font-bold mb-3 text-[#0b6e72]">{feature.title}</h3>
                                <BAPera className="text-base text-gray-600 leading-relaxed">
                                    {feature.desc}
                                </BAPera>
                            </BABox>
                        ))}
                    </div>
                </div>
            </BABox>


            {/* How It Works */}
            <BABox className="bg-gradient-to-b from-[#f0fefe] to-white py-24 px-6">
                <div className="mx-auto text-center">
                    <h2 className="text-4xl text-[#13999E] mb-6">🛠 How It Works</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
                        From invoice creation to real-time syncing with FBR — our 3-step process is designed for speed, simplicity, and reliability.
                    </p>

                    <div className="grid gap-12 md:grid-cols-3 text-left">
                        {[
                            {
                                step: "1",
                                title: "Upload or Create",
                                desc: "Start by uploading invoices via Excel or create them manually with our intuitive builder.",
                                bg: "from-[#13999E] to-[#0b6e72]"
                            },
                            {
                                step: "2",
                                title: "Validate",
                                desc: "Our system auto-detects errors and helps you resolve them in real-time to ensure compliance.",
                                bg: "from-[#13A2A8] to-[#0d8286]"
                            },
                            {
                                step: "3",
                                title: "Sync",
                                desc: "With one click, submit directly to FBR using our secure and reliable API connection.",
                                bg: "from-[#15B3BA] to-[#0c9196]"
                            }
                        ].map((item, i) => (
                            <BABox
                                key={i}
                                className={`rounded-3xl p-8 text-white bg-gradient-to-br ${item.bg} hover:scale-[1.03] transition-transform`}
                            >
                                <div className="text-5xl font-extrabold mb-4 opacity-90">{item.step}</div>
                                <h4 className="text-2xl font-semibold mb-2">{item.title}</h4>
                                <p className="text-base leading-relaxed opacity-95">{item.desc}</p>
                            </BABox>
                        ))}
                    </div>
                </div>
            </BABox>


            {/* Pricing Section */}
            <BABox className="py-20 px-6 max-w-7xl mx-auto">
                <h2 className="text-4xl text-center mb-16 text-[#13999E]">💸 Pricing Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                    {[
                        {
                            name: "Free",
                            price: "PKR 0",
                            features: ["Manual Invoice", "Excel Upload", "Basic Validation"],
                            highlight: false
                        },
                        {
                            name: "Pro",
                            price: "PKR 5,000/month",
                            features: ["All Free Features", "Advanced Validation", "Priority Support"],
                            highlight: true
                        },
                        {
                            name: "Enterprise",
                            price: "Custom",
                            features: ["Full ERP Integration", "Dedicated Support", "Custom Workflows"],
                            highlight: false
                        }
                    ].map((plan, idx) => (
                        <BABox
                            key={idx}
                            className={`border rounded-2xl p-8 shadow-md transition-all ${plan.highlight
                                ? "border-[#13999E] bg-[#f0fefe] scale-105"
                                : "border-gray-200"
                                }`}
                        >
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-3xl font-semibold text-[#13999E] mb-6">{plan.price}</p>
                            <ul className="text-base text-gray-600 space-y-3 mb-8">
                                {plan.features.map((f, i) => (
                                    <li key={i}>✅ {f}</li>
                                ))}
                            </ul>
                            <button className="bg-[#13999E] text-white px-6 py-3 rounded-full font-medium hover:bg-[#0b6e72] transition">
                                {plan.name === "Enterprise" ? "Contact Us" : "Choose Plan"}
                            </button>
                        </BABox>
                    ))}
                </div>
            </BABox>

            {/* CTA Section */}
            <BABox className="py-20 bg-[#13999E] text-white text-center px-6">
                <h2 className="text-4xl font-bold mb-4">🚀 Start Syncing with FBR Today</h2>
                <p className="text-lg mb-8">Join hundreds of businesses who trust eInvoice for compliance and automation.</p>
                <button className="bg-white text-[#13999E] font-bold py-3 px-8 rounded-full shadow hover:bg-[#d6f4f4] transition">
                    Book Demo
                </button>
            </BABox>

            {/* Footer */}
            <BABox className="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
                &copy; {currentYear} Finosys PVT LTD. All rights reserved.
            </BABox>
        </BABox>
    );
}
