import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I submit a proposal for my community?",
      answer: "After signing up and completing your profile, navigate to the 'Add Proposals' section. Fill in the proposal details including title, description, budget, and location. Your proposal will be visible to other community members for voting."
    },
    {
      question: "Who can vote on proposals?",
      answer: "All registered users from the same constituency can vote on proposals. You need to complete your profile with your constituency details to participate in voting for local proposals."
    },
    {
      question: "How does the MLA approval process work?",
      answer: "Once a proposal receives sufficient community support through votes, it's forwarded to your elected MLA for review. MLAs can approve, reject, or request modifications to proposals based on feasibility and budget considerations."
    },
    {
      question: "Can I track the progress of approved proposals?",
      answer: "Yes! All approved proposals have a progress tracking feature where you can see implementation milestones, budget utilization, and current status. This ensures transparency in project execution."
    },
    {
      question: "What types of proposals can I submit?",
      answer: "You can submit proposals for infrastructure development, community services, public amenities, healthcare facilities, educational improvements, and other projects that benefit your local community."
    },
   
    {
      question: "How do I know if my proposal is being considered?",
      answer: "You'll receive real-time notifications about your proposal status. You can also check the 'Your Proposals' section to see voting progress, community feedback, and approval status."
    },
   
    {
      question: "What happens if my proposal gets rejected?",
      answer: "If a proposal is rejected, you'll receive feedback explaining the reasons. You can submit a completely new proposal."
    },
    {
      question: "How are proposal budgets determined?",
      answer: "When submitting a proposal, you provide an estimated budget. MLAs and relevant authorities review the budget for feasibility and may adjust it based on available funds and project scope."
    },
    {
      question: "Can I collaborate with others on a proposal?",
      answer: "While the platform currently supports individual submissions, you can discuss ideas with community members through the platform and gather support before submitting your proposal."
    },
    {
      question: "How often are new proposals reviewed by MLAs?",
      answer: "MLAs have access to their dashboard where they can review proposals in real-time. The review frequency depends on the individual MLA"
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about participating in community development 
            through our platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <div className="bg-indigo-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <button onClick={()=>navigate('/contact') }className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
