"use client"
import React from 'react';
import { motion } from 'framer-motion';
import {
    BrainCircuit,
    Users,
    Zap,
    ArrowRight,
    Github,
    BookOpen,
    MessageSquare,
    Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// Animation variants
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } },
};

const slideIn = {
    hidden: { x: -50 },
    visible: { x: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
};

export default function MoccetPlatformLandingPage() {

  return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col">
            {/* Hero Section */}
            <header className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={slideIn}
                    className="text-center md:text-left space-y-4"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">
                        Moccet Assessment Platform
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-2xl">
                        Orchestrate AI agents and human experts to build the future, collaboratively.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Link href="/flow">
                        <Button
                            variant="default"
                            size="lg"
                            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600"
                            
                        >
                            Get Started <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        </Link>
                    </div>
                </motion.div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="w-full md:w-1/2 flex justify-center"
                >
                    {/* Placeholder for a visually striking image or 3D model */}
                    <div className="w-full max-w-md h-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 flex items-center justify-center">
                        <BrainCircuit className="w-24 h-24 text-blue-400/50 animate-pulse" />
                    </div>
                </motion.div>
            </header>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-center mb-12 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                    Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{ ...fadeIn, transitionDelay: 0.2 }}
                    >
                        <Card className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                    <BrainCircuit className="w-5 h-5 text-blue-400" />
                                    AI Agent Orchestration
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Seamlessly manage and coordinate multiple AI agents.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-gray-300">
                                    <li>Intelligent task delegation</li>
                                    <li>Workflow automation</li>
                                    <li>Scalable architecture</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{ ...fadeIn, transitionDelay: 0.4 }}
                    >
                        <Card className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-green-400" />
                                    Human-AI Collaboration
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Empower human experts with AI assistance.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-gray-300">
                                    <li>Intuitive interfaces</li>
                                    <li>Real-time interaction</li>
                                    <li>Knowledge sharing</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{ ...fadeIn, transitionDelay: 0.6 }}
                    >
                        <Card className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-purple-400" />
                                    Customizable Workflows
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Adapt the platform to your specific needs.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-gray-300">
                                    <li>Flexible task management</li>
                                    <li>Configurable agents</li>
                                    <li>Extensible architecture</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="bg-gray-800 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-center mb-12 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                        Explore Use Cases
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="bg-gray-900 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-white">Software Development</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Automate coding, testing, and deployment processes.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-gray-300">
                                    <li>Code generation</li>
                                    <li>Bug detection</li>
                                    <li>Continuous integration</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-white">Scientific Research</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Accelerate discovery with AI-assisted analysis.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <ul className="list-disc list-inside space-y-2 text-gray-300">
                                    <li>Data analysis</li>
                                    <li>Hypothesis generation</li>
                                    <li>Experiment automation</li>
                                </ul>
                            </CardContent>
                        </Card>
                         <Card className="bg-gray-900 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-white">Creative Content</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Generate new content.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <ul className="list-disc list-inside space-y-2 text-gray-300">
                                    <li>Text generation</li>
                                    <li>Image creation</li>
                                    <li>Assisted composition</li>
                                </ul>
                            </CardContent>
                        </Card>
                         <Card className="bg-gray-900 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-white">Business Automation</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Streamline business operations.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <ul className="list-disc list-inside space-y-2 text-gray-300">
                                    <li>Process automation</li>
                                    <li>Decision support</li>
                                    <li>Workflow optimization</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-semibold mb-8 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                    Join the Community
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12">
                    Connect with other users, developers, and researchers.  Help shape the future of collaborative AI.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                    <Button
                        variant="outline"
                        size="lg"
                        className="text-white border-gray-700 hover:bg-gray-800/50 hover:border-gray-600 flex items-center gap-2"
                        onClick={() => window.open('https://github.com/', '_blank')} // Replace with actual GitHub link
                    >
                        <Github className="w-5 h-5" /> GitHub
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="text-white border-gray-700 hover:bg-gray-800/50 hover:border-gray-600 flex items-center gap-2"
                         onClick={() => window.open('https://discord.com/', '_blank')} // Replace with actual Discord
                    >
                        <MessageSquare className="w-5 h-5" /> Discord
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="text-white border-gray-700 hover:bg-gray-800/50 hover:border-gray-600 flex items-center gap-2"
                    >
                        <BookOpen className="w-5 h-5" /> Documentation
                    </Button>
                     <Button
                        variant="outline"
                        size="lg"
                        className="text-white border-gray-700 hover:bg-gray-800/50 hover:border-gray-600 flex items-center gap-2"
                    >
                        <Mail className="w-5 h-5" /> Contact Us
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Moccet Assessment Platform. All rights reserved.</p>
                    <p>
                        <span
                            className="hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </span>
                        {' | '}
                        <span
                            className="hover:text-white transition-colors"
                        >
                            Terms of Service
                        </span>
                    </p>
                </div>
            </footer>
        </div>
    );
};
