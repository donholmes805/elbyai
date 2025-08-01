
import React from 'react';
import Card from '../components/ui/Card';

const DocumentationPage: React.FC = () => {
    return (
        <div className="bg-brand-light py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-brand-dark">Elby AI Documentation</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Welcome to Elby AI. This guide provides a comprehensive overview of the application's features and functionalities to help you get started.
                    </p>
                </div>

                <div className="space-y-12 max-w-5xl mx-auto">
                    {/* Core Features Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-brand-dark mb-6">Core Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="p-6">
                                <h3 className="text-2xl font-bold text-brand-primary">AI Chat</h3>
                                <p className="mt-2 text-gray-600">
                                    Our core feature is a powerful AI chat interface with two distinct personas:
                                </p>
                                <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
                                    <li><strong>Elby Assistant:</strong> Your go-to AI for general legal topics, research, and document summarization.</li>
                                    <li><strong>Chain Assistant:</strong> A specialized persona for technical questions about blockchain, smart contracts, and Web3 concepts.</li>
                                </ul>
                                <p className="mt-4 text-sm text-gray-500">All conversations are saved to your account and can be downloaded as a PDF.</p>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-2xl font-bold text-brand-primary">Blockchain Legal Module</h3>
                                <p className="mt-2 text-gray-600">
                                    A suite of specialized tools for the Web3 space:
                                </p>
                                <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
                                    <li><strong>Smart Contract Analysis:</strong> Get a preliminary analysis of an Ethereum-style contract for risks under the Howey Test.</li>
                                    <li><strong>Compliance Playbook:</strong> Generate a high-level compliance guide based on your project type and jurisdiction.</li>
                                    <li><strong>Regulatory Radar:</strong> Stay updated with the latest news on digital asset regulation.</li>
                                </ul>
                            </Card>
                        </div>
                    </section>
                    
                    {/* Account & Security Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-brand-dark mb-6">Account & Security</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             <Card className="p-6">
                                <h3 className="text-xl font-bold text-brand-primary">Subscription Plans</h3>
                                <p className="mt-2 text-gray-600">We offer multiple plans to fit your needs:</p>
                                <ul className="mt-4 space-y-2 text-sm">
                                    <li><strong>Free:</strong> 5 general queries & 3 blockchain tool uses per day. Perfect for trying out our platform.</li>
                                    <li><strong>General AI:</strong> Unlimited general queries and limited blockchain tool use.</li>
                                    <li><strong>Full Access:</strong> Unlimited access to all features and tools.</li>
                                </ul>
                            </Card>
                             <Card className="p-6">
                                <h3 className="text-xl font-bold text-brand-primary">User Roles</h3>
                                <p className="mt-2 text-gray-600">The application supports a role-based access control system:</p>
                                <ul className="mt-4 space-y-2 text-sm">
                                    <li><strong>User:</strong> Standard access based on subscription plan.</li>
                                    <li><strong>Sub-Admin:</strong> Can manage users and site content.</li>
                                    <li><strong>Super Admin:</strong> Full administrative control, including payments and system health.</li>
                                </ul>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-xl font-bold text-brand-primary">Two-Factor Authentication (2FA)</h3>
                                <p className="mt-2 text-gray-600">
                                    Enhance your account security by enabling 2FA.
                                </p>
                                <p className="mt-4 text-gray-700">
                                    You can enable 2FA from the user dropdown menu in the header. Simply click "Enable 2FA" and follow the on-screen instructions to scan the QR code with an authenticator app.
                                </p>
                            </Card>
                        </div>
                    </section>
                    
                    {/* Disclaimer Section */}
                    <section>
                         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                            <h3 className="text-2xl font-bold text-yellow-800">Important Disclaimer</h3>
                            <p className="mt-2 text-yellow-700">
                                Elby AI is a powerful informational tool, but it is not a substitute for a qualified legal professional. The AI-generated content does not constitute legal advice, and no attorney-client relationship is formed by using this service. Always consult with a licensed attorney for advice on your specific situation.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DocumentationPage;
